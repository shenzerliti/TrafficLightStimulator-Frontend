import React, { useState } from 'react';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import './TrafficLightStimulator.css';

const TrafficLightStimulator = ({ generatedCode, setGeneratedCode }) => {
  const [light, setLight] = useState('');
 

  const wait_seconds = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const runCode = async () => {
    const code = javascriptGenerator.workspaceToCode(Blockly.getMainWorkspace());
    setGeneratedCode(code); // Show code in UI

    const lines = code.split('\n').filter(line => line.trim() !== '');

    for (let line of lines) {
      if (line.includes("turn_red")) {
        setLight('red');
      } else if (line.includes("turn_green")) {
        setLight('green');
      } else if (line.includes("turn_yellow")) {
        setLight('yellow');
      } else if (line.includes("await new Promise")) {
        const match = line.match(/setTimeout\(resolve,\s*(\d+)\)/);
        if (match && match[1]) {
          const ms = parseInt(match[1]);
          await wait_seconds(ms);
        }
      }

      await wait_seconds(200); // Let visual change appear
    }
  };

  return (
 <div className="simulator-container">
    <div className="traffic-panel">
      <div className="traffic-light">
        <div className={`light red ${light === 'red' ? 'on' : ''}`}></div>
        <div className={`light yellow ${light === 'yellow' ? 'on' : ''}`}></div>
        <div className={`light green ${light === 'green' ? 'on' : ''}`}></div>
      </div>

      <button className="run-button" onClick={runCode}>▶ Run Traffic Light</button>
    </div>

  </div>
  );
};

export default TrafficLightStimulator;
