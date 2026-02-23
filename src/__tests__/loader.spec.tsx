import { mapLoader } from "@/features/map/loader/mapLoader";

describe("ローダーテスト", () => {
  test("mapDataが存在する場合resolveすること", async () => {
    const mockRepo = {
      find: vi.fn().mockResolvedValue("something"),
      fetchAll: vi.fn().mockResolvedValue(null),
    };
    await expect(mapLoader(mockRepo, "unknown")).resolves.toBeUndefined();
  });

  test("mapDataが存在しない場合throwすること", async () => {
    const mockRepo = {
      find: vi.fn().mockResolvedValue(null),
      fetchAll: vi.fn().mockResolvedValue(null),
    };
    await expect(mapLoader(mockRepo, "unknown")).rejects.toBeInstanceOf(
      Response,
    );
  });
});
