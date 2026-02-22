import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import {
  fetchAllDestinations,
  fetchMap,
  fetchMaps,
  fetchPMTiles,
  restoreDestinationByMapId,
  restoreMaps,
  savePMTiles,
} from "./lib/indexedDB/database";
import { supabase } from "./lib/supabase/supabaseClient";
import { DestinationCache, MapCache } from "./lib/indexedDB/types";

declare let self: ServiceWorkerGlobalScope;

// 古いバージョンのworkboxで追加されたキャッシュを自動削除する
// workboxのバージョン変更があった場合に、古いバージョンのworkboxのキャッシュを削除する
cleanupOutdatedCaches();

// プリキャッシュの設定
// installイベント時にself.__WB_MANIFESTに含まれるすべてのファイルをキャッシュに保存
// fetchイベント時に、リクエストされたURLがプリキャッシュにあれば、キャッシュから返す
precacheAndRoute(self.__WB_MANIFEST);

// react-routerによる仮想ナビゲーションをservice workerに伝える
const handler = createHandlerBoundToURL("/index.html");
const navigationRoute = new NavigationRoute(handler, {
  allowlist: [
    /^\/$/, // ルートパス
    /^\/map\//, // /map/で始まるパス
  ],
});
registerRoute(navigationRoute);

self.addEventListener("install", () => {
  // 待機しているサービスワーカーがアクティブになるように強制
  // onActivateのevent.waitUntil(self.clients.claim())と併用することで
  // サービスワーカーの更新が即座に反映される
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const params = url.searchParams;
  const method = event.request.method;

  // 特定マップの存在チェック
  const isMapFetchQuery =
    method === "GET" &&
    url.pathname.includes("/rest/v1/map") &&
    params.get("select") === "id" &&
    params.has("id");

  if (isMapFetchQuery) {
    const response = handleMapRequest(event, params);
    event.respondWith(response);
    return;
  }

  // 全マップ情報の取得
  const isAllMapsFetchQuery =
    method === "GET" &&
    url.pathname.includes("/rest/v1/map") &&
    params.get("select") === "id,name,updated_at";

  if (isAllMapsFetchQuery) {
    const response = handleAllMapsRequest(event);
    event.respondWith(response);
    return;
  }

  // pmtilesファイルの取得
  const isPMTilesQuery = url.pathname.endsWith(".pmtiles");
  if (isPMTilesQuery) {
    const response = handlePMTilesRequest(event, url);
    event.respondWith(response);
    return;
  }

  // 目的地情報の取得
  const isDestinationFetchQuery =
    method === "GET" &&
    url.pathname.includes("/rest/v1/destination") &&
    params.get("select") === "*" &&
    params.has("map_id");
  if (isDestinationFetchQuery) {
    const response = handleDestinationRequest(event, params);
    event.respondWith(response);
    return;
  }
});

async function handleMapRequest(event: FetchEvent, params: URLSearchParams) {
  const regex = /eq\.(?<id>.*)/;
  const matchGroups = params.get("id")?.match(regex)?.groups;
  if (!matchGroups) {
    return fetch(event.request);
  }
  const { id } = matchGroups;
  const cached = await fetchMap(id).catch(() => null);
  if (cached) {
    const headers = new Headers({
      "Content-Type": "application/json; charset=utf-8",
      "x-cache-source": "indexeddb",
    });

    return new Response(JSON.stringify(cached), {
      status: 200,
      headers,
    });
  }

  return fetch(event.request);
}

async function handleAllMapsRequest(event: FetchEvent) {
  const cached = await fetchMaps().catch(() => [] as MapCache[]);

  const { data: serverMeta, error: serverError } = await supabase
    .from("map")
    .select("id,updated_at")
    .eq("invalid_flg", false);

  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "x-cache-source": "indexeddb",
  });

  if (serverError) {
    // fetchエラーの場合キャッシュを返す
    return new Response(JSON.stringify(cached), {
      status: 200,
      headers,
    });
  }

  const serverMetaStr = serverMeta
    .map((x) => `${x.id}${x.updated_at}`)
    .sort()
    .join();

  const cachedMetaStr = cached
    .map((x) => `${x.id}${x.updated_at}`)
    .sort()
    .join();

  // キャッシュとsupabaseの保持情報が同じ場合キャッシュを返す
  // 比較はidとupdated_atで行う
  if (serverMetaStr === cachedMetaStr) {
    return new Response(JSON.stringify(cached), {
      status: 200,
      headers,
    });
  }

  const response = await fetch(event.request);
  if (!response.ok) return response;
  const clonedResponse = response.clone();
  event.waitUntil(
    (async () => {
      const payloads = (await clonedResponse.json()) as MapCache[];
      // DBとキャッシュデータの整合性が一致するようにキャッシュをリストア
      await restoreMaps(payloads).catch((error) => console.error(error));
    })(),
  );
  return response;
}

