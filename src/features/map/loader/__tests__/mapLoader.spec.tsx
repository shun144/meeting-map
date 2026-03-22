import { mapLoader } from "@/features/map/loader/mapLoader";

describe("ローダーテスト", () => {
  test("mapDataが存在する場合resolveすること", async () => {
    const mockRepo = {
      find: vi.fn().mockResolvedValue("something"),
      findAll: vi.fn().mockResolvedValue(null),
    };
    await expect(mapLoader(mockRepo, "unknown")).resolves.toBeUndefined();
  });

  test("mapDataが存在しない場合throwすること", async () => {
    const mockRepo = {
      find: vi.fn().mockRejectedValue(new Error("something")),
      findAll: vi.fn().mockResolvedValue(null),
    };

    const sut = mapLoader(mockRepo, "unknown");

    await expect(sut).rejects.toBeInstanceOf(Response);
    await expect(sut).rejects.toMatchObject({ status: 404 });
  });
});
