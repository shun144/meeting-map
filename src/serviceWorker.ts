import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import {
  fetchPMTiles,
  savePMTiles,
  fetchAllDestinations,
  saveDestinations,
} from "./lib/indexedDB/database";
declare let self: ServiceWorkerGlobalScope;

// 古いバージョンのworkboxで追加されたキャッシュを自動削除する
// workboxのバージョン変更があった場合に、古いバージョンのworkboxのキャッシュを削除する
cleanupOutdatedCaches();

// プリキャッシュの設定
// installイベント時にself.__WB_MANIFESTに含まれるすべてのファイルをキャッシュに保存
// fetchイベント時に、リクエストされたURLがプリキャッシュにあれば、キャッシュから返す
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("install", (event) => {
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

  const isPmtiles = url.pathname.endsWith(".pmtiles");

  const isDestinationFetchQuery =
    method === "GET" &&
    url.pathname.includes("/rest/v1/destination") &&
    params.get("select") === "*" &&
    params.has("map_id");

  if (isPmtiles) {
    handlePMTilesRequest(event, url);
    return;
  }

  if (isDestinationFetchQuery) {
    handleDestinationRequest(event, params);
    return;
  }
});

function handlePMTilesRequest(event: FetchEvent, url: URL) {
  const regex = /(?<version>version\d+)\/(?<area>[^\/]+)\.pmtiles$/;
  const matchGroups = url.pathname?.match(regex)?.groups;

  if (!matchGroups) return;

  const { area, version } = matchGroups;

  event.respondWith(
    (async () => {
      const resDB = await fetchPMTiles([area, version]);

      if (resDB && resDB.pmtiles) {
        // キャッシュヒット
        const rangeHeader = event.request.headers.get("Range");

        if (rangeHeader) {
          const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
          if (match) {
            const start = parseInt(match[1], 10);
            const end = match[2]
              ? parseInt(match[2], 10)
              : resDB.pmtiles.byteLength - 1;

            const slicedBuffer = resDB.pmtiles.slice(start, end + 1);

            const response = new Response(slicedBuffer, {
              status: 206,
              headers: {
                "content-type": "binary/octet-stream",
                "Content-Length": `${slicedBuffer.byteLength}`,
                "Content-Range": `bytes ${start}-${end}/${resDB.pmtiles.byteLength}`,
                "Accept-Ranges": "bytes",
              },
            });
            return response;
          }
        }

        return new Response(resDB.pmtiles, {
          status: 200,
          headers: {
            "Content-Type": "binary/octet-stream",
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
          const fullRange = await fetch(url.href);
          const pmtiles = await fullRange.arrayBuffer();
          await savePMTiles({ area, version, pmtiles });
        })(),
      );

      return orgRes;
    })(),
  );
}

function handleDestinationRequest(event: FetchEvent, params: URLSearchParams) {
  const regex = /eq\.(?<map_id>.*$)/;
  const matchGroups = params.get("map_id")?.match(regex)?.groups;

  if (!matchGroups) return;
  const { map_id } = matchGroups;

  event.respondWith(
    (async () => {
      const cached = await fetchAllDestinations(map_id);

      if (cached.length > 0) {
        const headers = new Headers({
          "Content-Type": "application/json; charset=utf-8",
          "x-cache-source": "indexeddb",
        });

        const response = new Response(JSON.stringify(cached), {
          status: 200,
          headers,
        });
        return response;
      }

      const orgRes = await fetch(event.request);
      if (!orgRes.ok) return orgRes;

      const clonedRes = orgRes.clone();
      event.waitUntil(
        (async () => {
          const destinations = (await clonedRes.json()) as {
            id: number;
            title: string;
            lat: number;
            lng: number;
          }[];

          const payloads = destinations.map(({ id, title, lat, lng }) => ({
            map_id,
            id,
            title,
            lat,
            lng,
          }));

          saveDestinations(payloads);
        })(),
      );

      return orgRes;
    })(),
  );

  return;
}
