import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";

// 古いバージョンのworkboxで追加されたキャッシュを自動削除する
// workboxのバージョン変更があった場合に、古いバージョンのworkboxのキャッシュを削除する
cleanupOutdatedCaches();

// プリキャッシュの設定
// installイベント時にself.__WB_MANIFESTに含まれるすべてのファイルをキャッシュに保存
// fetchイベント時に、リクエストされたURLがプリキャッシュにあれば、キャッシュから返す
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("install", function (event) {});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

const openDatabase = () => {
  return new Promise((resolve, reject) => {
    // この時点では、まだデータベースは開かれていない
    // requestは「データベースを開く作業を表すオブジェクト」
    const openRequest = indexedDB.open("offlineMapDataBase", 1);

    // データベースが初めて作成される時、またはバージョンが上がった時のイベント
    openRequest.onupgradeneeded = function () {
      const db = this.result;
      if (!db.objectStoreNames.contains("pmtiles")) {
        db.createObjectStore("pmtiles", {
          keyPath: ["area", "version"],
        });
      }
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

  if (url.pathname.endsWith(".pmtiles")) {
    const regex = /(?<version>version\d+)\/(?<area>[^\/]+)\.pmtiles$/;
    const { area, version } = url.pathname.match(regex).groups;

    event.respondWith(
      (async () => {
        try {
          const resDB = await getData([area, version]);

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
                await saveData({ area, version, pmtiles });
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
});

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

const getData = async (key) => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["pmtiles"], "readonly");
    const store = transaction.objectStore("pmtiles");
    const getRequest = store.get(key);
    getRequest.onsuccess = () => resolve(getRequest.result);
    getRequest.onerror = () => reject(getRequest.error);
  });
};

const saveData = async (data) => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["pmtiles"], "readwrite");
    const store = transaction.objectStore("pmtiles");

    const request = store.put(data);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// const saveToIndexedDB = async (key, data) => {
//   const db = await openDatabase();

//   return new Promise((resolve, reject) => {
//     // db.transaction(アクセスしたいストア名,許可する権限)
//     // これから tdl ストアに書き込み操作をします」と宣言している
//     // 第一引数には配列で複数のストアを指定可能
//     const transaction = db.transaction(["tdl"], "readwrite");
//     const store = transaction.objectStore("tdl");

//     const request = store.put(data, key);
//     request.onsuccess = () => resolve();
//     request.onerror = () => reject(request.error);
//   });
// };

// const getFromIndexedDB = async (key) => {
//   const db = await openDatabase();
//   return new Promise((resolve, reject) => {
//     const transaction = db.transaction(["tdl"], "readonly");
//     const store = transaction.objectStore("tdl");
//     const request = store.get(key);

//     request.onsuccess = () => resolve(request.result);
//     request.onerror = () => reject(request.error);
//   });
// };
