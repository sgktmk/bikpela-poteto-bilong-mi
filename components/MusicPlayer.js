import { useEffect, useRef } from 'react'
import ABCJS from 'abcjs'

const MusicPlayer = ({ abcNotation }) => {
  const sheetRef = useRef(null)

  useEffect(() => {
    if (sheetRef.current) {
      ABCJS.renderAbc(sheetRef.current, abcNotation)
    }
  }, [abcNotation])

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
    <div>
      <div ref={sheetRef}></div>
      <div id="audio"></div>
      <button onClick={playMusic}>Play</button>
    </div>
  )
}

export default MusicPlayer
