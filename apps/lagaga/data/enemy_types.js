/*
	to add:
		preferred height + tolerance
		player dropping something upwards when damaged; enemies can pick it up and be "supercharged" for a while, the duration being proportional to how much damage the player took -- sudden escalation, anyone? ^^
		
	enemy ideas:

		"bullet eater" hunts after and eats player bullets, can only be harmed by starving it of bullets (?!)

		"repair drone" which tries to keep enemies between itself and the player, and seeks out damaged enemies to repair them. small and nimble, but not too lightly armoured.

		"kamikaze" (either frontal or from the side)

		"thief" which doesn't shoot, but tries to hover in a close distance close to the player to make the player drop some credits, which it will then collect (it will also collect credits exploded enemies drop)

		"barrier beam"
		

		
		)
*/
lgg.etypes = [];

var index = 0;

lgg.ENEMY_TYPE__BLORB_X				= index++;
lgg.ENEMY_TYPE__BLORB_Y				= index++;
lgg.ENEMY_TYPE__BLORB_BIG			= index++;

lgg.ENEMY_TYPE__SCIMITAR_BOMBER		= index++;
lgg.ENEMY_TYPE__SCIMITAR_FIGHTER	= index++;
lgg.ENEMY_TYPE__BIGBLOB				= index++;
lgg.ENEMY_TYPE__BIGMINE				= index++;
lgg.ENEMY_TYPE__BLOB				= index++;
lgg.ENEMY_TYPE__BLOBCHAIN			= index++;
lgg.ENEMY_TYPE__CARRIER				= index++;
lgg.ENEMY_TYPE__EYE					= index++;
lgg.ENEMY_TYPE__FIGHTER				= index++;
lgg.ENEMY_TYPE__FIREBALL			= index++;
lgg.ENEMY_TYPE__FIREBALL_HUGE		= index++;
lgg.ENEMY_TYPE__GOLFBALL			= index++;
lgg.ENEMY_TYPE__HECKLER				= index++;
lgg.ENEMY_TYPE__MINE				= index++;
lgg.ENEMY_TYPE__OBSERVER			= index++;
lgg.ENEMY_TYPE__PATROL				= index++;
lgg.ENEMY_TYPE__SAUCER				= index++;



lgg.DEBUG__ETYPES					= false;
//lgg.DEBUG__ETYPES					= true;

lgg.debugged_etypes = {
	patrol: true, 
};