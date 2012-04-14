/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "SidePanel.js"
*
* Project: Racing.
*
* Purpose: Definition of the SidePanel object.
*
* Author: Tom McDonnell 12/2007
*
\**************************************************************************************************/

/*
 *
 */
function SidePanel()
{
   var f = 'SidePanel()';
   UTILS.checkArgs(f, arguments, []);

   // Public functions. /////////////////////////////////////////////////////////////////////////

   // Getters. --------------------------------------------------------------------------------//

   this.getDiv            = function () {return div;           };
   this.getLapTimeDiv     = function () {return lapTimeDiv;    };
   this.getBestLapTimeDiv = function () {return BestlapTimeDiv;};

   // Setters. --------------------------------------------------------------------------------//

   this.setCurrentLapTime = function (t) {currentLapTimeDiv.innerHTML = t / 1000;};

   // Other public functions. -----------------------------------------------------------------//

   /*
    *
    */
   this.addCompletedLapTime = function (t)
   {
/*
      if (t < recordLapTime)
      {
         recordLapTime = t;

         recordLapTimeDiv.innerHTML = recordLapTime / 1000;
      }

      previousLapTimes.push(t / 1000);
*/
   };

   // Private variables. ////////////////////////////////////////////////////////////////////////

   var recordLapTime = 50500; // Units: milliseconds.

   // Setup div. ------------------------------------------------------------------------------//

   var trackSelector = SELECT
   (
      OPTION('Suzuka'       ),
      OPTION('Albert Park'  ),
      OPTION('Philip Island')
   );

   var ghostsTable = TABLE
   (
      TBODY
      (
         TR(TD(INPUT({type: 'checkbox'})), TD('Best this session' )),
         TR(TD(INPUT({type: 'checkbox'})), TD('Best ever human'   )),
         TR(TD(INPUT({type: 'checkbox'})), TD('Best ever computer'))
      )
   );

   var setupDiv = DIV
   (
      H2('Setup'),
      H3('Select track'),
      trackSelector,
      H3('Select Ghosts'),
      ghostsTable
   );

   // Session div. ----------------------------------------------------------------------------//

   var bestLapTimeDiv    = DIV();
   var currentLapTimeDiv = DIV();

   var previousLapsTable = TABLE
   (
      TBODY
      (
         TR(TD('5'), TD('23.42')),
         TR(TD('4'), TD('24.53')),
         TR(TD('3'), TD('23.42')),
         TR(TD('2'), TD('24.53')),
         TR(TD('1'), TD('23.64'))
      )
   );

   var sessionDiv = DIV
   (
      H2('Session'),
      H3('Best lap', bestLapTimeDiv),
      H3('Current lap', currentLapTimeDiv),
      H3('Previous laps'),
      previousLapsTable
   );

   // Records div. ----------------------------------------------------------------------------//

   var recordLapTimeDiv = DIV(String(recordLapTime / 1000));

   var bestLapsTable = TABLE
   (
      TBODY
      (
         TR(TH({colspan: 2}, 'Best laps')),
         TR(TD('1'), TD('20.42')),
         TR(TD('2'), TD('20.53')),
         TR(TD('3'), TD('21.42')),
         TR(TD('4'), TD('21.53')),
         TR(TD('5'), TD('21.64'))
      )
   );

   var recordsDiv = DIV
   (
      H2('Records'),
      H3('Record lap:', recordLapTimeDiv),
      previousLapsTable
   );

   // Container div. --------------------------------------------------------------------------//

   var div = DIV
   (
      {
         style:
         (
            'height: ' + window.innerHeight        + 'px; ' +
            'width: '  + window.innerWidth  * 0.25 + 'px; ' +
            'float: left; '
         )
      },

      H1('Racing'),
      setupDiv,
      sessionDiv,
      recordsDiv
   );
}

/*******************************************END*OF*FILE********************************************/
