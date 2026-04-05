import { Destination } from "../Destination";
import { LngLat } from "@/features/map/domains/valueObjects/LngLat";

describe("Destinationエンティティ", () => {
  const lngLat = new LngLat(139.7, 35.6);

  test("titleが指定された場合はその値になる", () => {
    const sut = new Destination(1, lngLat, "渋谷");
    expect(sut.title).toBe("渋谷");
  });
});
