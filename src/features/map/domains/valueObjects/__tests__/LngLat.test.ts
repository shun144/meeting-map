import { LngLat } from "../LngLat";

describe("LngLat値オブジェクト", () => {
  test("正常系", () => {
    const sut = new LngLat(180, 90);
    expect(sut).toEqual({ lng: 180, lat: 90 });
  });

  describe("異常系", () => {
    describe("経度(lng)は-180以上かつ180以下である", () => {
      test("経度(lng)が-180より小さい場合例外エラー", () => {
        const sut = () => new LngLat(-180.1, 90);
        expect(sut).toThrow("経度が不正です");
      });
      test("経度(lng)が180より大きい場合例外エラー", () => {
        const sut = () => new LngLat(180.1, 90);
        expect(sut).toThrow("経度が不正です");
      });
    });
    describe("緯度(lat)は-90以上かつ90以下である", () => {
      test("緯度(lat)が-90より小さい場合例外エラー", () => {
        const sut = () => new LngLat(180, -90.1);
        expect(sut).toThrow("緯度が不正です");
      });

      test("緯度(lat)が90より大きい場合例外エラー", () => {
        const sut = () => new LngLat(180, 90.1);
        expect(sut).toThrow("緯度が不正です");
      });
    });
  });
});
