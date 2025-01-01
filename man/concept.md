Ghoster Concept
===============

*Behind the computer screen there are ghosts living in the machine and moving color dots around*

* *Ghosts* - autonomous agents living inside a computer

* *Fragment* - grid space for ghosts to live in. A single map defined by width and height.

* *Tokens* - various items used by ghosts

* *Dots* - pixel tokens, colored picture elements. Only dots are visible in dot space framebuffer.

* *Cell* - a discrete point on the fragment grid defined by it's coordinates. 

* *Ghost Space* - a world perspective where ghosts and tokens are visible.

* *Dot Space* - represents a screen, a world perspective where only colored dots are observable.

* *Capsule* - a package that defines all ghosts and fragments.



Design Tenets
-------------

* the grid is dumb, tokens are static (mostly), ghosts are smart

* dpad-only mode, keyboard/mouse is not required (primary).

* keyboard mode

* touchpad mode?

* mouse only mode?

* self-documenting system. All hints, mission details, spell manuals and world details should be inside

* a gateway mission - select other missions and teleport to other carts

* game cart or image metaphor - all the state, tools, help etc is in there

* like docker images - snapshot + change commands => another signed/hashed snapshot

* you can select (and eat?) grid section with special markers

* help can be in a form of civipedia/ufopedia grid with wise library ghosts

* chatbot interface to get the useful info (and chat logs like in DeusEx - so you'll never forget)

* players control ghosts

* ghosts can be in multiple teams controlled by different players or AI - e.g. CoreWars, Darwin (advanced)

* the fragment is discrete, a ghost/dot/token can't be in-between cells (however, a ghost movement can be animated, so it would not appear jump-teleporting)

* as the consequence, ghostspace has only an integer arithmetics. There is no point in fractions in this world! Fractions are out of this world!

* Ghosts are running concurrently
    * one ghost is running spells until it moves
    * after it yields control to the next ghost etc
    * once all ghosts are moved, it is called a *step*
      (good analogy are rougue-like games - make a single move and the enemies are making the move)

* The grid can evolve in various ways:
    * mono-debug (for a single ghost)
        * run in command and stop
        * run over command and stop
        * step
    * multi-debug (for all active ghosts? How are we going to activate them?)
        * multi-step (rougue-like)
    * step-by-step each 1s (configurable period)
    * fast mode - do all scheduled spells

* There is a halt/debugger spell to dive into a proper debug mode at the right moment

* Save and mark the full capsule state to jump there later (new/updated spells will be kept by ghosts)?
  We can mark the area we are currently working on and when restored, that particular area preserves changes.
  That way we can do change-try-restore cycles.

* Save and mark the ghost position to jump back and redo updated command

* *The Spell Path* - the road with tokens, loops and conditional turns

* Ghots can have moods which affect their behavior.
    * explore mood - just move without default interaction
    * lick mood - taste what is under ghost feets
    * pacman mood - eat everything in the path
    * dropy mood - drop 
    * spawn mood - each move spawn and place the thing on top of the stack

* Cycles(cybermana?) is a currency in challenge capsules.

* Ghosts can move from map to map through open portals

* Mission tree can be built from a set of portals that act as hyperlinks between capsules.

* Colored zones to mark an area purpose?

* Chase mode - a ghost following/targeting a particular token or another ghots?

* Lemmings are the ghosts wondering around and looking for immediate commands to execute - you can spawn these types (limited by the walls?)

* Some tricks are event sensors/triggers



Open Questions
--------------

? main pattern for complex programs is to layout flow on the grid with tokens
  the ghost will run and lick all the instructions (?) and then will do them as a spell

? all spells are set as tokens on the map and then will be eaten later by ghosts who will learn stuff

? tokens/words/commands/spells/tricks/subroutines - what is the terminology here?

? cycles/mana/paint/ink/dust/powder is the only resource here?

? pattern recognition

? how to react on events



Tokens
------
Tokens are the items on the grid.
Each has potential cost in cycles (for scenarios where we need to limit players, not in a creative mode).


### Token Types

* nil/empty/false
* colored dot
* integer number
* character
* text/string
* text banner/tag?
* word - a symbol used to locate tokens in dictionary
* spell - low-level atomic trick
* sequence - a list of tricks
* array/collection/sequence
* grid - 2d array
* dict?
* sound sample
* pressure plate - a way to remotely trigger the related ghost trick?
* switch
* teleporters
* token pathways - a way to authomatically move tokens (aka Factorio)? What about dumb map and smart ghosts?



Core Actions
------------
* move
* lick
* eat
* drop/paint
* spawn/paint
* join
* kill
* capture the next/prev ghost
* jump home
* jump at beacon
* sleep
* patrol
* guard/traffic control
* exchange messages (bot mechanics, can be visible)
* learn new tricks
* forget tricks
* capture state - make a snapshot for rollbacks
* rewind - just jump back to the last positions and preserve map (we can save and run again)
* restore/rollback - restore tokens, ghost placement and state (vocabulary and state)
* forget the last save - now we can return to the previous one (or maybe the first one ever - on the world start)
* start recording a macro
* stop recording
* name sequence (it should be autonamed)

Core Cycle
----------
You load a scenario that setups the map - places tokens and ghosts.

Control the ghost. To learn new tricks, lay down tokens in a row
terminated by an imidiate trick (a logical mine).
Than place the ghost in front of a row a launch right >>.
It would consume until the wall/empty space


Ghost Structure
---------------

### Ghost Profile

* name
* team color

### Tract
It is the stack that consists of what the ghost eats.

### Ghost Dictionary?
Vocabulary of tricks that ghost is capable to perform.

### Ghost Call Stack (hidden, only for debug?)

### Ghost Log



Ghost Proverbs
--------------
Short and poetic philosophycal principles.

* ask librarian ghost for new tricks

* use garbage collector to clean up execution artifacts



Story Topics
------------

* garbage/littering story - once a ghost is not carefull about the garbage she drops,
  and another ghosts might be confused, and the whole ghost town eventually can turn
  into a one big garbage dump

