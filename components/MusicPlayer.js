import { useEffect, useRef } from 'react'
import ABCJS from 'abcjs'

const MusicPlayer = ({ abcNotation }) => {
  const sheetRef = useRef(null)
  const lastHighlightedRef = useRef([])

  useEffect(() => {
    const styleId = `music-player-style-${Math.random().toString(36).substr(2, 9)}`
    const style = document.createElement('style')
    style.id = styleId
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

    const swingMatch = abcNotation.match(/%%MIDI swing\s+(\d+)/)
    const swingValue = swingMatch ? parseInt(swingMatch[1], 10) : 0

    playMusic(visualObj, swingValue)

    return () => {
      document.head.removeChild(style)
    }
  }, [abcNotation])

  const playMusic = (visualObj, swingValue = 0) => {
    if (ABCJS.synth.supportsAudio()) {
      // Create synth controller with cursor support
      const synthControl = new ABCJS.synth.SynthController()

      const cursorControl = {
        beatSubdivisions: 2,

        onStart() {
          // 再生開始時に前回のハイライトをクリア
          lastHighlightedRef.current.forEach((el) => el.setAttribute('fill', ''))
          lastHighlightedRef.current = []
        },

        onEvent(ev) {
          // 前回のハイライトをクリア
          lastHighlightedRef.current.forEach((el) => el.setAttribute('fill', ''))
          lastHighlightedRef.current = []

          // 今回の音符に色を付けて記憶
          if (ev && ev.elements && ev.elements.length > 0) {
            for (let i = 0; i < ev.elements.length; i++) {
              for (let j = 0; j < ev.elements[i].length; j++) {
                ev.elements[i][j].setAttribute('fill', '#dc2626')
                lastHighlightedRef.current.push(ev.elements[i][j])
              }
            }
          }
        },

        onFinished() {
          // 再生終了時にハイライトをクリア
          lastHighlightedRef.current.forEach((el) => el.setAttribute('fill', ''))
          lastHighlightedRef.current = []
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
        try {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)()

          const options = {
            programOffsets: {},
            fadeLength: 200,
            defaultQpm: 180,
            swing: swingValue,
            onEnded: function () {},
          }

          const synth = new ABCJS.synth.CreateSynth()
          await synth.init({
            visualObj: visualObj,
            audioContext: audioContext,
            millisecondsPerMeasure: visualObj.millisecondsPerMeasure(),
            options,
          })

          await synth.prime({ audioContext, options })

          synthControl.setTune(visualObj, false, options)
        } catch (error) {
          console.error('Error initializing audio:', error)
        }
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
