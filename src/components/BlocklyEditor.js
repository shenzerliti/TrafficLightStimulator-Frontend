import React, { useEffect, useRef } from 'react';
import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';
import 'blockly/blocks';
import 'blockly/msg/en';
import './CustomBlocks'; // Your custom block definitions

const BlocklyEditor = ({ setGeneratedCode }) => {
  const blocklyDiv = useRef(null);
  const toolbox = useRef(null);
  const workspaceRef = useRef(null);

  useEffect(() => {
    if (workspaceRef.current) {
      workspaceRef.current.dispose();
    }

    if (blocklyDiv.current && toolbox.current) {
      // ✅ Correct injection
      const workspace = Blockly.inject(blocklyDiv.current, {
        toolbox: toolbox.current,
      });
      workspaceRef.current = workspace;

      // ✅ Live Arduino code generation
      const updateCode = () => {
        const blocks = workspace.getTopBlocks(true);
        let code = '';
        blocks.forEach((block) => {
          if (isValidBlock(block)) {
            code += generateArduinoCode(block);
          }
        });
        setGeneratedCode(code);
      };

      updateCode(); // Initial
      workspace.addChangeListener(updateCode); // On change
    }

    return () => {
      if (workspaceRef.current && !workspaceRef.current.isDisposed?.()) {
        workspaceRef.current.dispose();
        workspaceRef.current = null;
      }
    };
  }, [setGeneratedCode]);

  // ✅ Allowed block types
  const isValidBlock = (block) => {
    const allowedTypes = [
      'turn_red',
      'turn_green',
      'turn_yellow',
      'wait_seconds',
      'controls_repeat_ext',
      'controls_whileUntil',
      'math_number',
    ];
    return allowedTypes.includes(block.type);
  };

  // ✅ Custom Arduino-style generator
  const generateArduinoCode = (block) => {
    switch (block.type) {
      case 'turn_red':
        return '  digitalWrite(2, HIGH);\n  digitalWrite(3, LOW);\n  digitalWrite(4, LOW);\n  delay(1000);\n';
      case 'turn_green':
        return '  digitalWrite(2, LOW);\n  digitalWrite(3, HIGH);\n  digitalWrite(4, LOW);\n  delay(1000);\n';
      case 'turn_yellow':
        return '  digitalWrite(2, LOW);\n  digitalWrite(3, LOW);\n  digitalWrite(4, HIGH);\n  delay(1000);\n';
      case 'wait_seconds':
        const seconds = block.getFieldValue('SECONDS') || 1;
        return `  delay(${seconds * 1000});\n`;
      case 'controls_repeat_ext': {
        const times = javascriptGenerator.valueToCode(block, 'TIMES', javascriptGenerator.ORDER_ATOMIC) || '1';
        const statements = javascriptGenerator.statementToCode(block, 'DO') || '';
        return `  for (int i = 0; i < ${times}; i++) {\n${statements}}\n`;
      }
      case 'controls_whileUntil': {
        const mode = block.getFieldValue('MODE');
        const condition = javascriptGenerator.valueToCode(block, 'BOOL', javascriptGenerator.ORDER_NONE) || 'false';
        const body = javascriptGenerator.statementToCode(block, 'DO') || '';
        return mode === 'WHILE'
          ? `  while (${condition}) {\n${body}}\n`
          : `  do {\n${body}} while (!(${condition}));\n`;
      }
      default:
        return '';
    }
  };

  return (
    <div className="blockly-editor">
      <div
        ref={blocklyDiv}
        id="blocklyDiv"
        style={{ height: '480px', width: '100%' }}
      ></div>

      <xml ref={toolbox} style={{ display: 'none' }}>
        <category name="Loops" colour="green">
          <block type="controls_repeat_ext" />
          <block type="controls_whileUntil" />
        </category>
        <sep gap="30" />
        <category name="Logic" colour="blue">
          <block type="wait_seconds" />
        </category>
        <sep gap="30" />
        <category name="Traffic Light" colour="red">
          <block type="turn_red" />
          <block type="turn_green" />
          <block type="turn_yellow" />
        </category>
        <sep gap="30" />
        <category name="Math" colour="purple">
          <block type="math_number" />
        </category>
      </xml>
    </div>
  );
};

export default BlocklyEditor;
