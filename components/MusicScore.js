import abcjs from 'abcjs'
import React, { useEffect, useRef } from 'react'

const MusicScore = ({ code }) => {
  const notationRef = useRef(null)

  useEffect(() => {
    if (notationRef.current) {
      abcjs.renderAbc(notationRef.current, code)
    }
  }, [code])

  return <div ref={notationRef}></div>
}

export default MusicScore
