import Home from "@/features/home/components/Home";
import { act, render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";

const mockFindAll = vi.fn();

vi.mock("@/features/map/infrastructure/supabase/SupabaseMapRepository", () => ({
  SupabaseMapRepository: class {
    findAll = mockFindAll;
  },
}));

describe("Homeコンポーネントテスト", () => {
  beforeEach(() => {
    mockFindAll.mockReset();
    mockFindAll.mockResolvedValue([
      {
        id: "test-id",
        name: "test用の地図",
        updated_at: Date.now().toString(),
      },
    ]);
  });

  const renderComponent = async () => {
    const Stub = createRoutesStub([{ path: "/", Component: Home }]);
    await act(async () => render(<Stub initialEntries={["/"]} />));
  };

  test("タイトルが表示されること", async () => {
    await renderComponent();
    const sut = await screen.findByText("地図を選択してください");
    expect(sut).toBeVisible();
  });

  test("ローディング画面が表示されること", async () => {
    mockFindAll.mockImplementation(() => new Promise(() => {}));
    await renderComponent();
    const sut = await screen.findByText("読み込み中...");
    expect(sut).toBeVisible();
  });

  test("地図データあり_地図ボタンが表示されること", async () => {
    await renderComponent();
    const sut = await screen.findByText("test用の地図");
    expect(sut).toBeVisible();
  });

  test("地図データなし_地図がありませんが表示されること", async () => {
    mockFindAll.mockResolvedValue([]);
    await renderComponent();
    const sut = await screen.findByText("地図がありません");
    expect(sut).toBeVisible();
  });

  test("キャッシュクリアボタンが表示されること", async () => {
    await renderComponent();
    const sut = await screen.findByRole("button", { name: "キャッシュクリア" });
    expect(sut).toBeVisible();
  });
});
