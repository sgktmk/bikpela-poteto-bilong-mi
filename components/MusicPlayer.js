import { useEffect, useRef, useState } from 'react'
import ABCJS from 'abcjs'

const MusicPlayer = ({ abcNotation }) => {
  const sheetRef = useRef(null)

  useEffect(() => {
    const visualObj = ABCJS.renderAbc(sheetRef.current, abcNotation, {
      responsive: 'resize',
      expandToWidest: true,
    })
    playMusic(visualObj[0])
  }, [abcNotation])

  const playMusic = (visualObj) => {
    if (ABCJS.synth.supportsAudio()) {
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
        await synth.init({ visualObj: visualObj })
        await synth.prime()
        synthControl.setTune(visualObj, false)
      }

      createSynth()
    } else {
      console.error('Audio is not supported in this browser.')
    }
  }

  return (
    <div>
      <div ref={sheetRef}></div>
      <div id="audio"></div>
    </div>
  )
}

export default MusicPlayer
