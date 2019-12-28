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

Open Questions
--------------

? tokens/words/commands/spells - what is the terminology here?

