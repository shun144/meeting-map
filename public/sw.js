// self.addEventListener("install", function (event) {
//   console.log("インストール開始");
// });

// const CACHE_NAME = "my-cache-v1";

// Service Workerのスクリプト自体が初めてインストールされるときに発火
// ユーザーが初めてサイトを訪問した時
// sw.jsが更新されたとき（ブラウザがバイト単位で差分比較する）
// self.addEventListener("install", function (e) {
//   console.info("install", e);
//   // 初期キャッシュを作成する！
//   e.waitUntil(
//     // キャッシュストレージを開く
//     caches.open(CACHE_NAME).then((cache) => {}),
//   );
// });

self.addEventListener("install", function (event) {
  // waitUntilはpromiseを受け取る（async関数の実行結果が必要）
  event.waitUntil(
    (async () => {
      console.log("ダウンロード開始！");
      const pmtilesUrl =
        "https://nwmuhxuprqnikmbcwteo.supabase.co/storage/v1/object/public/public-maps/disneyland.pmtiles";

      const response = await fetch(pmtilesUrl);
      const arrayBuffer = await response.arrayBuffer();

      // IndexedDBに全体を保存
      await saveToIndexedDB("disneyland.pmtiles", arrayBuffer);

      console.log("ダウンロード完了！");
    })(),
  );
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
        // db.createObjectStore("tdl", { keyPath: "id" });
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

// fetchイベントでRange Requestに対応
self.addEventListener("fetch", (event) => {
  console.log("fetch開始");
  const url = new URL(event.request.url);
  if (url.href.includes("disneyland.pmtiles")) {
    event.respondWith(
      (async () => {
        try {
          console.log("インターセプト");
          // IndexedDBから全体のArrayBufferを取得
          const arrayBuffer = await getFromIndexedDB("disneyland.pmtiles");

          // Rangeヘッダーを確認
          const rangeHeader = event.request.headers.get("Range");

          if (rangeHeader) {
            // Range Requestの処理
            const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
            if (match) {
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
