import * as Blockly from 'blockly/core';
import {javascriptGenerator}  from 'blockly/javascript';

Blockly.Arduino.ORDER_ATOMIC = 0;

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
      .appendField("Wait (seconds)");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
  
  }
};

javascriptGenerator.forBlock['turn_red'] = () => 'turn_red();\n';
javascriptGenerator.forBlock['turn_green'] = () => 'turn_green();\n';
javascriptGenerator.forBlock['turn_yellow'] = () => 'turn_yellow();\n';

javascriptGenerator.forBlock['wait_seconds'] = (block) => {
  const value = javascriptGenerator.valueToCode(block, 'SECONDS', javascriptGenerator.ORDER_NONE) || '0';
  return `wait_seconds(${value}* 1000);\n`;
};

