import { useEffect, useRef } from 'react'
import ABCJS from 'abcjs'

const MusicPlayer = ({ abcNotation }) => {
  const sheetRef = useRef(null)

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .abcjs-cursor {
        stroke: #1d4ed8;
        stroke-width: 2;
        opacity: 0.8;
      }
    `
    document.head.appendChild(style)

    const visualObj = ABCJS.renderAbc(sheetRef.current, abcNotation, {
      responsive: 'resize',
      expandToWidest: true,
      add_classes: true,
    })[0]

    playMusic(visualObj)

    return () => {
      document.head.removeChild(style)
    }
  }, [abcNotation])

  const playMusic = (visualObj) => {
    if (ABCJS.synth.supportsAudio()) {
      // Create synth controller with cursor support
      const synthControl = new ABCJS.synth.SynthController()

      const cursorControl = {
        beatSubdivisions: 2,

        onStart() {},

        onEvent(ev) {
          if (ev && ev.elements && ev.elements.length > 0) {
            for (let i = 0; i < ev.elements.length; i++) {
              for (let j = 0; j < ev.elements[i].length; j++) {
                ev.elements[i][j].setAttribute('fill', '#1d4ed8')
              }
            }
          }
        },

        onFinished() {
          const notes = document.querySelectorAll('.abcjs-note')
          notes.forEach((note) => {
            note.setAttribute('fill', '')
          })
        },
      }

      synthControl.load('#audio', cursorControl, {
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
