import { mapLoader } from "@/features/map/loader/mapLoader";
import { type MapRepository } from "@/features/map/domains/repositories/MapRepository";

describe("ローダーテスト", () => {
  test("マップが存在していればtrueを返す", async () => {
    const mockRepo: MapRepository = {
      isExist: vi.fn().mockResolvedValue(true),
      findAll: vi.fn(),
    };
    await expect(mapLoader(mockRepo, "dummyMapId")).resolves.toBeUndefined();
  });

  test("マップが存在していなければ404エラーをスロー", async () => {
    const mockRepo: MapRepository = {
      isExist: vi.fn().mockResolvedValue(false),
      findAll: vi.fn(),
    };
    const sut = mapLoader(mockRepo, "dummyMapId");
    await expect(sut).rejects.toMatchObject({ status: 404 });
  });

  test("マップ存在リクエストで例外エラーの場合500エラーをスロー", async () => {
    const mockRepo: MapRepository = {
      isExist: vi.fn().mockRejectedValue("something"),
      findAll: vi.fn(),
    };

    const sut = mapLoader(mockRepo, "dummyMapId");
    await expect(sut).rejects.toMatchObject({ status: 500 });
  });
});
