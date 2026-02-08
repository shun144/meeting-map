import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";

// 古いバージョンのworkboxで追加されたキャッシュを自動削除する
// workboxのバージョン変更があった場合に、古いバージョンのworkboxのキャッシュを削除する
cleanupOutdatedCaches();

// プリキャッシュの設定
// installイベント時にself.__WB_MANIFESTに含まれるすべてのファイルをキャッシュに保存
// fetchイベント時に、リクエストされたURLがプリキャッシュにあれば、キャッシュから返す
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("install", function (event) {
  event.waitUntil(
    (async () => {
      const pmtilesUrl =
        "https://nwmuhxuprqnikmbcwteo.supabase.co/storage/v1/object/public/public-maps/disneyland.pmtiles";

      try {
        const response = await fetch(pmtilesUrl);
        const arrayBuffer = await response.arrayBuffer();

        // IndexedDBに全体を保存
        await saveToIndexedDB("disneyland.pmtiles", arrayBuffer);
      } catch (error) {
        console.error(error);
      }
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

const openDatabase = () => {
  return new Promise((resolve, reject) => {
    // この時点では、まだデータベースは開かれていない
    // requestは「データベースを開く作業を表すオブジェクト」
    const openRequest = indexedDB.open("tdlDatabase", 1);

    // データベースが初めて作成される時、またはバージョンが上がった時のイベント
    // アロー型がNGな理由：アロー型はthisが束縛されないため
    openRequest.onupgradeneeded = function () {
      const db = this.result;
      if (!db.objectStoreNames.contains("tdl")) {
        db.createObjectStore("tdl");
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

// fetchイベントでRange Requestに対応
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.href.includes("disneyland.pmtiles")) {
    event.respondWith(
      (async () => {
        try {
          // IndexedDBから全体のArrayBufferを取得
          const arrayBuffer = await getFromIndexedDB("disneyland.pmtiles");

          // Rangeヘッダーを確認
          const rangeHeader = event.request.headers.get("Range");

          if (rangeHeader) {
            const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
            if (match) {
              // 第二引数：10進数宣言
              const start = parseInt(match[1], 10);
              const end = match[2]
                ? parseInt(match[2], 10)
                : arrayBuffer.byteLength - 1;

              // 指定範囲のデータを切り出し
              const slicedBuffer = arrayBuffer.slice(start, end + 1);

              return new Response(slicedBuffer, {
                status: 206, // Partial Content
                headers: {
                  "Content-Type": "application/octet-stream",
                  "Content-Length": slicedBuffer.byteLength,
                  "Content-Range": `bytes ${start}-${end}/${arrayBuffer.byteLength}`,
                  "Accept-Ranges": "bytes",
                },
              });
            }
          }

          // Range指定なしの場合は全体を返す
          return new Response(arrayBuffer, {
            status: 200,
            headers: {
              "Content-Type": "application/octet-stream",
              "Content-Length": arrayBuffer.byteLength,
              "Accept-Ranges": "bytes",
            },
          });
        } catch (error) {
          console.error("IndexedDBからの取得失敗:", error);

          // フォールバック: ネットワークから取得
          return fetch(event.request);
        }
      })(),
    );
  }
});

const saveToIndexedDB = async (key, data) => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    // db.transaction(アクセスしたいストア名,許可する権限)
    // これから tdl ストアに書き込み操作をします」と宣言している
    // 第一引数には配列で複数のストアを指定可能
    const transaction = db.transaction("tdl", "readwrite");
    const store = transaction.objectStore("tdl");

    const request = store.put(data, key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

const getFromIndexedDB = async (key) => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("tdl", "readonly");
    const store = transaction.objectStore("tdl");
    const request = store.get(key);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};
