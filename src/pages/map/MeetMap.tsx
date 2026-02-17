import { DestinationRepository } from "@/repositories/DestinationRepository";
import maplibregl from "maplibre-gl";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router";
import { createMap } from "./createMap";
import useMapMarkers from "./useMapMarkers ";

// 線形補間
function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

// イージング（最初は速く、後でゆっくり減速する動きを作る関数）
function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

const isMarker = (
  event: maplibregl.MapMouseEvent | maplibregl.MapTouchEvent,
) => {
  return Boolean(
    (event.originalEvent.target as HTMLElement).closest(".maplibregl-marker"),
  );
};

const MeetMap = () => {
  const { mapId } = useParams();
  const repo = useMemo(() => new DestinationRepository(mapId), [mapId]);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapState, setMapState] = useState<maplibregl.Map | null>(null);
  const { createMarker, removeMarker } = useMapMarkers(repo);
  const timerId = useRef<number | undefined>(undefined);
  const timer = useRef<number>(0);

  useEffect(() => {
    if (!mapContainerRef.current || !mapId) return;
    const mapInstance = createMap(mapId, mapContainerRef.current);

    let currentPos: maplibregl.LngLat | null = null;
    let animationId: number | null = null;
    const userMarker = new maplibregl.Marker({ color: "red", opacity: "0" });

    mapInstance.on("load", () => {
      setMapState(mapInstance);

      mapInstance.addControl(new maplibregl.NavigationControl());

      const geolocateControl = new maplibregl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true, // アプリケーションが可能な限り最良の結果を得たいことを示すブール値です。true の場合、デバイスがより正確な位置情報を提供できる場合は、その情報を提供します。ただし、これにより応答時間が遅くなったり、消費電力が増加したりする可能性があります（例えば、モバイルデバイスに GPS チップが搭載されている場合など）。一方、false の場合、デバイスは応答速度を速めたり、消費電力を抑えたりすることでリソースを節約できます。デフォルト: false
        },
        trackUserLocation: true,
        showAccuracyCircle: false,
        showUserLocation: true,
        fitBoundsOptions: {
          maxZoom: 19,
          linear: true,
          duration: 0,
        },
      });
      mapInstance.addControl(geolocateControl);

      function smoothMoveUserMarker(
        from: maplibregl.LngLat,
        to: maplibregl.LngLat,
      ) {
        const startTime = performance.now(); // アニメーション開始時刻（ミリ秒）
        const duration = 600;

        const animate = (currentTime: number) => {
          // ① 経過時間を計算
          const elapsed = currentTime - startTime;
          // 例: 開始から300ms経過していたら elapsed = 300

          // ② 進行度を0〜1の範囲で計算
          const progress = Math.min(elapsed / duration, 1);
          // 例: 300ms / 600ms = 0.5（50%進行）
          // Math.minで1を超えないように制限

          // ③ イージングを適用（動きに変化をつける）
          const eased = easeOutQuad(progress);
          // progress=0.5 → eased=0.75
          // 最初は速く動き、後半はゆっくり減速

          // ④ 現在の位置を計算
          const lng = lerp(from.lng, to.lng, eased);
          const lat = lerp(from.lat, to.lat, eased);
          // 例: from.lng=139.0, to.lng=139.1, eased=0.75
          //     → lng = 139.0 + (139.1-139.0) * 0.75 = 139.075

          // ⑤ マーカーを移動
          userMarker.setLngLat([lng, lat]);

          // ⑥ まだ終わってなければ次のフレームを予約
          // アニメーションが完了していない（600ms経過していない）場合
          // 次のフレーム（約16ms後）で同じanimate関数をもう一度実行する
          if (progress < 1) {
            // window.requestAnimationFrame()
            // ブラウザにアニメーションを行いたいことを通知
            // 次の再描画の前にコールバック引数を実行させる
            animationId = requestAnimationFrame(animate);
          }
        };

        // 前のアニメーションがあればキャンセル
        if (animationId) {
          cancelAnimationFrame(animationId);
        }

        // 新しいアニメーション開始
        animationId = requestAnimationFrame(animate);
      }

      geolocateControl.on("geolocate", (event) => {
        // ジオロケーションコントローラーの状態を取得
        console.log(geolocateControl._watchState);
        const newPos = new maplibregl.LngLat(
          event.coords.longitude,
          event.coords.latitude,
        );

        if (!currentPos) {
          currentPos = newPos;
          userMarker.setLngLat(newPos).addTo(mapInstance);
          mapInstance.jumpTo({ center: newPos, zoom: 18 });
          return;
        }

        smoothMoveUserMarker(currentPos, newPos);
        currentPos = newPos;
      });

      // geolocateControl.on("userlocationfocus", function () {
      //   userMarker.setOpacity("1");
      // });

      // geolocateControl.on("trackuserlocationstart", () => {
      //   userMarker.setOpacity("1");
      // });

      // バックグラウンド状態に切り替わった時に発火
      // アクティブロック状態でユーザがカメラを移動させた時
      // バックグラウンド状態は位置情報の更新はするがカメラは移動しない
      // geolocateControl.on("trackuserlocationend", (event) => {
      //   userMarker.setOpacity("0");
      // });

      // geolocateControl.on("error", (error) => {
      //   console.error("位置情報エラー:", error.code, error.message);

      //   if (error.code === 1) {
      //     // 位置情報の許可を求める
      //     alert("位置情報の使用を許可してください");
      //   } else if (error.code === 3) {
      //     // タイムアウト
      //     console.log("位置情報の取得がタイムアウトしました");
      //   }
      // });

      const resetTimer = () => {
        clearInterval(timerId.current);
        timerId.current = undefined;
        timer.current = 0;
      };

      let isTouch = false;
      mapInstance.on("touchstart", () => {
        isTouch = true;
        if (timerId.current) {
          resetTimer();
          return;
        }
        timerId.current = setInterval(() => (timer.current += 1), 300);
      });

      mapInstance.on("touchend", (event) => {
        if (timer.current >= 1 && !isMarker(event)) {
          const addedMarker = createMarker(mapInstance, 0, event.lngLat, "");
          setTimeout(() => addedMarker?.togglePopup(), 0);
        }
        resetTimer();
      });

      mapInstance.on("touchmove", () => {
        resetTimer();
      });

      mapInstance.on("touchcancel", () => {
        resetTimer();
      });

      mapInstance.on("mousedown", () => {
        if (isTouch) return;
        if (timerId.current) {
          resetTimer();
          return;
        }
        timerId.current = setInterval(() => (timer.current += 1), 150);
      });

      mapInstance.on("mouseup", (event) => {
        if (isTouch) return;
        if (timer.current >= 1 && !isMarker(event)) {
          const addedMarker = createMarker(mapInstance, 0, event.lngLat, "");
          setTimeout(() => addedMarker?.togglePopup(), 0);
        }
        resetTimer();
      });

      mapInstance.on("movestart", () => {
        if (isTouch) return;
        resetTimer();
      });
    });

    return () => {
      // 1. タイマークリア
      if (timerId.current) {
        clearInterval(timerId.current);
        timerId.current = undefined;
      }
      timer.current = 0;

      // 2. アニメーションキャンセル
      if (animationId) {
        cancelAnimationFrame(animationId);
      }

      // 3. ユーザーマーカー削除
      if (userMarker) {
        userMarker.remove();
      }

      // 4. マップインスタンス破棄（イベントリスナ・コントロールは自動削除）
      if (mapInstance) {
        mapInstance.remove();
      }

      // 5. ステートクリア
      setMapState(null);
    };
  }, []);

  useEffect(() => {
    if (!mapState) return;
    (async () => {
      const res = await repo.findAll();
      res.forEach((x) => createMarker(mapState, x.id, x.latlng, x.title));
    })();
  }, [mapState]);

  return <div ref={mapContainerRef} className="h-full w-full" />;
};

export default MeetMap;
