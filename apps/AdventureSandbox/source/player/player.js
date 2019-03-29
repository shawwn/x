asbx.Player = function()
{
	this.body = new asbx.Body();
}

asbx.Player.prototype.spawn_into_world = function(area)
{
	this.body.reset();
	this.body.size_x = 0.27 * asbx.TILESIZE_SIDE;
	this.body.size_y = 0.47 * asbx.TILESIZE_SIDE;
	
	this.body.pos_x = 5.0;
	this.body.pos_y = 105.0;
	
	// Create an empty dynamic body
	this.playerBody = new p2.Body(
		{
			mass: 0.25,
			position: [5.0, 105.0],
			fixedRotation: true,
		}
	);

	this.playerBody.angularDamping = 0.2;
	this.playerBody.damping = 0.9;
	this.playerBody.material = new p2.Material();
	// add shape to body
	this.playerBody.addShape(new p2.Box(
		{
			height: asbx.TILESIZE_SIDE * this.size_y,
			width: 	asbx.TILESIZE_SIDE * this.size_x,
		}
	));

	// add body to world
	area.spawn_body(this.playerBody);
	console.log(this.playerBody);

	this.on_ground = false;
	this.on_ladder = false;
	
	this.last_jump = 0;
	this.jumping = false;
	

	this.health 	= 0;


	this.stamina 	= 0;
							/*
								damage taken
								exhaustion
							*/
	this.agility 	= 0;
							/*
								sprint speed
								jump height
								attack speed
							*/

	this.dexterity 	= 0;
							/*
									lockpicking
									throwing accuracy
							*/




							/*
								
							*/

/*
	this. = 0;
*/
}


