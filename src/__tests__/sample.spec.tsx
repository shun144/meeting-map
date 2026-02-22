import Home from "@/features/home/components/Home";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";

const user = userEvent.setup();

vi.mock("@/features/map/infrastructure/MapRepository", () => ({
  MapRepository: class {
    fetchAll = vi.fn().mockResolvedValue([
      {
        id: "test-id",
        name: "test用の地図",
        updated_at: Date.now().toString(),
      },
    ]);
  },
}));

describe("Home画面テスト", () => {
  beforeEach(async () => {
    const Stub = createRoutesStub([{ path: "/", Component: Home }]);
    await act(async () => render(<Stub initialEntries={["/"]} />));
  });

  test("タイトルが表示されること", async () => {
    const sut = await screen.findByText("地図を選択してください");
    expect(sut).toBeVisible();
  });

  test("地図ボタンが表示されること", async () => {
    const sut = await screen.findByText("test用の地図");
    expect(sut).toBeVisible();
  });

  test("キャッシュクリアボタンが表示されること", async () => {
    const sut = await screen.findByRole("button", { name: "キャッシュクリア" });
    expect(sut).toBeVisible();
  });
});

// describe("Home画面テスト", () => {
//   beforeEach(async () => {
//     const Stub = createRoutesStub([{ path: "/", Component: Home }]);
//     await act(async () => render(<Stub initialEntries={["/"]} />));
//   });

//   test("タイトルが表示されること", async () => {
//     const sut = await screen.findByText("地図を選択してください");
//     expect(sut).toBeVisible();
//   });

//   test("地図ボタンが表示されること", async () => {
//     const sut = await screen.findByText("test用の地図");
//     expect(sut).toBeVisible();
//   });

//   test("キャッシュクリアボタンが表示されること", async () => {
//     const sut = await screen.findByRole("button", { name: "キャッシュクリア" });
//     expect(sut).toBeVisible();
//   });
// });
