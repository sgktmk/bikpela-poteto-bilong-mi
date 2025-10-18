import React, { useEffect } from 'react'

// ABCJSライブラリの型定義（シンプル版）
declare const abcjs: {
  renderAbc: (elementId: string, abcString: string, options?: any) => any[]
}

interface MusicScoreProps {
  code: string
}

const MusicScore: React.FC<MusicScoreProps> = ({ code }) => {
  useEffect(() => {
    abcjs.renderAbc('musicNotation', code)
  }, [code])

  return <div id="musicNotation"></div>
}

export default MusicScore
