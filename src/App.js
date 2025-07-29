import React, { useState } from 'react';
import BlocklyEditor from './components/BlocklyEditor';
import TrafficLightSimulator from './components/TrafficLightStimulator';
import './App.css';

function App() {
  const [generatedCode, setGeneratedCode] = useState('');

  return (
    <div className="App">
      <h1 className='blockly-header'>Traffic Light Simulator</h1>

      <div className="app-layout">
        <div className="workspace">
          <BlocklyEditor setGeneratedCode={setGeneratedCode} />
        </div>

        <div className="simulator">
          <TrafficLightSimulator generatedCode={generatedCode}
  setGeneratedCode={setGeneratedCode} />
        </div>

      <div className='code-display'>
        <h3>Generated Code</h3>
        <pre>{generatedCode}</pre>

      </div>
      </div>
    </div>
  );
}

export default App;
