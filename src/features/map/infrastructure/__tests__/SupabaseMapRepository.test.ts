import { SupabaseMapRepository } from "@/features/map/infrastructure/supabase/SupabaseMapRepository";

const { mockEq2 } = vi.hoisted(() => ({
  mockEq2: vi.fn().mockResolvedValue({ count: 1, error: null }),
}));

vi.mock("@/lib/supabase/supabaseClient", () => {
  const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 });
  const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 });
  return {
    supabase: {
      from: vi.fn().mockReturnValue({ select: mockSelect }),
    },
  };
});

describe("SupabaseMapRepository", () => {
  test("isExistの結果が1件以上の場合trueを返す", async () => {
    const repo = new SupabaseMapRepository();
    const sut = await repo.isExist("1");
    expect(sut).toBe(true);
  });

  it("存在しない場合はfalseを返す", async () => {
    mockEq2.mockResolvedValueOnce({ count: 0, error: null });
    const repo = new SupabaseMapRepository();
    const sut = await repo.isExist("1");
    expect(sut).toBe(false);
  });
});
