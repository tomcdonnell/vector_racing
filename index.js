/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "index.js"
*
* Project: Racing.
*
* Purpose: Starting point for the client-side code.
*
* Author: Tom McDonnell 2007.
*
\**************************************************************************************************/

// Globally executed code. /////////////////////////////////////////////////////////////////////////

$(document).ready
(
   /*
    *
    */
   function onLoadWindow(e)
   {
      try
      {
         var f = 'onDocumentReady()';
         UTILS.checkArgs(f, arguments, ['function']);

         var racingGame = new RacingGame();

         document.body.appendChild(racingGame.getDiv());

         racingGame.init();
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }
);

/*******************************************END*OF*FILE********************************************/
