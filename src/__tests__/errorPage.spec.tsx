import NotFound from "@/router/NotFound";
import { act, render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";

describe("エラーページテスト", () => {
  const renderComponent = async () => {
    const Stub = createRoutesStub([{ path: "/", Component: NotFound }]);
    await act(() => render(<Stub initialEntries={["/"]} />));
  };

  test("404テキストが表示されること", async () => {
    await renderComponent();
    const sut = await screen.findByText("404");
    expect(sut).toBeVisible();
  });
});
