TODO
=====

[ ] Determine enemy types
	* Slow, randomly moving enemy - either indistructible or very tough
	* Generic enemy; medium speed, always moves toward player
	* Immobile barrier - can be destroyed, but touching it is fatal
	* Spawner - Avoids player and creates more baddies
	* Spawner lvl.2 - randomly moves while creating more baddies
	* Wizard - shoots projectiles at player's current position
	* Wizard lvl.2 - shoots slower, homing projectiles

-> Note: "random" movement must be calculated by some sort of seed value, so as
		 to be deterministic

	Sprites:
	* Goblin
	* Bat
	* Spikes
	* Skeleton
	* Dark Knight
	* Imp
	* Ghost
[ ] Create algorithm to place enemies in a deterministic pattern
[ ] See how much memory it takes to store player input

* Could have the exit immediately visible, but only by killing enemies does the
  player refill their life bar.
* Life potions drop every nth enemy, where `n` slowly increases
