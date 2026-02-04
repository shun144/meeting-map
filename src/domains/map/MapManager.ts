import { Protocol } from "pmtiles";
import type { RequestParameters } from "maplibre-gl";

type ResponseCallback<T> = (
  error?: Error | null,
  data?: T | null,
  cacheControl?: string | null,
  expires?: string | null,
) => void;

// IndexedDBヘルパー
export class PMTilesCache {
  private dbName: string;
  private storeName: string;
  private db: IDBDatabase | null = null;

  constructor(dbName: string = "pmtiles-cache", storeName: string = "tiles") {
    this.dbName = dbName;
    this.storeName = storeName;
  }

  async init(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  }

  async get(key: string): Promise<CachedTile | undefined> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async set(key: string, value: CachedTile): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.put(value, key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

// キャッシュされたタイルの型
interface CachedTile {
  data: ArrayBuffer | Uint8Array;
  headers: Record<string, string>;
}

// キャッシュ付きPMTilesプロトコル
export class CachedPMTilesProtocol {
  private cache: PMTilesCache;
  private protocol: Protocol;

  constructor(cache: PMTilesCache) {
    this.cache = cache;
    this.protocol = new Protocol();
  }

  async tile(
    params: RequestParameters,
    callback: ResponseCallback<ArrayBuffer | Uint8Array>,
  ): Promise<void> {
    const cacheKey = `${params.url}-${params.type}`;

    try {
      // まずキャッシュを確認
      const cached = await this.cache.get(cacheKey);
      if (cached) {
        console.log("Cache hit:", cacheKey);
        callback(null, cached.data, undefined, undefined);
        return;
      }

      // キャッシュにない場合はオンラインで取得
      console.log("Cache miss, fetching online:", cacheKey);
      this.protocol.tile(params, async (err, data, cacheControl, expires) => {
        if (err) {
          callback(err);
          return;
        }

        // 取得したタイルをキャッシュに保存
        if (
          data &&
          (data instanceof ArrayBuffer || data instanceof Uint8Array)
        ) {
          try {
            await this.cache.set(cacheKey, {
              data,
              headers: {
                cacheControl: cacheControl || "",
                expires: expires || "",
              },
            });
            console.log("Cached:", cacheKey);
          } catch (cacheErr) {
            console.error("Cache error:", cacheErr);
          }
        }

        callback(
          null,
          data as ArrayBuffer | Uint8Array | null,
          cacheControl,
          expires,
        );
      });
    } catch (error) {
      console.error("Protocol error:", error);
      callback(error as Error);
    }
  }
}
