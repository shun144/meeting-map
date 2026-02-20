// イージング（最初は速く、後でゆっくり減速する動きを作る関数）
export function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}
