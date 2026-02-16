import {
  type PmtilesCache,
  type DestinationCache,
  type MapCache,
} from "./types";
import { DB_NAME, DB_VERSION, storeNames } from "./constants";

function openDataBase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open(DB_NAME, DB_VERSION);

    openRequest.onupgradeneeded = function (event) {
      const oldVersion = event.oldVersion;
      const db = this.result;

      if (oldVersion > 0) {
        Array.from(db.objectStoreNames).forEach((storeName) => {
          db.deleteObjectStore(storeName);
        });
      }

      db.createObjectStore(storeNames.MAPS, {
        keyPath: ["id", "name"],
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

export async function fetchMaps() {
  const db = await openDataBase();
  return new Promise<MapCache[]>((resolve, reject) => {
    const tx = db.transaction([storeNames.MAPS], "readwrite");
    const store = tx.objectStore(storeNames.MAPS);
    const getRequest = store.getAll();
    getRequest.onsuccess = function () {
      resolve(this.result);
    };
    getRequest.onerror = function () {
      reject(this.error);
    };
  });
}

export async function saveMaps(payloads: MapCache[]) {
  const db = await openDataBase();
  const tx = db.transaction([storeNames.MAPS], "readwrite");
  const store = tx.objectStore(storeNames.MAPS);

  const promises = payloads.map((payload) => {
    return new Promise<void>((resolve, reject) => {
      const putRequest = store.put(payload);
      putRequest.onsuccess = function () {
        resolve();
      };
      putRequest.onerror = function () {
        reject(this.error);
      };
    });
  });

  return Promise.allSettled(promises);
}

export async function fetchPMTiles(key: IDBValidKey) {
  const db = await openDataBase();
  return new Promise<PmtilesCache>((resolve, reject) => {
    const tx = db.transaction([storeNames.PMTILES], "readwrite");
    const store = tx.objectStore(storeNames.PMTILES);
    const getRequest = store.get(key);
    getRequest.onsuccess = function () {
      resolve(this.result);
    };
    getRequest.onerror = function () {
      reject(this.error);
    };
  });
}

export async function savePMTiles(payload: PmtilesCache): Promise<void> {
  const db = await openDataBase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([storeNames.PMTILES], "readwrite");
    const store = tx.objectStore(storeNames.PMTILES);
    const putRequest = store.put(payload);
    putRequest.onsuccess = function () {
      resolve();
    };
    putRequest.onerror = function () {
      reject(this.error);
    };
  });
}

export async function fetchAllDestinations(key: IDBValidKey) {
  const db = await openDataBase();
  return new Promise<DestinationCache[]>((resolve, reject) => {
    const tx = db.transaction([storeNames.DESTINATIONS], "readwrite");
    const store = tx.objectStore(storeNames.DESTINATIONS);
    const index = store.index("mapIdIdx");
    const getAllRequest = index.getAll(key);
    getAllRequest.onsuccess = function () {
      resolve(this.result);
    };
    getAllRequest.onerror = function () {
      reject(this.error);
    };
  });
}

export async function saveDestinations(payloads: DestinationCache[]) {
  const db = await openDataBase();
  const tx = db.transaction([storeNames.DESTINATIONS], "readwrite");
  const store = tx.objectStore(storeNames.DESTINATIONS);

  const promises = payloads.map((payload) => {
    return new Promise<void>((resolve, reject) => {
      const putRequest = store.put(payload);
      putRequest.onsuccess = function () {
        resolve();
      };
      putRequest.onerror = function () {
        reject(this.error);
      };
    });
  });

  return Promise.allSettled(promises);
}

export async function saveDestination(payload: DestinationCache) {
  const db = await openDataBase();
  const tx = db.transaction([storeNames.DESTINATIONS], "readwrite");
  const store = tx.objectStore(storeNames.DESTINATIONS);

  return new Promise<void>((resolve, reject) => {
    const putRequest = store.put(payload);
    putRequest.onsuccess = function () {
      resolve();
    };
    putRequest.onerror = function () {
      reject(this.error);
    };
  });
}

export async function deleteDestination(key: IDBValidKey) {
  const db = await openDataBase();
  const tx = db.transaction([storeNames.DESTINATIONS], "readwrite");
  const store = tx.objectStore(storeNames.DESTINATIONS);

  return new Promise<void>((resolve, reject) => {
    const delRequest = store.delete(key);
    delRequest.onsuccess = function () {
      resolve();
    };
    delRequest.onerror = function () {
      reject(this.error);
    };
  });
}
