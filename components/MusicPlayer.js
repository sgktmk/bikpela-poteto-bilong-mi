import { useEffect, useRef, useState } from 'react'
import ABCJS from 'abcjs'

const MusicPlayer = ({ abcNotation }) => {
  const sheetRef = useRef(null)
  const cursorRef = useRef(null)

  useEffect(() => {
    const visualObj = ABCJS.renderAbc(sheetRef.current, abcNotation, {
      responsive: 'resize',
      expandToWidest: true,
      add_classes: true,
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
        
        const cursorControl = {
          beatSubdivisions: 2,
          showCursor: true,
          onBeat: function(beatNumber, totalBeats, totalTime) {
          },
          onEvent: function(ev) {
            if (ev) {
              const elements = ev.elements;
              if (elements && elements.length > 0) {
              }
            }
          },
          onFinished: function() {
          }
        };
        
        // Create timing callbacks for cursor
        if (cursorRef.current) {
          cursorRef.current.stop();
        }
        
        cursorRef.current = new ABCJS.TimingCallbacks(visualObj, {
          beatCallback: cursorControl.onBeat,
          eventCallback: cursorControl.onEvent,
          beatSubdivisions: cursorControl.beatSubdivisions
        });
        
        synthControl.setTune(visualObj, false).then(function() {
          synthControl.start();
          cursorRef.current.start();
          
          synthControl.addEventListener("stop", function() {
            if (cursorRef.current) {
              cursorRef.current.stop();
            }
          });
        });
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
