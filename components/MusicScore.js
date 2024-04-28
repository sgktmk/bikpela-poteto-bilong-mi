import abcjs from 'abcjs'
import React, { useEffect } from 'react'

const MusicScore = ({ code }) => {
  useEffect(() => {
    abcjs.renderAbc('musicNotation', code)
  })
  return <div id="musicNotation"></div>
}

export default MusicScore
