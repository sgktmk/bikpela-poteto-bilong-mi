import { useEffect, useRef, useState } from 'react'
import ABCJS from 'abcjs'

const MusicPlayer = ({ abcNotation }) => {
  const sheetRef = useRef(null)
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateSize = () => {
      if (sheetRef.current && sheetRef.current.parentElement) {
        const { width, height } = sheetRef.current.parentElement.getBoundingClientRect()
        setParentSize({ width, height })
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)

    return () => window.removeEventListener('resize', updateSize)
  }, [])

  useEffect(() => {
    if (sheetRef.current && parentSize.width > 0) {
      ABCJS.renderAbc(sheetRef.current, abcNotation, {
        responsive: 'resize',
        width: parentSize.width,
        expandToWidest: true,
      })
      playMusic()
    }
  }, [abcNotation, parentSize])

  const playMusic = () => {
    if (ABCJS.synth.supportsAudio()) {
      const visualObj = ABCJS.renderAbc(sheetRef.current, abcNotation)
      const synthControl = new ABCJS.synth.SynthController()
      synthControl.load('#audio', null, {
        displayLoop: true,
        displayRestart: true,
        displayPlay: true,
        displayProgress: true,
        displayWarp: true,
      })

      const createSynth = async () => {
        const synth = new ABCJS.synth.CreateSynth()
        await synth.init({ visualObj: visualObj[0] })
        await synth.prime()
        synthControl.setTune(visualObj[0], false)
      }

      createSynth()
    } else {
      console.error('Audio is not supported in this browser.')
    }
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div ref={sheetRef} style={{ width: '100%', height: 'auto' }}></div>
      <div id="audio"></div>
    </div>
  )
}

export default MusicPlayer
