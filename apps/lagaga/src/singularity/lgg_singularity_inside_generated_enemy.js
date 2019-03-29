"use strict";

lgg.SingularityInside_Generated_Enemy = function(species, id)
{
	this.species = species;
}
lgg.SingularityInside_Generated_Enemy_Species = function(type, id)
{
	this.role					// guard (defend exits and other dungeon features)
								// predator (attack anyone because they can)
								// rogue (like loot, don't like danger)
								// tourist (they're kind of just there, though other species may be allied with them)
	// these don't have any actual meaning, they just are used to find likely allies and enemies	
	// these range from -1 to 1, with 0 being neutral
	this.random_cultural_item_1
	this.random_cultural_item_2
	this.random_cultural_item_3
	this.sight					// how good are they at seeing things?
	this.hearing				// how good are they at riding waterski?
	this.agility				// how quickly can they turn and change speed
	this.speed					// do they like to go fast?
	this.intelligence			// how well 
	this.primary_weapon_type	// projectile
								// melee
	this.primary_weapon_power
	this.secondary_weapon_type	// none
								// projectile
								// melee
								/* special:
									alert members of species (power defines range)
									heal self (power defines speed of healing, and with agility defines ability to move while healing)
									heal other (ditto)
								*/
	this.secondary_weapon_power
}