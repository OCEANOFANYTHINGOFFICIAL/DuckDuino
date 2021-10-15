#  DuckDuino 

Simple **Ducky Script** to **Arduino**, **Digispark** And **MuKeyboard** converter Online.

  

If you need to perform mouse emulation then use [Ducky2Arduino](https://oceanofanythingofficial.github.io/Ducky2Arduino).

  

*NOTE: If you are on linux, you might use the Arduino IDE from the website, not from apt, because the apt repo is not up to date.*

##  Live version:

https://oceanofanythingofficial.github.io/DuckDuino/

  

##  Why DuckDuino ?

You can compile **Ducky Script** to ***Arduino**, **Digispark** And **MuKeyboard** code directly through the [live](https://oceanofanythingofficial.github.io/DuckDuino/  "DuckDuino Live") version, or reuse `DuckDuino.js` for standalone use :

```javascript

let Duck =  new  DuckDuino();

let mods =  new  Modules().list;

  

let output = Duck.compileCode("STRING Thanks OCEAN OF ANYTHING !", mods[0].module);

/* ^- Here will be the final compiled code |

** and errors if applicable. |

** Here is the selected module -/

**

** Note: You can iterate through the list and find the desired one,

** by default, `0` will be the first module.

*/

```
