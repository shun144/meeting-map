import { Destination } from "../Destination";

describe("Destinationクラス", () => {
  test("正常系", () => {
    const sut = new Destination(1, { lng: 139.7, lat: 35.6 }, "渋谷");
    expect(sut.id).toBe(1);
    expect(sut.lnglat).toEqual({ lng: 139.7, lat: 35.6 });
    expect(sut.title).toBe("渋谷");
  });

  test("titleに空文字を渡すと例外エラーになる", () => {
    // 準備 & 実施
    const sut = () => new Destination(1, { lng: 139.7, lat: 35.6 }, "");
    // 検証
    expect(sut).toThrow("titleは必須です");
  });

  describe("緯度(lat)は-90以上かつ90以下である", () => {
    test("緯度(lat)が90より大きい場合例外エラーになる", () => {
      const sut = () => new Destination(1, { lng: 139.7, lat: 90.1 }, "渋谷");
      expect(sut).toThrow("緯度が不正です");
    });

    test("緯度(lat)が-90より小さい場合例外エラーになる", () => {
      const sut = () => new Destination(1, { lng: 139.7, lat: -90.1 }, "渋谷");
      expect(sut).toThrow("緯度が不正です");
    });
  });

  describe("経度(lng)は-180以上かつ180以下である", () => {
    test("経度(lng)が180より大きい場合例外エラーになる", () => {
      const sut = () => new Destination(1, { lng: 180.1, lat: 35.6 }, "渋谷");
      expect(sut).toThrow("経度が不正です");
    });

    test("経度(lng)が-180より小さい場合例外エラーになる", () => {
      const sut = () => new Destination(1, { lng: -180.1, lat: 35.6 }, "渋谷");
      expect(sut).toThrow("経度が不正です");
    });
  });
});
