import Home from "@/features/home/components/Home";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import { beforeEach, describe, expect, test, vi } from "vitest";

const user = userEvent.setup();

describe("Home画面テスト", () => {
  beforeEach(() => {
    const Stub = createRoutesStub([{ path: "/", Component: Home }]);
    render(<Stub initialEntries={["/"]} />);
  });

  test("タイトルが表示されていること", async () => {
    const sut = await screen.findByText("地図を選択してください");
    screen.debug();
    expect(sut).toBeVisible();
  });
});

// import { render, screen, waitFor } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import { createRoutesStub } from "react-router";
// import { beforeEach, describe, expect, test, vi } from "vitest";

// const user = userEvent.setup();

// const mockNavigate = vi.fn();
// vi.mock(import("react-router"), async (importOriginal) => {
//   const actual = await importOriginal();
//   return {
//     ...actual,
//     useNavigate: () => mockNavigate,
//   };
// });

// vi.mock(import("@/lib/supabase/supabaseFunction"), async (importOriginal) => {
//   const actual = await importOriginal();
//   return {
//     ...actual,
//     fetchUser: vi.fn().mockResolvedValue([
//       {
//         userId: "PPP",
//         userName: "pizzaです",
//         description: "piza",
//         githubUrl: null,
//         qiitaUrl: null,
//         xUrl: null,
//         skillNames: ["React", "TypeScript"],
//       },
//     ]),
//   };
// });

// describe("名刺カード検索テスト", () => {
//   beforeEach(() => {
//     mockNavigate.mockClear();

//     const Stub = createRoutesStub([
//       { path: "/", Component: Search },
//       { path: "/cards/register", Component: Register },
//       { path: "/cards/:id", Component: Cards },
//     ]);
//     render(
//       <ChakraProvider value={defaultSystem}>
//         <Stub initialEntries={["/"]} />
//       </ChakraProvider>,
//     );
//   });

//   test.skip("タイトルが表示されていること", async () => {
//     const sut = await screen.findByText("名刺検索");
//     expect(sut).toBeVisible();
//   });

//   test.skip("IDを入力してボタンを押すと/cards/:idに遷移する", async () => {
//     const searchIdField = await screen.findByLabelText("ID");
//     const searchBtn = await screen.findByRole("button", { name: "検索" });
//     await user.type(searchIdField, "piza");
//     await user.click(searchBtn);
//     expect(mockNavigate).toHaveBeenCalledWith("/cards/piza");
//   });

//   test("IDを入力しないでボタンを押すとエラーメッセージが表示される", async () => {
//     const toRegisterBtn = await screen.findByRole("button", {
//       name: "新規登録はこちら",
//     });
//     await user.click(toRegisterBtn);

//     await waitFor(() => {
//       expect(mockNavigate).toHaveBeenCalledWith("/cards/register");
//     });
//   });
// });
