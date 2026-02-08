import { useMapStore } from "@/store/useMapStore";
import maplibregl from "maplibre-gl";
import { PMTiles, Protocol } from "pmtiles";
import { useEffect, useRef } from "react";
import { mapStyle } from "./mapStyle";

// 線形補間
function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

// イージング（最初は速く、後でゆっくり減速する動きを作る関数）
function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

const useMap = () => {
  const { setMap, setIsLoaded } = useMapStore();
  const mapContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const PMTILES_URL =
      "https://nwmuhxuprqnikmbcwteo.supabase.co/storage/v1/object/public/public-maps/disneyland.pmtiles";

    // MapLibre GLでPMTiles形式のタイルを読み込めるようにするための初期設定
    const protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);
    const pmtiles = new PMTiles(PMTILES_URL);
    protocol.add(pmtiles);

    const map = new maplibregl.Map({
      container: mapContainer.current,
      // center: [139.8821, 35.6328],
      center: [139.918839, 35.815512],
      zoom: 16,
      minZoom: 15, // 最大縮小（どのぐらいまでズームアウトするか（数字が小さい程縮小）
      maxZoom: 20, // 最大拡大（どのぐらいまでズームインするか（数字が大きい程拡大）

      // style: mapStyle,

      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap",
          },
        },
        layers: [
          {
            id: "osm-base",
            type: "raster",
            source: "osm",
            paint: {
              "raster-opacity": 0.9,
            },
          },
        ],
      },
    });

    map.on("load", () => {
      setIsLoaded(true);

      map.addControl(new maplibregl.NavigationControl());

      const geolocateControl = new maplibregl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true, // アプリケーションが可能な限り最良の結果を得たいことを示すブール値です。true の場合、デバイスがより正確な位置情報を提供できる場合は、その情報を提供します。ただし、これにより応答時間が遅くなったり、消費電力が増加したりする可能性があります（例えば、モバイルデバイスに GPS チップが搭載されている場合など）。一方、false の場合、デバイスは応答速度を速めたり、消費電力を抑えたりすることでリソースを節約できます。デフォルト: false
        },
        trackUserLocation: true,
        showAccuracyCircle: false,
        showUserLocation: false,
        fitBoundsOptions: {
          maxZoom: 20,
          linear: true,
          duration: 0,
        },
      });

      const userMarker = new maplibregl.Marker({ color: "#4285F4" });

      map.addControl(geolocateControl);

      let currentPos: [number, number] | null = null;
      let animationId: number | null = null;

      function smoothMoveMarker(from: [number, number], to: [number, number]) {
        const startTime = performance.now();
        const duration = 600; // 0.6秒

        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = easeOutQuad(progress);

          const lng = lerp(from[0], to[0], eased);
          const lat = lerp(from[1], to[1], eased);

          // マーカーだけ移動（カメラは動かない）
          userMarker.setLngLat([lng, lat]);

          if (progress < 1) {
            animationId = requestAnimationFrame(animate);
          }
        };

        if (animationId) {
          cancelAnimationFrame(animationId);
        }
        animationId = requestAnimationFrame(animate);
      }

      geolocateControl.on("geolocate", (e) => {
        const newPos: [number, number] = [
          e.coords.longitude,
          e.coords.latitude,
        ];

        console.log(newPos);

        if (!currentPos) {
          currentPos = newPos;
          userMarker.setLngLat(newPos).addTo(map);
          map.jumpTo({ center: newPos, zoom: 18 });
        } else {
          // マーカーだけ滑らかに移動
          smoothMoveMarker(currentPos, newPos);
          currentPos = newPos;
        }
      });
    });

    setMap(map);

    return () => {
      map.remove();
    };
  }, []);

  return { mapContainer };
};

export default useMap;
