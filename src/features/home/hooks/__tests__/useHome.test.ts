import { renderHook, act } from "@testing-library/react";
import { useHome } from "../useHome";

const { mockFindAll } = vi.hoisted(() => ({
  mockFindAll: vi.fn(),
}));

vi.mock("@/features/map/infrastructure/supabase/SupabaseMapRepository", () => ({
  SupabaseMapRepository: class {
    findAll = mockFindAll;
  },
}));

describe("useHomeカスタムフック", () => {
  beforeEach(() => {
    mockFindAll.mockClear();
  });

  test("dataがある場合、mapListにその値を格納する", async () => {
    const data = [{ id: "1", name: "test" }];
    mockFindAll.mockResolvedValueOnce(data);
    const { result } = await act(async () => {
      return renderHook(() => useHome());
    });
    expect(result.current.mapList).toEqual(data);
    expect(result.current.isLoaded).toBe(true);
  });

  test("エラーの場合、mapListは空配列", async () => {
    mockFindAll.mockRejectedValueOnce(null);
    const { result } = await act(async () => {
      return renderHook(() => useHome());
    });
    expect(result.current.mapList).toEqual([]);
    expect(result.current.isLoaded).toBe(true);
  });
});
