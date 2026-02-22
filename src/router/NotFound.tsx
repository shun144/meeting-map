import { useNavigate } from "react-router";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center relative overflow-hidden">
      {/* グリッド背景 */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* グロー */}
      <div className="absolute w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="relative z-10 text-center px-6 sm:px-8">
        {/* 404 */}
        <p className="text-[6rem] sm:text-[10rem] md:text-[16rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 via-violet-400 to-sky-400 select-none">
          404
        </p>

        {/* 区切り線 */}
        <div className="w-10 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent mx-auto mb-6" />

        <p className="text-indigo-900/80 text-base sm:text-lg font-semibold tracking-widest uppercase mb-2">
          Page Not Found
        </p>
        <p className="text-indigo-900 text-xs sm:text-sm font-light mb-10">
          お探しのページは存在しないか、移動した可能性があります
        </p>

        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 border border-indigo-500/50 text-indigo-700 text-sm tracking-widest uppercase rounded-sm hover:text-indigo-900 hover:border-indigo-700 hover:bg-indigo-100 transition-all duration-300 cursor-pointer"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              d="M9 2L4 7l5 5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          ホームに戻る
        </button>
      </div>
    </div>
  );
}
