import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './App.css';

const App = () => {

const commands=[
  {
    command: 'open *',
    callback: (site) =>{
      window.open('http://'+site)
    }
  },
  {
    command: 'change background colour to *',
    callback: (color) =>{
    document.body.style.background=color;
    }
  }
]

  const { transcript,  resetTranscript } = useSpeechRecognition({commands});

  if (!SpeechRecognition.browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className='btns'>
      <button className='strt' onClick={SpeechRecognition.startListening({continuous:true, language:'en-IN'})}>Start</button>
      <button className='stp' onClick={SpeechRecognition.stopListening}>Stop</button>
      <button className='rst' onClick={resetTranscript}>Reset</button>
      <p className='trans'><b><i>{transcript}</i></b></p>
    </div>
  );
};
export default App;