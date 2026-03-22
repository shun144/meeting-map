import React, { memo, useCallback, useState, type FC } from "react";
import { clearCache } from "@/lib/indexedDB/database";

interface Props {
  isClearing: boolean;
  setIsClearing: React.Dispatch<React.SetStateAction<boolean>>;
}

const CacheClearSection: FC<Props> = ({ isClearing, setIsClearing }) => {
  const [clearSuccess, setClearSuccess] = useState(false);

  const handleClearCache = useCallback(async () => {
    const msg =
      "キャッシュした地図データをクリアしますか？\nオフライン時に地図データが使用できなくなります。";

    if (!confirm(msg)) return;

    setIsClearing(true);
    try {
      await clearCache();
      setClearSuccess(true);
      setTimeout(() => setClearSuccess(false), 3000);
    } catch (error) {
      console.error("キャッシュクリア失敗", error);
      alert("キャッシュクリアに失敗しました");
    } finally {
      setIsClearing(false);
    }
  }, []);

  return (
    <div className="mt-10 sm:mt-14 border-t border-indigo-100 pt-6 sm:pt-8 flex flex-col items-center gap-3">
      <p className="text-xs sm:text-sm text-gray-400 text-center">
        キャッシュした地図データをクリアする
        <br className="sm:hidden" />
        場合はこちらをクリック
      </p>
      <button
        onClick={handleClearCache}
        disabled={isClearing}
        className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg border border-red-200 text-red-500 text-xs sm:text-sm font-medium hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isClearing ? (
          <>
            <div className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
            クリア中...
          </>
        ) : (
          <>
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            キャッシュクリア
          </>
        )}
      </button>

      {clearSuccess && (
        <p className="text-xs text-green-500 flex items-center gap-1">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          キャッシュをクリアしました
        </p>
      )}
    </div>
  );
};

export default memo(CacheClearSection);
