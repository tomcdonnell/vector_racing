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

window.addEventListener('load', onLoadWindow, false);

// Functions. //////////////////////////////////////////////////////////////////////////////////////

// Event listeners. ------------------------------------------------------------------------------//

/*
 *
 */
function onLoadWindow(e)
{
   try
   {
      var f = 'onLoadWindow()';
      UTILS.checkArgs(f, arguments, [Event]);

      var racingGame = new RacingGame();

      document.body.appendChild(racingGame.getDiv());

      racingGame.init();
   }
   catch (e)
   {
      UTILS.printExceptionToConsole(f, e);
   }
}

/*******************************************END*OF*FILE********************************************/
