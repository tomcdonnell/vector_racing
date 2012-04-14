/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "Racer.js"
*
* Project: Racing.
*
* Purpose: Definition of the Racer object.
*
* Author: Tom McDonnell 2007.
*
\**************************************************************************************************/

// Global variables. ///////////////////////////////////////////////////////////////////////////////

// Functions. //////////////////////////////////////////////////////////////////////////////////////

/*
 *
 */
function Racer(raceTrack, image, imageRadius)
{
   var f = 'Racer()';
   UTILS.checkArgs(f, arguments, [RaceTrack, HTMLImageElement, Number]);
   UTILS.assert(f, 0, imageRadius > 0);

   // Public functions. /////////////////////////////////////////////////////////////////////////

   this.getImg       = function () {return image;      };
   this.getImgRadius = function () {return imageRadius;};

   /*
    * This function was added in order to implement a 'ghost' racer.
    * The ghost racer's position is set to a new value each timestep.
    * The ghost racer's position for each timestep comes from a pre-recorded or pre-calculated lap.
    *
    * NOTE: Coodinates supplied here should be track coordinates
    * (eg. (x: 0.5, y: 0.5) is middle of trackGridSquare (r: 0, c: 0) (top-leftmost square)).
    * (eg. (x: 1.5, y: 1.5) is middle of trackGridSquare (r: 1, c: 1)).
    */
   this.setPos = function (p)
   {
      // Optimised for speed. */ var f = 'Racer.setPos()';
      // Optimised for speed. */ UTILS.checkArgs(f, arguments, [VectorRec2d]);

      self.pos.setX(p.getX());
      self.pos.setY(p.getY());

      updateStyleVars();
   };

   /*
    * Accelerate the racer in the direction angle for the duration deltaTime.
    *
    * @param angle {Number}
    *    The direction in which to accelerate the racer.
    *    Units: radians (-pi, pi].
    *    Eg: angle =  0    accelerate right.
    *        angle =  pi/2 accelerate up.
    *        angle = -pi/2 accelerate down.
    *        angle =  pi   accelerate left.
    *
    * @param deltaTime {Number}
    *    The time period for which to accelerate the racer.
    *    Units: milliseconds.
    */
   this.accelerate = function (angle, deltaTime)
   {
      // Optimised for speed. */ var f = 'Racer.accelerate()';
      // Optimised for speed. */ UTILS.checkArgs(f, arguments, [Number, Number]);

      // Get force on racer due to mouse.
      // Magnitude = 1, direction = angle.
      var forceOnRacerDueToMouse = (new VectorPol2d(1, angle)).convToRec();

      // Get force on racer due to drag.
      // (Magnitude proportional to square of velocity, direction opposite to velocity.)
      var velMag = self.vel.getMagnitude();
      switch (velMag == 0)
      {
       case true:
         var forceOnRacerDueToDrag = new VectorRec2d(0, 0);
         break;
       case false:
         var forceOnRacerDueToDrag = self.vel.multiply
         (
            -1 * raceTrack.getAtmosphericDragCoefficient() * velMag * velMag
         ); 
         break;
      }

      // a = f / m.
      var acc = (forceOnRacerDueToMouse.add(forceOnRacerDueToDrag)).divide(self.getMass());

      // v = v0 + at.
      self.vel = self.vel.add(acc.multiply(deltaTime));

      // s = s0 + vt.
      posOld   = self.pos;
      self.pos = self.pos.add(self.vel.multiply(deltaTime));

      // Update position taking into account collisions with barriers.
      // (Note: self.pos and self.vel are updated as they are passed by reference.)
      var lapStatus = raceTrack.updateRacerPosition(posOld, self.pos, self.vel);

      updateStyleVars();

      return lapStatus;
   }

   // Private functions. ////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   function updateStyleVars()
   {
      // Optimised for speed. var f = 'RaceTrack.updateStyleVars';
      // Optimised for speed. UTILS.checkArgs(f, arguments, []);

      var posTemp = self.pos.clone();

      raceTrack.convertCoordinatesTrackToWindow(self.pos);

      image.style.top  = (self.pos.getY() - imageRadius) + 'px';
      image.style.left = (self.pos.getX() - imageRadius) + 'px';

      self.pos = posTemp;
   }

   // Private variables. ////////////////////////////////////////////////////////////////////////

   var self = this;

   // Initialisation code. //////////////////////////////////////////////////////////////////////

   image.style.position   = 'absolute';
   image.style.background = 'transparent';

   Particle.apply
   (
      this,
      [
         new VectorRec2d(2, 2), // Position.
         new VectorRec2d(0, 0), // Velocity.
         200000,                // Mass.
         0                      // Radius.
      ]
   );

   updateStyleVars();
}

Racer.inherits(Particle);

/*******************************************END*OF*FILE********************************************/
