import { MemoryRouter } from "react-router";
import { renderHook, act } from "@testing-library/react";
import useMapEvent from "../useMapEvent";

const {
  mockCreateMap,
  mockOnError,
  mockDestroy,
  mockToastError,
  mockNavigate,
} = vi.hoisted(() => ({
  mockCreateMap: vi.fn(),
  mockOnError: vi.fn(),
  mockDestroy: vi.fn(),
  mockToastError: vi.fn(),
  mockNavigate: vi.fn(),
}));

vi.mock("@/features/map/infrastructure/maplibre/MapFactory", () => ({
  MapFactory: {
    create: mockCreateMap,
  },
}));

vi.mock("react-toastify", () => ({
  toast: {
    error: mockToastError,
  },
}));

vi.mock(import("react-router"), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderUseMapEvent = async (args: {
  mapContainerRef: React.RefObject<HTMLDivElement | null>;
  mapId: string | undefined;
}) =>
  act(async () => {
    const { result, unmount } = renderHook(
      () => useMapEvent(args.mapContainerRef, args.mapId),
      {
        wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
      },
    );

    return { result, unmount };
  });

describe("useMapEventカスタムフック", () => {
  beforeEach(() => {
    mockOnError.mockClear();
    mockDestroy.mockClear();
    mockCreateMap.mockReturnValue({
      onError: mockOnError,
      onReady: vi.fn((cb) => cb()),
      destroy: mockDestroy,
    });
    mockToastError.mockClear();
    mockNavigate.mockClear();
  });
  describe("初期化条件のガード", () => {
    test("mapContainerRef.currentがnullの時MapFactory.create を呼ばない", async () => {
      await renderUseMapEvent({
        mapContainerRef: { current: null },
        mapId: "1",
      });
      expect(mockCreateMap).toHaveBeenCalledTimes(0);
    });

    test("mapIdがundefinedの時MapFactory.create を呼ばない", async () => {
      await renderUseMapEvent({
        mapContainerRef: { current: document.createElement("div") },
        mapId: undefined,
      });
      expect(mockCreateMap).toHaveBeenCalledTimes(0);
    });

    test("mapContainerRef.currentとmapIdがある時MapFactory.createを呼ぶ", async () => {
      const container = document.createElement("div");
      await renderUseMapEvent({
        mapContainerRef: { current: container },
        mapId: "1",
      });

      expect(mockCreateMap).toHaveBeenCalledTimes(1);
    });
  });

  test("map.onReady()が呼ばれるとisMapReadyがtrueになる", async () => {
    const { result } = await renderUseMapEvent({
      mapContainerRef: {
        current: document.createElement("div"),
      },
      mapId: "1",
    });
    expect(result.current.isMapReady).toBe(true);
  });

  test("fetch-failed-onlineエラー時にtoast.errorが重複しないtoastIdで呼ばれる", async () => {
    mockOnError.mockImplementation((cb) => cb("fetch-failed-online"));
    await renderUseMapEvent({
      mapContainerRef: {
        current: document.createElement("div"),
      },
      mapId: "1",
    });
    expect(mockToastError).toHaveBeenCalledTimes(1);
    expect(mockToastError).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        toastId: "map-fetch-error",
      }),
    );
  });

  test("fetch-failed-offlineエラー時に地図が見つかりませんページに遷移する", async () => {
    mockOnError.mockImplementation((cb) => cb("fetch-failed-offline"));
    await renderUseMapEvent({
      mapContainerRef: {
        current: document.createElement("div"),
      },
      mapId: "1",
    });

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/map-not-found");
  });

  test("アンマウント時に map.destroy が呼ばれる", async () => {
    const { unmount } = await renderUseMapEvent({
      mapContainerRef: {
        current: document.createElement("div"),
      },
      mapId: "1",
    });
    unmount();
    expect(mockDestroy).toHaveBeenCalledTimes(1);
  });
});
