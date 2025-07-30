import React, { useEffect, useRef } from 'react';
import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';
import 'blockly/msg/en';
import 'blockly/blocks';
import './CustomBlocks';



const BlocklyEditor = ({ setGeneratedCode }) => {
  const blocklyDiv = useRef(null);
  const toolbox = useRef(null);
  const workspaceRef = useRef(null);

  useEffect(() => {
    // Dispose any existing workspace before injecting a new one
    if (workspaceRef.current) {
      workspaceRef.current.dispose();
    }

    // Inject Blockly workspace
    if (blocklyDiv.current && toolbox.current) {
      workspaceRef.current = Blockly.inject(blocklyDiv.current, {
        toolbox: toolbox.current,
      });

      const workspace = workspaceRef.current;

      // Update generated code when blocks change
      const onWorkspaceChange = () => {
        const code = javascriptGenerator.workspaceToCode(workspace);
        setGeneratedCode(code);
      };

      workspace.addChangeListener(onWorkspaceChange);

      // Highlight invalid blocks and prevent them from snapping
      workspace.addChangeListener((e) => {
        if (
          e.type === Blockly.Events.BLOCK_CREATE ||
          e.type === Blockly.Events.BLOCK_MOVE
        ) {
          const block = workspace.getBlockById(e.blockId);
          if (block && !isValidBlock(block)) {
            block.setColour('#ff0000'); // Red for invalid
            block.setWarningText('Invalid block!');
          } else if (block) {
            block.setColour(block.originalColour || block.getColour());
            block.setWarningText(null);
          }
        }
      });
    }

    workspaceRef.current.addChangeListener(() => {
      const codeFromBlocks = Blockly.Arduino.workspaceToCode(workspaceRef.current);

      const fullCode = `
void setup() {
  pinMode(2, OUTPUT); // Red
  pinMode(3, OUTPUT); // Green
  pinMode(4, OUTPUT); // Yellow
}

void loop() {
${codeFromBlocks}
}
`;
      setGeneratedCode(fullCode);
    });


    // Cleanup on unmount
    return () => {
      if (workspaceRef.current && !workspaceRef.current.isDisposed?.()) {
        workspaceRef.current.dispose();
        workspaceRef.current = null;
      }
    };
  }, [setGeneratedCode]);

  // ✅ Validation function for allowed blocks
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
          <block type="controls_if" />
          <block type="controls_whileUntil"/>
        </category>
         <sep gap="30"/>
        <category name="Logic" colour="blue">
            <block type="logic_compare"></block>
            <block type="logic_operation"></block>
           <block type="wait_seconds" />
        </category>
        <sep gap="30"/>
        <category name="Traffic Light" colour="red" >
          <block type="turn_red" />
          <block type="turn_green" />
          <block type="turn_yellow" />
         
        </category>
        <sep gap="30"/>
         <category name="Math" colour="purple" >
          <block type="math_number" />
          <block type="math_arithmetic" />
        </category>
      </xml>

    </div>
  );
};

export default BlocklyEditor;
