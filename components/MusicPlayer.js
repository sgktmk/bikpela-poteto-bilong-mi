import { useEffect, useRef } from 'react'
import ABCJS from 'abcjs'

function CursorControl() {
  this.onStart = function() {
    const svg = document.querySelector("svg");
    if (svg) {
      // Create the cursor
      const cursor = document.createElementNS("http://www.w3.org/2000/svg", "line");
      cursor.setAttribute("class", "abcjs-cursor");
      cursor.setAttributeNS(null, 'x1', 0);
      cursor.setAttributeNS(null, 'y1', 0);
      cursor.setAttributeNS(null, 'x2', 0);
      cursor.setAttributeNS(null, 'y2', 0);
      cursor.setAttributeNS(null, 'stroke', '#1d4ed8');
      cursor.setAttributeNS(null, 'stroke-width', '2');
      cursor.setAttributeNS(null, 'opacity', '0.8');
      svg.appendChild(cursor);
    }
  };
  
  this.beatSubdivisions = 2;
  
  this.onEvent = function(ev) {
    if (ev.measureStart && ev.left === null)
      return; // This was the second part of a tie across a measure line
    
    const cursor = document.querySelector("svg .abcjs-cursor");
    if (cursor && ev.left !== undefined) {
      cursor.setAttribute("x1", ev.left - 2);
      cursor.setAttribute("x2", ev.left - 2);
      cursor.setAttribute("y1", ev.top);
      cursor.setAttribute("y2", ev.top + ev.height);
    }
  };
  
  this.onFinished = function() {
    const cursor = document.querySelector("svg .abcjs-cursor");
    if (cursor) {
      cursor.setAttribute("x1", 0);
      cursor.setAttribute("x2", 0);
      cursor.setAttribute("y1", 0);
      cursor.setAttribute("y2", 0);
    }
  };
}

const MusicPlayer = ({ abcNotation }) => {
  const sheetRef = useRef(null);

  useEffect(() => {
    const visualObj = ABCJS.renderAbc(sheetRef.current, abcNotation, {
      responsive: 'resize',
      expandToWidest: true,
      add_classes: true,
    })[0];
    
    playMusic(visualObj);
  }, [abcNotation]);

  const playMusic = (visualObj) => {
    if (ABCJS.synth.supportsAudio()) {
      // Create cursor control instance
      const cursorControl = new CursorControl();
      
      // Create synth controller
      const synthControl = new ABCJS.synth.SynthController();
      synthControl.load('#audio', cursorControl, {
        displayLoop: true,
        displayRestart: true,
        displayPlay: true,
        displayProgress: true,
        displayWarp: true,
      });

      const createSynth = async () => {
        const synth = new ABCJS.synth.CreateSynth();
        await synth.init({ visualObj: visualObj });
        await synth.prime();
        
        synthControl.setTune(visualObj, false);
      };

      createSynth();
    } else {
      console.error('Audio is not supported in this browser.');
    }
  };

  return (
    <div>
      <div ref={sheetRef}></div>
      <div id="audio"></div>
    </div>
  );
};

export default MusicPlayer
