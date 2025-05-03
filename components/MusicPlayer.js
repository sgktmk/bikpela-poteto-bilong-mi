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
      .abcjs-highlight {
        fill: #1d4ed8;
      }
    `
    document.head.appendChild(style)

    const visualObj = ABCJS.renderAbc(sheetRef.current, abcNotation, {
      responsive: 'resize',
      expandToWidest: true,
      add_classes: true,
      showCursor: true,
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
        showCursor: true,
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
          // Create audio context first to ensure it's available
          const audioContext = new (window.AudioContext || window.webkitAudioContext)()

          const audioParams = {
            audioContext: audioContext,
            options: {
              soundFontUrl: 'https://paulrosen.github.io/abcjs-assets/soundfont/',
              defaultSwing: 0, // Explicitly set swing to 0 to avoid TypeError
              programOffsets: {},
              fadeLength: 200,
              defaultQpm: 180,
              sequenceCallback: function () {},
              callbackContext: null,
              onEnded: function () {},
            },
          }

          const synth = new ABCJS.synth.CreateSynth()
          await synth.init({
            visualObj: visualObj,
            audioContext: audioContext,
            options: audioParams.options,
          })

          await synth.prime(audioParams)

          // Set the tune with cursor support
          synthControl.setTune(visualObj, false, {
            chordsOff: false,
            midiTranspose: 0,
            voicesOff: false,
            generateDownload: false,
            soundFontUrl: 'https://paulrosen.github.io/abcjs-assets/soundfont/',
          })
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
