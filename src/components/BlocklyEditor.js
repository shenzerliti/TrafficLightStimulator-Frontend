import React, { useEffect, useRef } from 'react';
import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript'; // For internal JS simulation
import 'blockly/blocks';
import 'blockly/msg/en';
import './CustomBlocks'; // Make sure this file defines your custom blocks

const BlocklyEditor = ({ setGeneratedCode }) => {
  const blocklyDiv = useRef(null);
  const toolbox = useRef(null);
  const workspaceRef = useRef(null);

  useEffect(() => {
    if (workspaceRef.current) {
      workspaceRef.current.dispose();
    }

    if (blocklyDiv.current && toolbox.current) {
      workspaceRef.current = Blockly.inject(blocklyDiv.current, {
        toolbox: toolbox.current,
      });

      const workspace = workspaceRef.current;

      const onWorkspaceChange = () => {
        // For live JS preview (optional)
        const jsCode = javascriptGenerator.workspaceToCode(workspace);

        // Generate Arduino code manually
        let arduinoCode = '';
        const blocks = workspace.getTopBlocks(true);
        blocks.forEach((block) => {
          arduinoCode += generateArduinoCode(block);
        });

        const fullCode = `
void setup() {
  pinMode(2, OUTPUT); // Red
  pinMode(3, OUTPUT); // Green
  pinMode(4, OUTPUT); // Yellow
}

void loop() {
${arduinoCode}
}
        `.trim();

        setGeneratedCode(fullCode); // ✅ Send code to parent to display
      };

      workspace.addChangeListener(onWorkspaceChange);

      workspace.addChangeListener((e) => {
        if (
          e.type === Blockly.Events.BLOCK_CREATE ||
          e.type === Blockly.Events.BLOCK_MOVE
        ) {
          const block = workspace.getBlockById(e.blockId);
          if (block && !isValidBlock(block)) {
            block.setColour('#ff0000');
            block.setWarningText('Invalid block!');
          } else if (block) {
            block.setColour(block.originalColour || block.getColour());
            block.setWarningText(null);
          }
        }
      });
    }

    return () => {
      if (workspaceRef.current && !workspaceRef.current.isDisposed?.()) {
        workspaceRef.current.dispose();
        workspaceRef.current = null;
      }
    };
  }, [setGeneratedCode]);

  // ✅ Define allowed block types
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

  // ✅ Your manual Arduino code generator function
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
        const condition = javascriptGenerator.valueToCode(block, 'BOOL', Blockly.JavaScript.ORDER_NONE) || 'false';
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
