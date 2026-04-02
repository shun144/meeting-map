import { Map } from "../Map";

describe("Mapクラスのテスト", () => {
  test("", () => {
    // 準備 実行
    const sut = new Map("1", "test");

    // 検証
    expect(sut.id).toBe("1");
    expect(sut.name).toBe("test");
  });
});
