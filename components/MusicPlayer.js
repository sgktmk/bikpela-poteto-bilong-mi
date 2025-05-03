import { useEffect, useRef, useState } from 'react'
import ABCJS from 'abcjs'

const MusicPlayer = ({ abcNotation }) => {
  const sheetRef = useRef(null)

  useEffect(() => {
    const visualObj = ABCJS.renderAbc(sheetRef.current, abcNotation, {
      responsive: 'resize',
      expandToWidest: true,
      add_classes: true,
      showCursor: true,
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
        
        const audioParams = {
          options: {
            cursorControl: {
              beatSubdivisions: 2,
              showCursor: true,
              cursorColor: '#1d4ed8', // Blue color for cursor
              cursorAlpha: 0.8, // Opacity of the cursor
            }
          }
        }
        
        synthControl.setTune(visualObj, false, audioParams)
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
