import * as Blockly from 'blockly/core';
import {javascriptGenerator}  from 'blockly/javascript';


Blockly.Blocks['turn_red'] = {
  init: function () {
    this.appendDummyInput().appendField("Turn Red Light ON");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
  
  }
};


Blockly.Blocks['turn_yellow'] = {
  init: function () {
    this.appendDummyInput().appendField("Turn Yellow Light ON");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(60);
   
  }
};

Blockly.Blocks['turn_green'] = {
  init: function () {
    this.appendDummyInput().appendField("Turn Green Light ON");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    
  }
};


Blockly.Blocks['wait_seconds'] = {
  init: function () {
    this.appendValueInput("SECONDS")
      .setCheck("Number")
      .appendField("wait for");
    this.appendDummyInput()
      .appendField("seconds");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
  }
};

javascriptGenerator.forBlock['turn_red'] = () => 'turn_red();\n';
javascriptGenerator.forBlock['turn_green'] = () => 'turn_green();\n';
javascriptGenerator.forBlock['turn_yellow'] = () => 'turn_yellow();\n';

javascriptGenerator.forBlock['wait_seconds'] = function(block, generator) {
  const seconds = generator.valueToCode(block, 'SECONDS', javascriptGenerator.ORDER_NONE
) || '0';
  const milliseconds = `${seconds} * 1000`;
  return `await wait_seconds(${milliseconds});\n`;
};