async function handlePMTilesRequest(event: FetchEvent, url: URL) {
  const regex = /(?<version>version\d+)\/(?<area>[^\/]+)\.pmtiles$/;
  const matchGroups = url.pathname?.match(regex)?.groups;
  if (!matchGroups) {
    return new Response(
      "PMTilesのURLフォーマットが不正です。期待するパス形式: version{数字}/{エリア名}.pmtiles",
      {
        status: 400,
      },
    );
  }
  const { area, version } = matchGroups;
  const resDB = await fetchPMTiles([area, version]).catch(() => null);
  if (resDB && resDB.pmtiles) {
    // キャッシュヒットの場合、indexedDBに保持しているpmtilesをpartial contentで返却
    // range取得している
    const rangeHeader = event.request.headers.get("Range");

    if (rangeHeader) {
      const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
      if (match) {
        // 206 Partial Contentで返却
        const start = parseInt(match[1], 10);
        const end = match[2]
          ? parseInt(match[2], 10)
          : resDB.pmtiles.byteLength - 1;

        const slicedBuffer = resDB.pmtiles.slice(start, end + 1);
        const partialRes = new Response(slicedBuffer, {
          status: 206,
          headers: {
            "Content-Type": "application/octet-stream",
            "Content-Length": `${slicedBuffer.byteLength}`,
            "Content-Range": `bytes ${start}-${end}/${resDB.pmtiles.byteLength}`,
            "Accept-Ranges": "bytes",
          },
        });
        return partialRes;
      }
    }

    // rangeヘッダーにbytesの指定が無い場合、全量のpmtilesを返却
    return new Response(resDB.pmtiles, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Length": `${resDB.pmtiles.byteLength}`,
        "Accept-Ranges": "bytes",
      },
    });
  }

  // キャッシュミス
  const orgRes = await fetch(event.request);
  if (!orgRes.ok) return orgRes;

  // indexedDBにpmtiles全量を保存
  event.waitUntil(
    (async () => {
      // rangeヘッダーを使わず素のfetchでpmtilesファイル（全量）を取得
      const fullRange = await fetch(url.href);
      const pmtiles = await fullRange.arrayBuffer();
      await savePMTiles({ area, version, pmtiles }).catch((error) =>
        console.error(error),
      );
    })(),
  );

  return orgRes;
}

async function handleDestinationRequest(
  event: FetchEvent,
  params: URLSearchParams,
) {
  const regex = /eq\.(?<map_id>.*$)/;
  const matchGroups = params.get("map_id")?.match(regex)?.groups;

  if (!matchGroups) {
    return new Response("目的地取得URLのフォーマットが不正です", {
      status: 400,
    });
  }
  const { map_id } = matchGroups;

  const cached = await fetchAllDestinations(map_id).catch(
    () => [] as DestinationCache[],
  );

  const { data: serverMeta, error: serverError } = await supabase
    .from("destination")
    .select("id,updated_at");

  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "x-cache-source": "indexeddb",
  });

  if (serverError) {
    // fetchエラーの場合キャッシュを返す(オフライン対応)
    return new Response(JSON.stringify(cached), {
      status: 200,
      headers,
    });
  }

  const serverMetaStr = serverMeta
    .map((x) => `${x.id}${x.updated_at}`)
    .sort()
    .join();

  const cachedMetaStr = cached
    .map((x) => `${x.id}${x.updated_at}`)
    .sort()
    .join();

  // キャッシュとsupabaseの保持情報が同じ場合キャッシュを返す
  // 比較はidとupdated_atで行う
  if (serverMetaStr === cachedMetaStr) {
    return new Response(JSON.stringify(cached), {
      status: 200,
      headers,
    });
  }

  const response = await fetch(event.request);
  if (!response.ok) return response;

  const clonedResponse = response.clone();
  event.waitUntil(
    (async () => {
      const payloads = (await clonedResponse.json()) as DestinationCache[];

      // DBとキャッシュデータの整合性が一致するようにキャッシュをリストア
      await restoreDestinationByMapId(map_id, payloads).catch((error) =>
        console.error(error),
      );
    })(),
  );

  return response;
}
