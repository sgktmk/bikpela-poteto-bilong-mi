import React, { useState, useRef } from 'react'
import MusicPlayer from '@/components/MusicPlayer'

interface MusicPlayerWithToggleProps {
  abcNotation: string
}

type DisplayMode = 'score' | 'notation'

const MusicPlayerWithToggle: React.FC<MusicPlayerWithToggleProps> = ({ abcNotation }) => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>('score')
  const [copied, setCopied] = useState(false)
  const textRef = useRef<HTMLPreElement>(null)

  const onCopy = () => {
    setCopied(true)
    if (textRef.current) {
      navigator.clipboard.writeText(abcNotation)
    }
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <div className="music-player-with-toggle">
      {/* トグルボタン */}
      <div className="mb-4 flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setDisplayMode('score')}
          className={`px-4 py-2 font-medium transition-colors ${
            displayMode === 'score'
              ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
          }`}
          aria-label="楽譜を表示"
        >
          楽譜を表示
        </button>
        <button
          onClick={() => setDisplayMode('notation')}
          className={`px-4 py-2 font-medium transition-colors ${
            displayMode === 'notation'
              ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
          }`}
          aria-label="ABC記法を表示"
        >
          ABC記法を表示
        </button>
      </div>

      {/* コンテンツ表示 */}
      <div className="music-content">
        {displayMode === 'score' ? (
          <MusicPlayer abcNotation={abcNotation} />
        ) : (
          <div className="relative">
            {/* コピーボタン */}
            <button
              aria-label="コードをコピー"
              type="button"
              className={`absolute right-2 top-2 h-8 w-8 rounded border-2 bg-gray-700 p-1 dark:bg-gray-800 ${
                copied
                  ? 'border-green-400 focus:border-green-400 focus:outline-none'
                  : 'border-gray-300'
              }`}
              onClick={onCopy}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                stroke="currentColor"
                fill="none"
                className={copied ? 'text-green-400' : 'text-gray-300'}
              >
                {copied ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                )}
              </svg>
            </button>

            {/* ABC記法表示 */}
            <pre
              ref={textRef}
              className="overflow-x-auto rounded-lg bg-gray-800 p-4 text-sm text-gray-100"
            >
              <code className="language-abc">{abcNotation}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default MusicPlayerWithToggle
