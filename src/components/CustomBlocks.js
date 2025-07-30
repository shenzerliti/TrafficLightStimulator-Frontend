import * as Blockly from 'blockly/core';
import {javascriptGenerator}  from 'blockly/javascript';

Blockly.Arduino = new Blockly.Generator('Arduino');

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



Blockly.Arduino['turn_red'] = function (block) {
  return 'digitalWrite(2, HIGH);\n';
};

Blockly.Arduino['turn_yellow'] = function (block) {
  return 'digitalWrite(4, HIGH);\n';
};

Blockly.Arduino['turn_green'] = function (block) {
  return 'digitalWrite(3, HIGH);\n';
};

Blockly.Arduino['wait_seconds'] = function (block) {
  const seconds = Blockly.Arduino.valueToCode(block, 'SECONDS', Blockly.Arduino.ORDER_NONE) || '1';
  const milliseconds = `${seconds} * 1000`;
  return `delay(${milliseconds});\n`;
};