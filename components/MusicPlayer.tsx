import React, { useEffect, useRef } from 'react'
import ABCJS from 'abcjs'
import { ABCJSRenderOptions } from '@/types'

interface MusicPlayerProps {
  abcNotation: string
}

interface CursorControl {
  beatSubdivisions: number
  onStart: () => void
  onEvent: (ev: { elements?: HTMLElement[][] }) => void
  onFinished: () => void
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ abcNotation }) => {
  const sheetRef = useRef<HTMLDivElement>(null)
  const lastHighlightedRef = useRef<HTMLElement[]>([])

  useEffect(() => {
    // SSR対応: ブラウザ環境でのみ実行
    if (typeof window === 'undefined') return
    if (!sheetRef.current) return

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

    try {
      // ABCJSライブラリの存在確認
      if (!ABCJS || typeof ABCJS.renderAbc !== 'function') {
        console.warn('MusicPlayer: ABCJS library not available')
        return
      }

      const options: ABCJSRenderOptions = {
        responsive: 'resize',
        expandToWidest: true,
        add_classes: true,
      }

      const visualObjects = ABCJS.renderAbc(sheetRef.current, abcNotation, options)
      if (visualObjects && visualObjects.length > 0) {
        const visualObj = visualObjects[0] as any

        const swingMatch = abcNotation.match(/%%MIDI swing\s+(\d+)/)
        const swingValue = swingMatch ? parseInt(swingMatch[1], 10) : 0
        playMusic(visualObj, swingValue)
      }
    } catch (error) {
      console.error('Error rendering music player:', error)
    }

    return () => {
      const existingStyle = document.getElementById(styleId)
      if (existingStyle) {
        document.head.removeChild(existingStyle)
      }
    }
  }, [abcNotation])

  const playMusic = (visualObj: any, swingValue = 0) => {
    // ABCJSライブラリとsynthの存在確認
    if (!ABCJS || !ABCJS.synth || typeof ABCJS.synth.supportsAudio !== 'function') {
      console.warn('MusicPlayer: ABCJS synth not available')
      return
    }

    if (ABCJS.synth.supportsAudio()) {
      // Create synth controller with cursor support
      const synthControl = new ABCJS.synth.SynthController()

      const cursorControl: CursorControl = {
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
                const element = ev.elements[i][j]
                if (element && typeof element.setAttribute === 'function') {
                  element.setAttribute('fill', '#dc2626')
                  lastHighlightedRef.current.push(element)
                }
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
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
          if (!AudioContextClass) {
            console.error('AudioContext is not supported in this browser.')
            return
          }

          const audioContext = new AudioContextClass()

          const options = {
            programOffsets: {},
            fadeLength: 200,
            defaultQpm: 180,
            swing: swingValue,
            onEnded: function () {
              // 再生終了時の処理（空でも問題なし）
            },
          }

          const synth = new ABCJS.synth.CreateSynth()
          await synth.init({
            visualObj: visualObj,
            audioContext: audioContext,
            millisecondsPerMeasure: visualObj.millisecondsPerMeasure(),
            options,
          })

          await synth.prime()

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
    <div className="music-notation-container">
      <div ref={sheetRef}></div>
      <div id="audio" className="mt-4"></div>
    </div>
  )
}

export default MusicPlayer
