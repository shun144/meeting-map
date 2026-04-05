import { clearCache } from "@/lib/indexedDB/database";

export class CacheService {
  private constructor() {}

  static async clearCache() {
    await clearCache();
  }
}
