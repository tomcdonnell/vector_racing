/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "RaceTrack.js"
*
* Project: Racing.
*
* Purpose: Definition of the RaceTrack object.
*
* Author: Tom McDonnell 2007.
*
\**************************************************************************************************/

// Functions. //////////////////////////////////////////////////////////////////////////////////////

/*
 *
 */
function RaceTrack(trackTableGrid, trackTableHeight, trackTableWidth)
{
   var f = 'RaceTrack()';
   UTILS.checkArgs(f, arguments, [Array, Number, Number]);
   UTILS.assert(f, 0, trackTableHeight >  0);
   UTILS.assert(f, 1, trackTableWidth  >  0);

   // Public functions. /////////////////////////////////////////////////////////////////////////

   // Getters. --------------------------------------------------------------------------------//

   this.getTable                      = function () {return trackTable;                };
   this.getTableGrid                  = function () {return trackTableGrid;            };
   this.getScalingFactor              = function () {return SCALING_FACTOR;            };
   this.getAtmosphericDragCoefficient = function () {return atmosphericDragCoefficient;};

   // Other public functions. -----------------------------------------------------------------//

   /*
    * This function should be run after the track
    * HTML table element has been added to the DOM.
    */
   this.setOffsets = function (offsetTop, offsetLeft)
   {
      var f = 'RaceTrack.setOffsets()';
      UTILS.checkArgs(f, arguments, [Number, Number]);

      trackTableOffsetTop  = offsetTop;
      trackTableOffsetLeft = offsetLeft;
   };

   /*
    * Convert window coordinates to those used inside the raceTrack.
    * Any coordinates supplied to member functions of RaceTrack() must be raceTrack coordinates.
    *
    * Definitions:
    *
    * Window coordinates:
    *   The normal coordinates used inside the browser window.
    *   MouseEvents supply these coordinates.
    *   Eg. (x: 0                , y: 0                 ) is top    left  corner,
    *       (x: window.innerWidth, y: window.innerHeight) is bottom right corner.
    *
    * Track coordinates definition:
    *   The coordinates used inside the raceTrack.
    *   Eg. (x: 0                , y: 0                 ) is top    left  corner,
    *       (x: 0.5              , y: 0.5               ) is middle of top left square,
    *       (x: N_COLS           , y: N_ROWS            ) is bottom right corner.
    */
   this.convertCoordinatesWindowToTrack = function (pos)
   {
      //Optimised for speed.*/ var f = 'RaceTrack.convertCoordinatesWindowToTrack()';
      //Optimised for speed.*/ UTILS.checkArgs(f, arguments, [VectorRec2d]);

      pos.setX((pos.getX() - trackTableOffsetLeft) / SCALING_FACTOR);
      pos.setY((pos.getY() - trackTableOffsetTop ) / SCALING_FACTOR);
   };

   /*
    * See definitions given in convertCoordinatesWindowToTrack().
    */
   this.convertCoordinatesTrackToWindow = function (pos)
   {
      //Optimised for speed.*/ var f = 'RaceTrack.convertCoordinatesTrackToWindow()';
      //Optimised for speed.*/ UTILS.checkArgs(f, arguments, [VectorRec2d]);

      pos.setX((pos.getX() * SCALING_FACTOR) + trackTableOffsetLeft);
      pos.setY((pos.getY() * SCALING_FACTOR) + trackTableOffsetTop );
   };

   /*
    * Update the position of the racer (passed by reference) taking into account collisions
    * with barriers.  Also deal with lap time issues (start timer when cross start/finish line,
    * nullify lap time if cross start/finish line in wrong direction).
    *
    * @param racerPosNew {VectorRec2d}
    *    The new position of the racer not taking into account collisions with barriers.
    */
   this.updateRacerPosition = function (posOld, pos, vel)
   {
      //Optimised for speed.*/ var f = 'RaceTrack.updateRacerPosition()';
      //Optimised for speed.*/ UTILS.checkArgs(f, arguments, [VectorRec2d, VectorRec2d, VectorRec2d]);
      // Get row and column of old and new position of racer in table.
      var tablePosOld = getTablePos(posOld);
      var tablePosNew = getTablePos(pos   );

      dealWithCollisions(pos, vel, tablePosOld, tablePosNew);
      var lapStatus = dealWithLapTimeIssues(pos, tablePosNew, tablePosOld);

      return lapStatus;
   };

   // Private functions. ////////////////////////////////////////////////////////////////////////

   // Collision functions. --------------------------------------------------------------------//

   /*
    *
    */
   function dealWithCollisions(pos, vel, tablePosOld, tablePosNew)
   {
      //Optimised for speed.*/ var f = 'Racetrack.dealWithCollisions()';
      //Optimised for speed.*/ UTILS.checkArgs(f, arguments, [VectorRec2d, VectorRec2d, TablePosition, TablePosition]);

      var newPosIsBarrier = testTrackTableSquare(tablePosNew, TRACK_SQUARE.BARRIER);

      // Calculate change in row and column in coded form.
      var deltaR = tablePosNew.getRow() - tablePosOld.getRow() + 1;
      var deltaC = tablePosNew.getCol() - tablePosOld.getCol() + 1;
      var codedDeltaRC = 10 * deltaR + deltaC;

      switch (codedDeltaRC)
      {
       case 00: collideDiagonal(pos, vel, tablePosOld, tablePosNew, 't', 'l');  break;
       case 01: if (newPosIsBarrier) {collideVertical(pos, vel, tablePosOld, 't');} break;
       case 02: collideDiagonal(pos, vel, tablePosOld, tablePosNew, 't', 'r');  break;
       case 10: if (newPosIsBarrier) {collideHorizontal(pos, vel, tablePosOld, 'l');} break;
       case 11: /* No collision. */                                                break;
       case 12: if (newPosIsBarrier) {collideHorizontal(pos, vel, tablePosOld, 'r');} break;
       case 20: collideDiagonal(pos, vel, tablePosOld, tablePosNew, 'b', 'l');  break;
       case 21: if (newPosIsBarrier) {collideVertical(pos, vel, tablePosOld, 'b');} break;
       case 22: collideDiagonal(pos, vel, tablePosOld, tablePosNew, 'b', 'r');  break;
       default:
         throw new Exception
         (
            f, 'Racer velocity too great for collision detection.\n',
            'posOld: ' + tablePosOld.asString() + ', posNew: ' + tablePosNew.asString()
         );
      }
   }

   /*
    *
    */
   function collideVertical(pos, vel, tablePosOld, tORb)
   {
      //Optimised for speed.*/ var f = 'RaceTrack.collideVertical()';
      //Optimised for speed.*/ UTILS.checkArgs(f, arguments, [VectorRec2d, VectorRec2d, TablePosition, String]);

      var y = pos.getY();
      pos.setY(y + 2 * (getBarrierY(tablePosOld, tORb) - y));
      vel.setY(rebound(vel.getY()));
   }

   /*
    *
    */
   function collideHorizontal(pos, vel, tablePosOld, lORr)
   {
      //Optimised for speed.*/ var f = 'RaceTrack.collideHorizontal()';
      //Optimised for speed.*/ UTILS.checkArgs(f, arguments, [VectorRec2d, VectorRec2d, TablePosition, String]);

      var x = pos.getX();
      pos.setX(x + 2 * (getBarrierX(tablePosOld, lORr) - x));
      vel.setX(rebound(vel.getX()));
   }

   /*
    *
    */
   function collideDiagonal(pos, vel, tablePosOld, tablePosNew, tORb, lORr)
   {
      //Optimised for speed.*/ var f = 'RaceTrack.collideDiagonal()';
      //Optimised for speed.*/ UTILS.checkArgs
      //Optimised for speed.*/ (
      //Optimised for speed.*/    f, arguments, [VectorRec2d, VectorRec2d, TablePosition, TablePosition, String, String]
      //Optimised for speed.*/ );

      var rOld = tablePosOld.getRow();
      var cOld = tablePosOld.getCol();
      var rNew = tablePosNew.getRow();
      var cNew = tablePosNew.getCol();
      var hOccupied = trackTableGrid[rOld][cNew] == 0;
      var vOccupied = trackTableGrid[rNew][cOld] == 0;
      var dOccupied = trackTableGrid[rNew][cNew] == 0;

      // If either of the adjacent table squares or the new table square is occupied...
      if (hOccupied || vOccupied || dOccupied)
      {
         // Calculate the time since the racer passed through the left or right barrier.
         var xBarrier = getBarrierX(tablePosOld, lORr);
         var tSinceCollH = (pos.getX() - xBarrier) / vel.getX();

         // Calculate the time since the racer passed through the top or bottom barrier.
         var yBarrier = getBarrierY(tablePosOld, tORb);
         var tSinceCollV = (pos.getY() - yBarrier) / vel.getY();

         switch (tSinceCollV > tSinceCollH)
         {
          case true:
            if (vOccupied)
            {
               collideVertical(pos, vel, tablePosOld, tORb);

               if (hOccupied)
               {
                  collideHorizontal(pos, vel, tablePosOld, lORr);
               }
            }
            else
            {
               if (hOccupied || dOccupied)
               {
                  collideHorizontal(pos, vel, tablePosOld, lORr);
               }
            }
            break;
          case false:
            if (hOccupied)
            {
               collideHorizontal(pos, vel, tablePosOld, lORr);

               if (vOccupied)
               {
                  collideVertical(pos, vel, tablePosOld, tORb);
               }
            }
            else
            {
               if (vOccupied || dOccupied)
               {
                  collideVertical(pos, vel, tablePosOld, tORb);
               }
            }
            break;
         }
      }
   }

   /*
    *
    */
   function getBarrierX(tablePosOld, lORr)
   {
      //Optimised for speed.*/ var f = 'RaceTrack.getBarrierX()';
      //Optimised for speed.*/ UTILS.checkArgs(f, arguments, [TablePosition, String]);

      switch (lORr)
      {
       case 'l': return  tablePosOld.getCol()     ;
       case 'r': return (tablePosOld.getCol() + 1);
       default: throw new Exception(f, "Expected 'l' or 'r'.  Received '" + lORr + "'."); 
      }
   }

   /*
    *
    */
   function getBarrierY(tablePosOld, tORb)
   {
      //Optimised for speed.*/ var f = 'RaceTrack.getBarrierY()';
      //Optimised for speed.*/ UTILS.checkArgs(f, arguments, [TablePosition, String]);

      switch (tORb)
      {
       case 't': return  tablePosOld.getRow()     ;
       case 'b': return (tablePosOld.getRow() + 1);
       default: throw new Exception(f, "Expected 't' or 'b'.  Received '" + tORb + "'."); 
      }
   }

   /*
    * Return the velocity that results after a
    * racer with the given velocity strikes a barrier.
    *
    * @param v {Number}
    *    Velocity in x or y direction.
    */
   function rebound(v)
   {
      //Optimised for speed.*/ var f = 'RaceTrack.rebound()';
      //Optimised for speed.*/ UTILS.checkArgs(f, arguments, [Number]);

      return -v * 0.6;
   }

   // Timing functions. -----------------------------------------------------------------------//

   /*
    *
    */
   function dealWithLapTimeIssues(pos, tablePosOld, tablePosNew)
   {
      //Optimised for speed.*/ var f = 'Racetrack.dealWithLapTimeIssues()';
      //Optimised for speed.*/ UTILS.checkArgs(f, arguments, [VectorRec2d, TablePosition, TablePosition]);

      if
      (
         testTrackTableSquare(tablePosNew, TRACK_SQUARE.FINISH) &&
         testTrackTableSquare(tablePosOld, TRACK_SQUARE.START )
      )
      {
         // Start lap timer.
console.info(f, 'Crossed s/f line forwards.');
         return 1;
      }

      if
      (
         testTrackTableSquare(tablePosNew, TRACK_SQUARE.START ) &&
         testTrackTableSquare(tablePosOld, TRACK_SQUARE.FINISH)
      )
      {
         // Nullify lap time.
console.info(f, 'Crossed s/f line backwards.');
         return -1;
      }

      return 0;
   }

   // General purpose functions. --------------------------------------------------------------//

   /*
    * @param pos {VectorRec2d}
    *   Table X, Y coordinates (origin at top-left of table) of centre of racer.
    */
   function getTablePos(pos)
   {
      //Optimised for speed.*/ var f = 'RaceTrack.getTablePos()';
      //Optimised for speed.*/ UTILS.checkArgs(f, arguments, [VectorRec2d]);

      return tablePos = new TablePosition
      (
         Math.floor(pos.getY()),
         Math.floor(pos.getX())
      );
   }

   /*
    * Return true if the racer is overlapping a barrier square, false otherwise.
    */
   function testTrackTableSquare(tablePos, trackSquareEnum)
   {
      //Optimised for speed.*/ var f = 'RaceTrack.testTrackTableSquare()';
      //Optimised for speed.*/ UTILS.checkArgs(f, arguments, [TablePosition, Number]);

      var value;
      switch (trackSquareEnum)
      {
       case TRACK_SQUARE.BARRIER: value = 0; break;
       case TRACK_SQUARE.TRACK  : value = 1; break;
       case TRACK_SQUARE.START  : value = 2; break;
       case TRACK_SQUARE.FINISH : value = 3; break;
       default:
         throw new Exception(f, 'Invalid track square enum "' + trackSquareEnum + '".', '');
      }

      return (trackTableGrid[tablePos.getRow()][tablePos.getCol()] == value);
   }

   // Initialisation functions. ---------------------------------------------------------------//

   /*
    *
    */
   function createTrackTable()
   {
      var f = 'RaceTrack.createTrackTable()';
      UTILS.checkArgs(f, arguments, []);

      var n_rows = trackTableGrid.length;
      var n_cols = trackTableGrid[0].length;

      var squaresStart  = [];
      var squaresFinish = [];

      var tdStyle =
      (
         'height: ' + (trackSquareHeight) + 'px; ' +
         'width: '  + (trackSquareWidth ) + 'px; ' +
         'margin: 0; padding: 0'
      );

      for (var r = 0; r < n_rows; ++r)
      {
         var row = trackTableGrid[r];

         if (row.length != n_cols)
         {
            throw new Exception
            (
               f, 'Invalid track definition.',
               'All track rows must have the same number of columns.'
            );
         }

         var tr = TR();
         for (var c = 0; c < n_cols; ++c)
         {
            var square = new TablePosition(r, c);

            var tdClass;
            switch (row[c])
            {
             case TRACK_SQUARE.BARRIER: tdClass = 'barrier'; break;
             case TRACK_SQUARE.TRACK  : tdClass = 'track'  ; break;
             case TRACK_SQUARE.START  : tdClass = 'start'  ; squaresStart.push(square) ; break;
             case TRACK_SQUARE.FINISH : tdClass = 'finish' ; squaresFinish.push(square); break;
             default:
               throw new Exception
               (
                  f, 'Invalid track definition.',
                  'Unexpected character "' + row[c] + '".'
               );
            }

            tr.appendChild(TD({class: tdClass, style: tdStyle}));
         }

         trackTable.appendChild(tr);
      }

      testStartAndFinishSquares(squaresStart, squaresFinish);
   }

   /*
    * Return true if the start/finish squares meet the following requirements, false otherwise.
    *
    * 1. There must be the same number of start squares as finish squares.
    * 1. Each start square must lie in the same row or column, and be connected to each other.
    * 2. For each start square, there must be a single finish square directly adjacent.
    * 3. The adjacent start and finish squares must all be similarly adjacent.
    *    (ie. all starts to the left of finishes, or all starts to the top of finishes, etc.)
    */
   function testStartAndFinishSquares(squaresStart, squaresFinish)
   {
      var f = 'RaceTrack.testStartAndFinishSquares()';
      UTILS.checkArgs(f, arguments, [Array, Array]);

      var n_squares = squaresStart.length;

      if (squaresFinish.length != n_squares)
      {
         throw new Exception
         (
            f, 'Invalid track definition.',
            'The number of start squares must equal the number of finish squares.'
         );
      }

      var s0 = squaresStart[0];
      var s0Row = s0.getRow();
      var s0Col = s0.getCol();

      // Determine whether the start/finish line is aligned vertically or horizontally.
      var alignment = (s0Row == squaresStart[1].getRow())? 'h': 'v';    
      var startRowOrCol = (alignment == 'h')? s0Row: s0Col;

      // Determine the direction startSquare->finishSquare.
      var direction =
      (
         (alignment == 'h')?
         ((trackTableGrid[s0Row - 1][s0Col] == TRACK_SQUARE.FINISH)? 't': 'b'):
         ((trackTableGrid[s0Row][s0Col - 1] == TRACK_SQUARE.FINISH)? 'l': 'r')
      );

      // Test each pair of squares.
      var s, f, fRow, fCol;
      for (var i = 0; i < n_squares; ++i)
      {
         s = squaresStart[i];

         // Find the position where the finish square should be. 
         switch (alignment)
         {
          case 'h': fCol = s.getCol(); fRow = s.getRow() + ((direction == 't')? 1: -1); break;
          case 'v': fRow = s.getRow(); fCol = s.getCol() + ((direction == 'r')? 1: -1); break;
         }

         // If there is no finish square at the position...
         if (trackTableGrid[fRow][fCol] != TRACK_SQUARE.FINISH)
         {
            // The start/finish line was incorrectly specified.
            throw new Exception
            (
               f, 'Invalid track definition.',
               'Start squares must be in same row or column, ' +
               'finish squares must be in same row or column, ' +
               'and each start square must be adjacent to a finish square.'
            );
         }
      }
   }

   // Private constants. ////////////////////////////////////////////////////////////////////////

   const N_ROWS = trackTableGrid.length;
   const N_COLS = trackTableGrid[0].length;

   const SCROLL_BAR_WIDTH = 12;

   // Enumuration for track table grid values.
   const TRACK_SQUARE =
   {
      BARRIER: 0,
      TRACK  : 1,
      START  : 2,
      FINISH : 3
   };

   const SCALING_FACTOR = Math.floor(Math.min(trackTableHeight, trackTableWidth) / N_ROWS);

   // Private variables. ////////////////////////////////////////////////////////////////////////

   // Side length of track square in pixels.
   // NOTE: Math.floor() is used to force integer values.
   var trackSquareHeight = SCALING_FACTOR; // Math.floor(trackTableHeight / N_ROWS);
   var trackSquareWidth  = SCALING_FACTOR; // Math.floor(trackTableWidth  / N_COLS);

   // Recalculate trackTableHeight and trackTable width so they are consistent
   // with the integer values of trackSquareWidth and trackSquareHeight defined above.
   trackTableHeight = N_ROWS * trackSquareHeight;
   trackTableWidth  = N_COLS * trackSquareWidth;

   var trackTable = TABLE
   (
      {
         style:
         'border-collapse: collapse; margin: 0; padding: 0; ' +
         'position: absolute; ' +
         'height: ' + trackTableHeight + 'px; ' + // 
         'width: '  + trackTableWidth  + 'px;'
      }
   );

   // Drag on racer due to atmosphere.
   var atmosphericDragCoefficient = 1000000;

   // Offsets in pixels.
   // These must be set after the track table has been added to the DOM using this.setOffsets().
   trackTableOffsetTop  = null;
   trackTableOffsetLeft = null;

   // Initialisation code. //////////////////////////////////////////////////////////////////////

   createTrackTable();
}

/*******************************************END*OF*FILE********************************************/
