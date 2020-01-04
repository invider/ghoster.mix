Dotter Concepts
===============

*Behind the computer screen there are ghosts, living in the machine and moving color dots around*

*Ghosts* - autonomous agents living inside a computer

*Dots* - colored picture elements

*Tokens" - various items used by ghosts

*Grid* - a discrete space the ghost are living in

*Cell* - a discrete point on the grid with particular coordinates. 

*Dot Space* - a world perspective, when only colored dots are observable

*Ghost Space* - a world perspective, when ghost and token movements are visible


Design Decisions
----------------

* the gird is discrete, a ghost/dot/token can't be in-between cells (however, a ghost movement can be animated, so it would not appear jump-teleporting)

* as a consequence, ghostspace has only integer arithmetics. There is no point in fractions in this world.

* ghost are running concurrently
    * one ghost is running spells until it moves
    * after it yields control to the next ghost etc
    * once all ghosts are moved, it is called a *step*
      (good analogy are  rougue-like games - make a single move and the enemies are making the move)

* the grid can evolve in various ways:
    * mono-debug
        * run in command and stop
        * run over command and stop
        * step
    * multi-debug
        * multi-step (rougue-like)
    * step-by-step each 1s (configurable period)
    * fast mode - do all scheduled spells

* there is a halt/debugger spell to dive into debug at the right moment

* save and mark the full grid state to jump there later (new/updated spells will be kept by ghosts)

* save and mark the ghost position to jump back and redo updated command

* *The Spell Path* - the road with tokens, loops and conditional turns

* Ghots can have moods which affect their behavior.
    * explore mood - just move without default interaction
    * lick mood - taste what is under ghost feets
    * pacman mood - eat everything in the path
    * spawn mood - each move spawn and place the thing on top of the stack
    * dropy mood - drop 

* Ghosts can move from map to map through open portals

* Mission tree can be built from a set of portals that act as hyperlinks between maps.




Open Questions
--------------

? should tract and items/memory/dictionary be the same thing? (probably yes)

? main pattern for complex programs is to layout flow on the grid with tokens
  the ghost will run and lick all the instructions (?) and then will do them as a spell

? all spells are set as tokens on the map and then will be eaten later by ghosts who will learn stuff

? tokens/words/commands/spells - what is the terminology here?

Story Topics
------------

* garbage/littering story - once a ghost is not carefull about the garbage she drops,
  and another ghosts might be confused, and the whole ghost town eventually can turn
  into a one big garbage dump

