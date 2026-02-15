import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";

// 古いバージョンのworkboxで追加されたキャッシュを自動削除する
// workboxのバージョン変更があった場合に、古いバージョンのworkboxのキャッシュを削除する
cleanupOutdatedCaches();

// プリキャッシュの設定
// installイベント時にself.__WB_MANIFESTに含まれるすべてのファイルをキャッシュに保存
// fetchイベント時に、リクエストされたURLがプリキャッシュにあれば、キャッシュから返す
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("install", function (event) {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

const DATABASE_NAME = "offlineMapDataBase";
const DATABASE_VERSION = 5;
const OBJECT_STORE_PMTILES = "pmtiles";
const OBJECT_STORE_DESTINATIONS = "destinations";

const openDatabase = () => {
  return new Promise((resolve, reject) => {
    // この時点では、まだデータベースは開かれていない
    // requestは「データベースを開く作業を表すオブジェクト」
    const openRequest = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    // データベースが初めて作成される時、またはバージョンが上がった時のイベント
    openRequest.onupgradeneeded = function (event) {
      const db = this.result;
      const oldVersion = event.oldVersion;

      // 古いバージョンなら全削除して再作成
      if (oldVersion > 0) {
        // 既存のオブジェクトストアを全削除
        const storeNames = Array.from(db.objectStoreNames);
        storeNames.forEach((name) => {
          db.deleteObjectStore(name);
        });
      }

      db.createObjectStore(OBJECT_STORE_PMTILES, {
        keyPath: ["area", "version"],
      });

      const storeDestination = db.createObjectStore(OBJECT_STORE_DESTINATIONS, {
        keyPath: ["map_id", "id"],
      });

      storeDestination.createIndex("map_idx", "map_id", {
        unique: false,
      });
    };

    openRequest.onsuccess = function () {
      const db = this.result;
      resolve(db);
    };

    openRequest.onerror = function () {
      reject(this.error);
    };
  });
};

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const params = url.searchParams;
  const method = event.request.method;

  if (url.pathname.endsWith(".pmtiles")) {
    handlePMTilesRequest(event, url);
    return;
  }

  const isDestinationFetchQuery =
    method === "GET" &&
    url.pathname.includes("/rest/v1/destination") &&
    params.get("select") === "*" &&
    params.has("map_id");

  if (isDestinationFetchQuery) {
    const regex = /eq\.(?<map_id>.*$)/;
    const { map_id } = params.get("map_id")?.match(regex)?.groups;

    event.respondWith(
      (async () => {
        const cached = await getAllData(OBJECT_STORE_DESTINATIONS, map_id);

        if (cached) {
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
            const destinations = await clonedRes.json();

            const promises = destinations.map(({ id, title, lat, lng }) => {
              const data = {
                map_id,
                id,
                title,
                lat,
                lng,
              };
              saveData(OBJECT_STORE_DESTINATIONS, data);
            });

            await Promise.allSettled(promises);
          })(),
        );

        return orgRes;
      })(),
    );

    return;
  }
});

// ヘッダー保存戦略の設定
const HEADER_STRATEGY = {
  // 必ず保存するヘッダー
  required: ["content-type", "content-range", "content-profile", "vary"],

  // オプションで保存（あれば保存）
  optional: [
    "cache-control",
    "etag",
    "last-modified",
    "content-encoding",
    "vary",
  ],

  // 除外するヘッダー（セキュリティ・一時的なもの）
  exclude: [
    "set-cookie",
    "cf-ray",
    "x-envoy-attempt-count",
    "x-envoy-upstream-service-time",
    "server-timing",
    "date",
  ],
};

function extractHeaders(headers) {
  const extracted = {};

  HEADER_STRATEGY.required.forEach((key) => {
    const value = headers.get(key);
    if (value) extracted[key] = value;
  });

  HEADER_STRATEGY.optional.forEach((key) => {
    const value = headers.get(key);
    if (value) extracted[key] = value;
  });

  return extracted;
}

function handlePMTilesRequest(event, url) {
  const regex = /(?<version>version\d+)\/(?<area>[^\/]+)\.pmtiles$/;
  const { area, version } = url.pathname.match(regex).groups;

  event.respondWith(
    (async () => {
      try {
        const resDB = await getData(OBJECT_STORE_PMTILES, [area, version]);

        if (resDB && resDB.pmtiles) {
          // キャッシュヒット
          return createPMTilesResponse(event.request, resDB.pmtiles);
        }

        // キャッシュミス
        const orgRes = await fetch(event.request);
        if (!orgRes.ok) return orgRes;

        // indexedDBにpmtiles全量を保存
        event.waitUntil(
          (async () => {
            try {
              const fullRange = await fetch(url.href);
              const pmtiles = await fullRange.arrayBuffer();
              await saveData(OBJECT_STORE_PMTILES, { area, version, pmtiles });
            } catch (error) {
              console.error("全量取得に失敗しました", error);
            }
          })(),
        );

        return orgRes;
      } catch (error) {}
    })(),
  );
}

function createPMTilesResponse(request, arrayBuffer) {
  const rangeHeader = request.headers.get("Range");

  try {
    if (rangeHeader) {
      const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
      if (match) {
        const start = parseInt(match[1], 10);
        const end = match[2]
          ? parseInt(match[2], 10)
          : arrayBuffer.byteLength - 1;

        const slicedBuffer = arrayBuffer.slice(start, end + 1);
        const response = new Response(slicedBuffer, {
          status: 206,
          headers: {
            "content-type": "binary/octet-stream",
            "Content-Length": slicedBuffer.byteLength,
            "Content-Range": `bytes ${start}-${end}/${arrayBuffer.byteLength}`,
            "Accept-Ranges": "bytes",
          },
        });

        return response;
      }
    }
  } catch (error) {
    console.log({ error });
  }

  return new Response(arrayBuffer, {
    status: 200,
    headers: {
      "Content-Type": "binary/octet-stream",
      "Content-Length": arrayBuffer.byteLength,
      "Accept-Ranges": "bytes",
    },
  });
}

const getData = async (objectStoreName, key) => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([objectStoreName], "readonly");
    const store = transaction.objectStore(objectStoreName);
    const getRequest = store.get(key);
    getRequest.onsuccess = () => resolve(getRequest.result);
    getRequest.onerror = () => reject(getRequest.error);
  });
};

const getAllData = async (objectStoreName, key) => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([objectStoreName], "readonly");
    const store = transaction.objectStore(objectStoreName);
    const index = store.index("map_idx");
    const getAllRequest = index.getAll(key);

    getAllRequest.onsuccess = () => resolve(getAllRequest.result);
    getAllRequest.onerror = () => reject(getAllRequest.error);
  });
};

const saveData = async (objectStoreName, data) => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([objectStoreName], "readwrite");
    const store = transaction.objectStore(objectStoreName);

    const request = store.put(data);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};
