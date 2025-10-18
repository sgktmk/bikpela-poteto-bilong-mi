import React, { useEffect } from 'react'
import abcjs from 'abcjs'
import { ABCJSRenderOptions } from '@/types'

interface MusicScoreProps {
  code: string
}

const MusicScore: React.FC<MusicScoreProps> = ({ code }) => {
  useEffect(() => {
    // SSR対応: ブラウザ環境でのみ実行
    if (typeof window === 'undefined') return

    try {
      const options: ABCJSRenderOptions = {
        responsive: 'resize',
        expandToWidest: true,
        add_classes: true,
      }

      // DOM要素の存在確認
      const element = document.getElementById('musicNotation')
      if (element && abcjs && typeof abcjs.renderAbc === 'function') {
        abcjs.renderAbc('musicNotation', code, options)
      } else {
        console.warn('MusicScore: DOM element or abcjs library not available')
      }
    } catch (error) {
      console.error('Error rendering music notation:', error)
    }
  }, [code])

  return (
    <div className="music-notation-container">
      <div id="musicNotation"></div>
    </div>
  )
}

export default MusicScore
