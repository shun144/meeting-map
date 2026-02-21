export function isMarker(
  event: maplibregl.MapMouseEvent | maplibregl.MapTouchEvent,
) {
  return Boolean(
    (event.originalEvent.target as HTMLElement).closest(".maplibregl-marker"),
  );
}

function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

export function smoothMove(
  preAnimationId: number | null,
  from: maplibregl.LngLat,
  to: maplibregl.LngLat,
  duration: number,
  onUpdate: (lnglat: maplibregl.LngLatLike) => void,
) {
  // 前のアニメーションがあればキャンセル
  if (preAnimationId) {
    cancelAnimationFrame(preAnimationId);
  }

  const startTime = performance.now(); // アニメーション開始時刻（ミリ秒）
  const animate = (currentTime: number) => {
    // ① 経過時間を計算
    const elapsed = currentTime - startTime;
    // 例: 開始から300ms経過していたら elapsed = 300

    // ② 進行度を0〜1の範囲で計算
    const progress = Math.min(elapsed / duration, 1);
    // 例: 300ms / 600ms = 0.5（50%進行）

    // ③ イージングを適用（動きに変化をつける）
    const eased = easeOutQuad(progress);
    // progress=0.5 → eased=0.75
    // 最初は速く動き、後半はゆっくり減速

    // ④ 現在の位置を計算
    const lng = lerp(from.lng, to.lng, eased);
    const lat = lerp(from.lat, to.lat, eased);
    // 例: from.lng=139.0, to.lng=139.1, eased=0.75
    //     → lng = 139.0 + (139.1-139.0) * 0.75 = 139.075

    onUpdate([lng, lat]);

    // アニメーションが完了していない（600ms経過していない）場合
    // 次のフレーム（約16ms後）でanimate関数を実行するように予約する
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  // 新しいアニメーション開始
  // window.requestAnimationFrame()：ブラウザにアニメーションを行いたいことを通知
  // 次の再描画の前にコールバック引数を実行させる
  return requestAnimationFrame(animate);
}

// export function smoothMove(
//   animationId: number | null,
//   from: maplibregl.LngLat,
//   to: maplibregl.LngLat,
//   onUpdate: (lnglat: maplibregl.LngLatLike) => void,
// ) {
//   const startTime = performance.now(); // アニメーション開始時刻（ミリ秒）
//   const duration = 600;

//   const animate = (currentTime: number) => {
//     // ① 経過時間を計算
//     const elapsed = currentTime - startTime;
//     // 例: 開始から300ms経過していたら elapsed = 300

//     // ② 進行度を0〜1の範囲で計算
//     const progress = Math.min(elapsed / duration, 1);
//     // 例: 300ms / 600ms = 0.5（50%進行）
//     // Math.minで1を超えないように制限

//     // ③ イージングを適用（動きに変化をつける）
//     const eased = easeOutQuad(progress);
//     // progress=0.5 → eased=0.75
//     // 最初は速く動き、後半はゆっくり減速

//     // ④ 現在の位置を計算
//     const lng = lerp(from.lng, to.lng, eased);
//     const lat = lerp(from.lat, to.lat, eased);
//     // 例: from.lng=139.0, to.lng=139.1, eased=0.75
//     //     → lng = 139.0 + (139.1-139.0) * 0.75 = 139.075

//     // ⑤ マーカーを移動
//     onUpdate([lng, lat]);
//     // userMarker.setLngLat([lng, lat]);

//     // ⑥ まだ終わってなければ次のフレームを予約
//     // アニメーションが完了していない（600ms経過していない）場合
//     // 次のフレーム（約16ms後）で同じanimate関数をもう一度実行する
//     if (progress < 1) {
//       // window.requestAnimationFrame()：ブラウザにアニメーションを行いたいことを通知
//       // 次の再描画の前にコールバック引数を実行させる
//       animationId = requestAnimationFrame(animate);
//     }
//   };

//   // 前のアニメーションがあればキャンセル
//   if (animationId) {
//     cancelAnimationFrame(animationId);
//   }

//   // 新しいアニメーション開始
//   animationId = requestAnimationFrame(animate);
// }
