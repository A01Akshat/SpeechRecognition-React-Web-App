import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';
import Groq from 'groq-sdk';
import './App.css';

const groq = new Groq({
  apiKey: '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',
  dangerouslyAllowBrowser: true,
});

const App = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [useAI, setUseAI] = useState(false);
  const [aiResponse, setAIResponse] = useState('');
  const [showInfoBox, setShowInfoBox] = useState(false);

  const commands = [
    {
      command: 'open *',
      callback: (site) => {
        window.open('http://' + site);
      }
    },
    {
      command: 'change background colour to *',
      callback: (color) => {
        document.body.style.background = color;
      }
    },
    {
      command: 'search for *',
      callback: (query) => {
        if (useAI) {
          performAISearch(query);
        } else {
          performSearch(query);
        }
      }
    }
  ];

  const { transcript, resetTranscript } = useSpeechRecognition({ commands });

  if (!SpeechRecognition.browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const performSearch = async (query) => {
    const apiKey = 'AIzaSyAHBNg30QUxGajGMx73wE-tdDqNrdTEzaM';
    const searchEngineId = 'f3edf0a83b76a431a';
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${query}`;

    try {
      const response = await axios.get(url);
      setSearchResults(response.data.items);
    } catch (error) {
      console.error('Error fetching search results', error);
    }
  };

  const performAISearch = async (query) => {
    try {
      const response = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: query,
          },
        ],
        model: "llama3-8b-8192",
      });
      setAIResponse(response.choices[0]?.message?.content || '');
    } catch (error) {
      console.error('Error fetching AI response', error);
    }
  };

  const clearResults = () => {
    setSearchResults([]);
    setAIResponse('');
  };

  const toggleInfoBox = () => {
    setShowInfoBox(!showInfoBox);
  };

  return (
    <div className='App'>
      <div className={`content ${showInfoBox ? 'blur' : ''}`}>
        
        <div className='btns'>
        <h1 className='heading'>𝑺𝒑𝒆𝒂𝒈𝒍𝒆 𝑨𝑰</h1>
          <button className='strt' onClick={() => SpeechRecognition.startListening({ continuous: true, language: 'en-IN' })}>Start</button>
          <button className='stp' onClick={SpeechRecognition.stopListening}>Stop</button>
          <button className='rst' onClick={resetTranscript}>Reset</button>
          <button className='clr' onClick={clearResults}>Clear Results</button>
          <button className='ai' onClick={() => setUseAI(!useAI)}>{useAI ? <span style={{ border:"4x solid #f5426f" }}>AI:On</span> : <span>AI:Off</span>}</button>
        </div>
        <p className='trans'><b><i>{transcript}</i></b></p>
        <div className='results'>
          {searchResults.length > 0 && (
            <ul>
              {searchResults.map((result, index) => (
                <li key={index}>
                  <a href={result.link} target="_blank" rel="noopener noreferrer">{result.title}</a>
                  <p>{result.snippet}</p>
                </li>
              ))}
            </ul>
          )}
          {aiResponse && (
            <div className='ai-response'>
              <h3>AI Response:</h3>
              <div dangerouslySetInnerHTML={{ __html: aiResponse.replace(/\*/g, '') }} />
            </div>
          )}
        </div>
        <img src={`${process.env.PUBLIC_URL}/info.png`} style={{ height: "2rem", width: "2rem", marginLeft: "97rem", marginTop: "17.5rem", cursor: "pointer" }} onClick={toggleInfoBox} alt='Image'/>
      </div>
      {showInfoBox && (
        <div className='info-box'>
          <h2>How to Use Commands</h2>
          <p><b>Open a Website:</b> Say "open [website name]" (e.g., "open google.com"). Don't forget to say ".com" at the end :)</p>
          <p><b>Change Background Colour:</b> Say "change background colour to [colour]" (e.g., "change background colour to blue").</p>
          <p><b>Search:</b> Say "search for [query]" (e.g., "search for weather") to search on Google. Or,
          use AI search by toggling AI Button.</p>
          <button className='close-btn' onClick={toggleInfoBox}>Close</button>
        </div>
      )}
    </div>
  );
};

export default App;
