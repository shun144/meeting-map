import {
  type PmtilesCache,
  type DestinationCache,
  type MapCache,
} from "./types";
import { DB_NAME, storeNames } from "./constants";

function openDataBase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open(DB_NAME, 7);

    openRequest.onupgradeneeded = function (event) {
      const oldVersion = event.oldVersion;
      const db = this.result;

      if (oldVersion > 0) {
        Array.from(db.objectStoreNames).forEach((storeName) => {
          db.deleteObjectStore(storeName);
        });
      }

      db.createObjectStore(storeNames.MAPS, {
        keyPath: "id",
      });

      db.createObjectStore(storeNames.PMTILES, {
        keyPath: ["area", "version"],
      });

      const storeDestinations = db.createObjectStore(storeNames.DESTINATIONS, {
        keyPath: ["map_id", "id"],
      });

      storeDestinations.createIndex("mapIdIdx", "map_id");
    };

    openRequest.onsuccess = function () {
      resolve(this.result);
    };

    openRequest.onerror = function () {
      reject(this.error);
    };
  });
}

export async function fetchMap(id: string) {
  const db = await openDataBase();
  return new Promise<MapCache>((resolve, reject) => {
    const tx = db.transaction([storeNames.MAPS], "readonly");
    const store = tx.objectStore(storeNames.MAPS);
    const req = store.get(id);
    req.onsuccess = function () {
      resolve(this.result);
    };
    req.onerror = function () {
      reject(this.error);
    };
  });
}

export async function fetchMaps() {
  const db = await openDataBase();
  return new Promise<MapCache[]>((resolve, reject) => {
    const tx = db.transaction([storeNames.MAPS], "readonly");
    const store = tx.objectStore(storeNames.MAPS);
    const req = store.getAll();
    req.onsuccess = function () {
      resolve(this.result);
    };
    req.onerror = function () {
      reject(this.error);
    };
  });
}

export async function restoreMaps(payloads: MapCache[]) {
  const db = await openDataBase();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction([storeNames.MAPS], "readwrite");
    const store = tx.objectStore(storeNames.MAPS);

    store.clear();
    payloads.forEach((x) => store.put(x));

    tx.oncomplete = () => resolve();
    tx.onerror = function () {
      reject(this.error);
    };
    tx.onabort = function () {
      reject(this.error);
    };
  });
}

export async function fetchPMTiles(key: IDBValidKey) {
  const db = await openDataBase();
  return new Promise<PmtilesCache>((resolve, reject) => {
    const tx = db.transaction([storeNames.PMTILES], "readonly");
    const store = tx.objectStore(storeNames.PMTILES);
    const req = store.get(key);
    req.onsuccess = function () {
      resolve(this.result);
    };
    req.onerror = function () {
      reject(this.error);
    };
  });
}

export async function savePMTiles(payload: PmtilesCache): Promise<void> {
  const db = await openDataBase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([storeNames.PMTILES], "readwrite");
    const store = tx.objectStore(storeNames.PMTILES);
    const req = store.put(payload);
    req.onsuccess = function () {
      resolve();
    };
    req.onerror = function () {
      reject(this.error);
    };
  });
}

export async function fetchAllDestinations(key: IDBValidKey) {
  const db = await openDataBase();
  return new Promise<DestinationCache[]>((resolve, reject) => {
    const tx = db.transaction([storeNames.DESTINATIONS], "readonly");
    const store = tx.objectStore(storeNames.DESTINATIONS);
    const index = store.index("mapIdIdx");
    const req = index.getAll(key);
    req.onsuccess = function () {
      resolve(this.result);
    };
    req.onerror = function () {
      reject(this.error);
    };
  });
}

export async function saveDestinations(payloads: DestinationCache[]) {
  const db = await openDataBase();

  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction([storeNames.DESTINATIONS], "readwrite");
    const store = tx.objectStore(storeNames.DESTINATIONS);

    payloads.forEach((x) => store.put(x));
    tx.oncomplete = function () {
      resolve();
    };
    tx.onerror = function () {
      reject(this.error);
    };
    tx.onabort = function () {
      reject(this.error);
    };
  });
}

export async function saveDestination(payload: DestinationCache) {
  const db = await openDataBase();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction([storeNames.DESTINATIONS], "readwrite");
    const store = tx.objectStore(storeNames.DESTINATIONS);
    const req = store.put(payload);
    tx.oncomplete = function () {
      resolve();
    };
    req.onerror = function () {
      reject(this.error);
    };
  });
}

export async function restoreDestinationByMapId(
  mapId: string,
  payloads: DestinationCache[],
): Promise<void> {
  const db = await openDataBase();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction([storeNames.DESTINATIONS], "readwrite");
    const store = tx.objectStore(storeNames.DESTINATIONS);

    const index = store.index("mapIdIdx");

    // mapIdに一致するレコードのカーソルを取得して削除
    const deleteRequest = index.openCursor(IDBKeyRange.only(mapId));
    deleteRequest.onsuccess = function () {
      const cursor = this.result; // 現在のレコードを指すカーソル
      if (cursor) {
        cursor.delete(); // カーソルが指しているレコードを削除
        cursor.continue(); // 次のレコードに移動（onsuccessが再度発火する）
      } else {
        // cursorがnull = 対象レコードが全て処理された
        payloads.forEach((x) => store.put(x));
      }
    };

    tx.oncomplete = () => resolve();
    tx.onerror = function () {
      reject(this.error);
    };
    tx.onabort = function () {
      reject(this.error);
    };
  });
}

export async function deleteDestination(key: IDBValidKey) {
  const db = await openDataBase();

  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction([storeNames.DESTINATIONS], "readwrite");
    const store = tx.objectStore(storeNames.DESTINATIONS);

    const req = store.delete(key);

    req.onerror = function () {
      reject(this.error);
    };
    tx.oncomplete = () => resolve();
  });
}

export async function clearCache() {
  const db = await openDataBase();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(
      [storeNames.MAPS, storeNames.DESTINATIONS, storeNames.PMTILES],
      "readwrite",
    );
    tx.objectStore(storeNames.MAPS).clear();
    tx.objectStore(storeNames.DESTINATIONS).clear();
    tx.objectStore(storeNames.PMTILES).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = function () {
      reject(this.error);
    };
  });
}
