import React, { useState } from 'react';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import './TrafficLightStimulator.css';

const TrafficLightStimulator = ({ generatedCode, setGeneratedCode }) => {
  const [light, setLight] = useState('');

  const runCode = async () => {
    // Generate code from the Blockly workspace
    const code = javascriptGenerator.workspaceToCode(Blockly.getMainWorkspace());
    setGeneratedCode(code); // Show generated code in UI

    // Define async helper functions and expose them in a sandbox
    const sandbox = {
      wait_seconds: async (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
      },
      turn_red: () => setLight('red'),
      turn_green: () => setLight('green'),
      turn_yellow: () => setLight('yellow'),
    };

    try {
      // Run the generated code in an async sandbox environment
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      const exec = new AsyncFunction('sandbox', `
        with(sandbox) {
          ${code}
        }
      `);
      await exec(sandbox);
    } catch (err) {
      console.error('Execution error:', err);
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
