import abcjs from 'abcjs'
import React, { useEffect, useState } from 'react'

const MusicScore = ({ code }) => {
  const [showNotation, setShowNotation] = useState(false)

  useEffect(() => {
    if (!showNotation) {
      abcjs.renderAbc('musicNotation', code)
    }
  }, [code, showNotation])

  return (
    <div className="relative">
      {!showNotation ? (
        <div id="musicNotation"></div>
      ) : (
        <pre className="rounded bg-gray-100 p-4 dark:bg-gray-800">
          <code>{code}</code>
        </pre>
      )}
      <div className="mt-2 flex justify-center">
        <button
          onClick={() => setShowNotation(!showNotation)}
          className="rounded border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          {showNotation ? 'Show Score' : 'Show ABC Notation'}
        </button>
      </div>
    </div>
  )
}

export default MusicScore
