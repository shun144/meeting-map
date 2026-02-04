export const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve) => {
    // この時点では、まだデータベースは開かれていない
    // requestは「データベースを開く作業を表すオブジェクト」
    const openRequest = indexedDB.open("myDatabase", 1);

    // データベースが初めて作成される時、またはバージョンが上がった時
    // アロー型がNGな理由：アロー型はthisが束縛されないため
    openRequest.onupgradeneeded = function () {
      const db = this.result;

      if (!db.objectStoreNames.contains("users")) {
        const userStore = db.createObjectStore("users", { keyPath: "id" });
      }
    };

    openRequest.onsuccess = function () {
      const db = this.result;
      resolve(db);
    };
  });
};