asbx.Player.prototype.think = function(time_delta)
{
	

	// left
	var tile_x = Math.floor((this.body.pos_x - this.body.size_x * 0.49999995) / asbx.TILESIZE_SIDE);
	var tile_y = Math.floor((this.body.pos_y) / asbx.TILESIZE_SIDE);
	if (asbx.current_area.data.tiles_type[tile_y * asbx.current_area.data.tiles_x + tile_x] == asbx.TILETYPE_WALL)
	{
		this.body.speed_x = 0;
		this.body.pos_x = (asbx.TILESIZE_SIDE * tile_x + 1) + this.body.size_x * 0.5;
	}
	if (asbx.current_area.data.tiles_type[tile_y * asbx.current_area.data.tiles_x + tile_x] == asbx.TILETYPE_LADDER)
	{
		this.body.speed_x = 0;
	}

	// right
	var tile_x = Math.floor((this.body.pos_x + this.body.size_x * 0.49999995) / asbx.TILESIZE_SIDE);
	var tile_y = Math.floor((this.body.pos_y) / asbx.TILESIZE_SIDE);
	if (asbx.current_area.data.tiles_type[tile_y * asbx.current_area.data.tiles_x + tile_x] == asbx.TILETYPE_WALL)
	{
		this.body.speed_x = 0;
		this.body.pos_x = (asbx.TILESIZE_SIDE * tile_x + 0) - this.body.size_x * 0.5;
	}
	if (asbx.current_area.data.tiles_type[tile_y * asbx.current_area.data.tiles_x + tile_x] == asbx.TILETYPE_LADDER)
	{
		this.body.speed_x = 0;
	}

	// bottom
	var tile_x = Math.floor((this.body.pos_x) / asbx.TILESIZE_SIDE);
	var tile_y = Math.floor((this.body.pos_y - this.body.size_y * 0.49999995) / asbx.TILESIZE_SIDE);
	if (asbx.current_area.data.tiles_type[tile_y * asbx.current_area.data.tiles_x + tile_x] == asbx.TILETYPE_WALL)
	{
		this.body.speed_y = 0;
		this.body.pos_y = (asbx.TILESIZE_SIDE * tile_y + 1) + this.body.size_y * 0.5;
	}
	if (asbx.current_area.data.tiles_type[tile_y * asbx.current_area.data.tiles_x + tile_x] == asbx.TILETYPE_LADDER)
	{
		this.body.speed_y = 0;
	}

	// top
	var tile_x = Math.floor((this.body.pos_x) / asbx.TILESIZE_SIDE);
	var tile_y = Math.floor((this.body.pos_y + this.body.size_y * 0.49999995) / asbx.TILESIZE_SIDE);
	if (asbx.current_area.data.tiles_type[tile_y * asbx.current_area.data.tiles_x + tile_x] == asbx.TILETYPE_WALL)
	{
		if (this.body.speed_y > 0)
		{
			this.body.speed_y *= -0.05;
		}
		this.body.pos_y = (asbx.TILESIZE_SIDE * tile_y + 0) - this.body.size_y * 0.5;
	}
	if (asbx.current_area.data.tiles_type[tile_y * asbx.current_area.data.tiles_x + tile_x] == asbx.TILETYPE_LADDER)
	{
		this.body.speed_y = 0;
	}
	
	if (this.on_ladder)
	{
		this.body.speed_x = 0;
		this.body.speed_y = 0;
	}

	
	
	
	
	
	var speed_side  = .00018;
	var air_control = .00002;
	var jump = .001990;
	var ladder_x = .001950;
	var ladder_y = .000550;




	// new map
	if (asbx.input.KEY_N.pressed)
	{
		asbx.current_area.data = new asbx.AreaData_Side(64, 64);
	}



	// turn left
	if (asbx.input.KEY_Q.pressed)
	{
		this.playerBody.angularForce = 32.9;
	}
	// turn right
	if (asbx.input.KEY_E.pressed)
	{
		this.playerBody.angularForce = -32.9;
	}
	// move left
	if (asbx.input.KEY_A.pressed)
	{
		if (this.on_ladder)
		{
			this.body.speed_x -= ladder_x;
		}
		else
		{
			this.body.speed_x -= (this.on_ground ? speed_side : air_control) * time_delta;
		}
	}
	// move right
	if (asbx.input.KEY_D.pressed)
	{
		if (this.on_ladder)
		{
			this.body.speed_x += ladder_x;
		}
		else
		{
			this.body.speed_x += (this.on_ground ? speed_side : air_control) * time_delta;
		}
	}

	// move up
	if (asbx.input.KEY_W.pressed)
	{
		if (this.on_ladder)
		{
			this.body.speed_y += ladder_y * time_delta;
		}
	}
	
	// move down
	if (asbx.input.KEY_S.pressed)
	{
		if (this.on_ladder)
		{
			this.body.speed_y -= ladder_y * time_delta;
		}
	}
	
	this.jumping = false;
	// jump
	if (asbx.input.KEY_SPACE.pressed)
	{
		if (this.on_ground && asbx.now - this.last_jump >= 400)
		{
			this.jumping = true;
			this.last_jump = asbx.now;
			this.body.speed_y += jump * time_delta;
		}
		else if (asbx.now - this.last_jump <= 200)
		{
			this.jumping = true;
			this.body.speed_y += jump * 0.01 * time_delta;
		}
	}



	var tile_x = Math.floor((this.body.pos_x - this.body.size_x * 0.499995) / asbx.TILESIZE_SIDE);
	var tile2_x = Math.floor((this.body.pos_x + this.body.size_x * 0.499995) / asbx.TILESIZE_SIDE);
	var tile_y = Math.floor((this.body.pos_y - this.body.size_y * 0.5 - 0.00001) / asbx.TILESIZE_SIDE);

	var tile_ladder_y = Math.floor((this.body.pos_y - this.body.size_y * 0.4995) / asbx.TILESIZE_SIDE);

	this.tile_x = tile_x;
	this.tile2_x = tile2_x;
	this.tile_y = tile_y;

	if (	asbx.current_area.data.tiles_type[tile_y * asbx.current_area.data.tiles_x + tile_x] == asbx.TILETYPE_WALL
		||	asbx.current_area.data.tiles_type[tile_y * asbx.current_area.data.tiles_x + tile2_x] == asbx.TILETYPE_WALL)
	{
		this.on_ground = true;
	}
	else
	{
		this.on_ground = false;
	}
	
	if (
			asbx.current_area.data.tiles_type[tile_y * asbx.current_area.data.tiles_x + tile_x] == asbx.TILETYPE_LADDER
		||	asbx.current_area.data.tiles_type[tile_y * asbx.current_area.data.tiles_x + tile2_x] == asbx.TILETYPE_LADDER
		||	asbx.current_area.data.tiles_type[tile_ladder_y * asbx.current_area.data.tiles_x + tile_x] == asbx.TILETYPE_LADDER
		||	asbx.current_area.data.tiles_type[tile_ladder_y * asbx.current_area.data.tiles_x + tile2_x] == asbx.TILETYPE_LADDER)
	{
		this.on_ladder = true;
	}
	else
	{
		this.on_ladder = false;
	}
	
	this.body.pos_x += this.body.speed_x * time_delta;
	this.body.pos_y += this.body.speed_y * time_delta;
	
	var friction_x = Math.pow(0.95, time_delta);
	var friction_y = Math.pow(0.995, time_delta);
	
	
	if (this.on_ground || this.on_ladder)
	{
		this.body.speed_x *= friction_x;
	}
	else
	{
		this.body.speed_x *= friction_y;
	}
	
	
	
	if (!this.jumping && !this.on_ladder)
	{
		this.body.speed_y *= friction_y;
		if (!this.on_ground)
		{
			this.body.speed_y -= 0.000079 * time_delta;
		}
	}

}

asbx.Player.prototype.draw = function()
{
	asbx.c.rectangle_textured.draw(
		asbx.CAM_PLAYER,
		asbx.tex_tile_wall,
		this.body.pos_x,
		this.body.pos_y,
		this.body.size_x,
		this.body.size_y,
		90, //,this.playerBody.angle * (180 / Math.PI),
		this.on_ground ? 50 : 120, 1, 1.5, 1.0,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
	);
	
	if (this.on_ladder)
		{
		asbx.c.rectangle_textured.draw(
			asbx.CAM_PLAYER,
			asbx.tex_tile_wall,
			this.body.pos_x,
			this.body.pos_y,
			this.body.size_x * 1.2,
			this.body.size_y * 1.2,
			90,
			220, 1, 1.5, 0.3,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1
		);
		
	}
}

asbx.Player.prototype.__ = function()
{

}