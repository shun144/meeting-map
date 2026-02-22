export const createUserMarkerElement = () => {
  const el = document.createElement("div");
  el.style.cssText = `
    position: relative;
    width: 24px;
    height: 24px;
  `;

  el.innerHTML = `
  <style>
    @keyframes ripple {
      0% { transform: scale(1); opacity: 0.6; }
      100% { transform: scale(2.8); opacity: 0; }
    }
    .ripple-1 { animation: ripple 3s ease-out infinite; transform-origin: center; }
    .ripple-2 { animation: ripple 3s ease-out infinite 0.9s; transform-origin: center; }
    .ripple-3 { animation: ripple 3s ease-out infinite 1.8s; transform-origin: center; }
  </style>
  <svg width="80" height="80" viewBox="0 0 80 80" style="position: absolute; top: -28px; left: -28px; overflow: visible;">
    <defs>
      <radialGradient id="beamGrad" cx="50%" cy="100%" r="80%">
        <stop offset="0%" stop-color="#4285F4" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#4285F4" stop-opacity="0"/>
      </radialGradient>
    </defs>

    <!-- 扇形のビーム -->
    <path
      d="M40 40 L20 0 A45 45 0 0 1 60 0 Z"
      fill="url(#beamGrad)"
    />

    <!-- 波紋 rではなくscaleで拡大 -->
    <circle class="ripple-1" cx="40" cy="40" r="10" fill="none" stroke="#4285F4" stroke-width="1.5" opacity="0"/>
    <circle class="ripple-2" cx="40" cy="40" r="10" fill="none" stroke="#4285F4" stroke-width="1.5" opacity="0"/>
    <circle class="ripple-3" cx="40" cy="40" r="10" fill="none" stroke="#4285F4" stroke-width="1.5" opacity="0"/>

    <!-- 外側の円（精度リング） -->
    <circle cx="40" cy="40" r="16" fill="#4285F4" fill-opacity="0.15"/>
    <!-- メインの青い円 -->
    <circle cx="40" cy="40" r="10" fill="#4285F4"/>
    <!-- 中心の白い円 -->
    <circle cx="40" cy="40" r="4" fill="white"/>
  </svg>
`;

  return el;
};
