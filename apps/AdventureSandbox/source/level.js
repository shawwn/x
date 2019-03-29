asbx.Level = function(size_x, size_y, grid_size_x, grid_size_y)
{

	this.grid_tile_count = grid_size_x * grid_size_y;
	this.grid_cells = new Array(this.grid_tile_count);

	if (type == asbx.AREATYPE_TOP)
	{
		this.data = new asbx.AreaData_Top(size_x, size_y);
	}
	else if (type == asbx.AREATYPE_SIDE)
	{
		this.data = new asbx.AreaData_Side(size_x, size_y);
	}
}


asbx.Area.prototype.draw = function()
{
	this.data.draw();
}

asbx.Area.prototype.switch_view_to_here = function()
{
	this.data.switch_view_to_here();
}

asbx.Area.prototype.generate_physics = function()
{
	this.data.generate_physics();
}

asbx.Area.prototype.spawn_body = function(body)
{
	console.log(body);
	
	this.data.spawn_body(body);
}




var inc = 0;
asbx.TILETYPE_UNDEFINED			= inc++;
asbx.TILETYPE_AIR				= inc++;
asbx.TILETYPE_WALL				= inc++;
asbx.TILETYPE_ENTRANCE			= inc++;
asbx.TILETYPE_LADDER 			= inc++;

asbx.TILETYPE_WATER		= inc++;


asbx.TILETYPE_			= inc++;


asbx.CHARCODE_AIR 	 = '.'.charCodeAt(0);
asbx.CHARCODE_WALL	 = '#'.charCodeAt(0);
asbx.CHARCODE_LADDER = '='.charCodeAt(0);
asbx.CHARCODE_MAYBE  = '+'.charCodeAt(0);

/*

	#	35
	.	46

*/

asbx.side_dead_ends =
[

	[
		'###',
		'..#',
		'###',
	],
	[
		'###',
		'#..',
		'###',
	],


]


asbx.side_rooms =
[



	{
		weight:		1,
		max_count:	-1,
		tiles:		[
			'#+##',
			'....',
			'##+#',
		],
	},

	{
		weight:		1,
		max_count:	-1,
		tiles:		[
			'#+##',
			'+...',
			'##.#',
		],
	},


	{
		weight:		1,
		max_count:	-1,
		tiles:		[
			'#.##',
			'+...',
			'##+#',
		],
	},




	{
		weight:		.1,
		max_count:	-1,
		tiles:		[
			'#++++++#',
			'+......+',
			'..++++..',
			'#+####+#',
		],
	},



	{
		weight:		1,
		max_count:	-1,
		tiles:		[
			'#.#+#',
			'+...+',
			'##+.#',
			'+...+',
			'#.#+#',
		],
	},





	{
		weight:		1,
		max_count:	-1,
		tiles:		[
			'#+##',
			'+..+',
			'....',
			'##+#',
		],
	},



	{
		weight:		1,
		max_count:	-1,
		tiles:		[
			'#+##',
			'+.++',
			'+...',
			'##.#',
		],
	},


	{
		weight:		1,
		max_count:	-1,
		tiles:		[
			'#.##',
			'+.++',
			'+...',
			'##+#',
		],
	},






	{
		weight:		1,
		max_count:	-1,
		tiles:		[
			'##+##',
			'+...+',
			'..#..',
			'###+#',
		],
	},



	{
		weight:		1,
		max_count:	-1,
		tiles:		[
			'##+##',
			'+...+',
			'+.#..',
			'###.#',
		],
	},


	{
		weight:		1,
		max_count:	-1,
		tiles:		[
			'##.##',
			'+...+',
			'+.#..',
			'###+#',
		],
	},


/*



*/

/*


	[
		'###',
		'...',
		'###',
	],

	[
		'#.#',
		'..#',
		'###',
	],

	[
		'###',
		'..#',
		'#.#',
	],

	[
		'###',
		'#..',
		'#.#',
	],


	[
		'#.#',
		'..#',
		'###',
	],

	[
		'#.#',
		'#..',
		'###',
	],

	[
		'###',
		'#..',
		'#.#',
	],
	[
		'###',
		'..#',
		'#.#',
	],


*/

/*

	[
		'####',
		'####',
		'####',
	],

	[
		'####',
		'####',
		'####',
		'####',
	],
	[
		'#####',
		'#####',
		'#####',
		'#####',
		'#####',
	],
	[
		'######',
		'######',
		'######',
		'######',
		'######',
		'######',
	],
	[
		'########',
		'########',
		'########',
		'########',
		'########',
		'########',
		'########',
		'########',
	],

*/

];

asbx.AreaData_Side = function(tiles_x, tiles_y)
{

	this.room_counter = 0;

	this.tiles_placed = 0;

	this.tiles_total = tiles_x * tiles_y;

	this.tiles_x = tiles_x;
	this.tiles_y = tiles_y;

	this.size_x = tiles_x * asbx.TILESIZE_SIDE;
	this.size_y = tiles_y * asbx.TILESIZE_SIDE;

	//this.__ = new Float32Array(tiles_total);

	this.tiles_type = new Uint8Array(this.tiles_total);
	this.tiles_room = new Uint8Array(this.tiles_total);

	for (var i = 0; i < this.tiles_total; i++)
	{
		this.tiles_type[i] = asbx.TILETYPE_UNDEFINED;
	}

	this.generate();
	this.switch_view_to_here();

}

asbx.AreaData_Side.prototype.switch_view_to_here = function()
{

	asbx.camera_player.set_size(this.size_x, this.size_y);
	asbx.desired_zoom = asbx.DEFAULT_ZOOM_SIDE;
	asbx.camera_player.set_zoom(asbx.DEFAULT_ZOOM_SIDE);
	asbx.camera_player.set_pos(0, 0);
}

asbx.AreaData_Side.prototype.generate_physics = function()
{
	// for now
	//return;

	var bodies_made = 0;

	this.wallMaterial = new p2.Material();

	for (var x = 0; x < this.tiles_x; x++)
	{
		for (var y = 0; y < this.tiles_y; y++)
		{
			if (this.tiles_type[y * this.tiles_x + x] == asbx.TILETYPE_WALL)
			{
				var pos_x = x * asbx.TILESIZE_SIDE + asbx.TILESIZE_SIDE_HALF;
				var pos_y = y * asbx.TILESIZE_SIDE + asbx.TILESIZE_SIDE_HALF;

				// Create an empty dynamic body
				var tileBody = new p2.Body({
					allowSleep: true,
					mass: 0,	// static
					position: [pos_x, pos_y]
				});

				// add shape to body
				tileBody.addShape(new p2.Box({ height: asbx.TILESIZE_SIDE, width: asbx.TILESIZE_SIDE }));

				tileBody.material = this.wallMaterial;

				// add body to world
				this.physics_world.addBody(tileBody);

				bodies_made++;
			}
		}
	}

    frictionContactMaterial = new p2.ContactMaterial(this.wallMaterial, asbx.player.playerBody.material, {
        friction : 0.1,
        restitution: 0.75,
        contactSkinSize: 0.1,
    });

    this.physics_world.addContactMaterial(frictionContactMaterial);


	console.log(bodies_made + ' static bodies added to world');
}


asbx.AreaData_Side.prototype.spawn_body = function(body)
{
	this.physics_world.addBody(body);
}

// some information about the next area is generated before actually generating the area
asbx.AreaData_Side.prototype.generate_door = function(seed)
{
	// type and subtype of area

}

asbx.AreaData_Side.prototype.try_platform = function()
{
	var x = 2 + µ.rand_int(this.tiles_x - 3); // leave some space for plumetting
	var y = 2 + µ.rand_int(this.tiles_y - 3);

	var length = 2 + Math.min(2, µ.rand_int(this.tiles_x - x));

	// check for nearby platforms
	for (var j = -2; j < (length + 2); j++)
	{
		if (	this.tiles_type[ (y + 1) * this.tiles_x + x + j] == asbx.TILETYPE_WALL
			||	this.tiles_type[ (y - 1) * this.tiles_x + x + j] == asbx.TILETYPE_WALL)
		{
			return false;
		}
	}

	for (var j = 0; j < length; j++)
	{
		this.tiles_type[y * this.tiles_x + x + j] = asbx.TILETYPE_WALL;
	}
	return true;
}


asbx.AreaData_Side.prototype.try_room = function(force)
{
	var room_id = µ.rand_int(asbx.side_rooms.length - 1);

	var room_id = µ.pick_randomly_from_weighted_list(asbx.side_rooms, function(item, index, data) {
		return item.weight;
	}, null)

	var room = []
	
	if (µ.rand_int(1))
	{
		for (var i = 0; i < asbx.side_rooms[room_id].tiles.length; i++)
		{
			room[i] = '';
			var line = asbx.side_rooms[room_id].tiles[i];
			for (var j = 0; j < asbx.side_rooms[room_id].tiles[i].length; j++)
			{
				room[i] += line[j] != '+' ? line[j] : (µ.rand_int(1) ? '#' : '.');
			}
		}
	}
	else
	{
		for (var i = 0; i < asbx.side_rooms[room_id].tiles.length; i++)
		{
			room[i] = '';
			var line = asbx.side_rooms[room_id].tiles[i];
			for (var j = asbx.side_rooms[room_id].tiles[i].length - 1; j >= 0; j--)
			{
				room[i] += line[j] != '+' ? line[j] : (µ.rand_int(1) ? '#' : '.');
			}
		}
	}
	
	

	var size_x = room[0].length;
	var size_y = room.length;

	var temp = room[0];

//	console.log(room[0], temp.charCodeAt(0));

//	return;

	var valid_pos_x = [];
	var valid_pos_y = [];

	var match_thickness = 1;

	for (var x = 1; x < this.tiles_x - size_x - 1; x++)
	{
		for (var y = 1; y < this.tiles_y - size_y - 1; y++)
		{
			
			var inner_conflict = false;
			for (var room_x = match_thickness2; room_x < (size_x - match_thickness2) && !inner_conflict; room_x++)
			{
				for (var room_y = match_thickness2; room_y < (size_y - match_thickness2) && !inner_conflict; room_y++)
				{
					var tile_present = this.tiles_type[ (y + room_y) * this.tiles_x + x + room_x];
					if (tile_present != asbx.TILETYPE_UNDEFINED)
					{
						inner_conflict = true;
					}
				}
			}
			
			if (inner_conflict)
			{
				continue;
			}



			var matches = 0;
			var clashes = 0;

			// bottom
			var match = true;
			var clash = false;
			var air_match = false;
			for (t = 0; t < match_thickness; t++)
			{
				var room_y = 0 + t;
				for (var room_x = 0; room_x < size_x; room_x++)
				{
					var tile_present = this.tiles_type[ (y + room_y) * this.tiles_x + x + room_x];
					if	((tile_present == asbx.TILETYPE_WALL && room[size_y - 1 -room_y].charCodeAt(room_x) != asbx.CHARCODE_WALL)
						||	(tile_present == asbx.TILETYPE_AIR && room[size_y - 1 -room_y].charCodeAt(room_x) != asbx.CHARCODE_AIR)
						||	(tile_present == asbx.TILETYPE_LADDER && room[size_y - 1 -room_y].charCodeAt(room_x) != asbx.CHARCODE_LADDER))
					{
						clash = true;
					}
					if (tile_present == asbx.TILETYPE_UNDEFINED)
					{
						match = false;
					}
					if (	(tile_present == asbx.TILETYPE_AIR && room[size_y - 1 -room_y].charCodeAt(room_x) == asbx.CHARCODE_AIR)
						||	(tile_present == asbx.TILETYPE_LADDER && room[size_y - 1 -room_y].charCodeAt(room_x) == asbx.CHARCODE_LADDER))
					{
						air_match = true;
					}
				}
			}
			if (clash) continue;
			if (match && air_match) matches++;
			if (clash) clashes++;

			// top
			var match = true;
			var clash = false;
			var air_match = false;
			for (t = 0; t < match_thickness; t++)
			{
				var room_y = size_y - 1 - t;
				for (var room_x = 0; room_x < size_x; room_x++)
				{
					var tile_present = this.tiles_type[ (y + room_y) * this.tiles_x + x + room_x];
					if	((tile_present == asbx.TILETYPE_WALL && room[size_y - 1 -room_y].charCodeAt(room_x) != asbx.CHARCODE_WALL)
						||	(tile_present == asbx.TILETYPE_AIR && room[size_y - 1 -room_y].charCodeAt(room_x) != asbx.CHARCODE_AIR)
						||	(tile_present == asbx.TILETYPE_LADDER && room[size_y - 1 -room_y].charCodeAt(room_x) != asbx.CHARCODE_LADDER))
					{
						clash = true;
					}
					if (tile_present == asbx.TILETYPE_UNDEFINED)
					{
						match = false;
					}
					if (tile_present == asbx.TILETYPE_AIR && room[size_y - 1 -room_y].charCodeAt(room_x) == asbx.CHARCODE_AIR)
					{
						air_match = true;
					}
				}
			}
			if (clash) continue;
			if (match && air_match) matches++;
			if (clash) clashes++;

			// left
			var match = true;
			var clash = false;
			var air_match = false;
			for (t = 0; t < match_thickness; t++)
			{
				var room_x = 0 + t;
				for (var room_y = 0; room_y < size_y; room_y++)
				{
					var tile_present = this.tiles_type[ (y + room_y) * this.tiles_x + x + room_x];
					if	((tile_present == asbx.TILETYPE_WALL && room[size_y - 1 -room_y].charCodeAt(room_x) != asbx.CHARCODE_WALL)
						||	(tile_present == asbx.TILETYPE_AIR && room[size_y - 1 -room_y].charCodeAt(room_x) != asbx.CHARCODE_AIR)
						||	(tile_present == asbx.TILETYPE_LADDER && room[size_y - 1 -room_y].charCodeAt(room_x) != asbx.CHARCODE_LADDER))
					{
						clash = true;
					}
					if (tile_present == asbx.TILETYPE_UNDEFINED)
					{
						match = false;
					}
					if (	(tile_present == asbx.TILETYPE_AIR && room[size_y - 1 -room_y].charCodeAt(room_x) == asbx.CHARCODE_AIR)
						||	(tile_present == asbx.TILETYPE_LADDER && room[size_y - 1 -room_y].charCodeAt(room_x) == asbx.CHARCODE_LADDER))
					{
						air_match = true;
					}
				}
			}
			if (clash) continue;
			if (match && air_match) matches++;
			if (clash) clashes++;

			// right
			var match = true;
			var clash = false;
			var air_match = false;
			for (t = 0; t < match_thickness; t++)
			{
				var room_x = size_x - 1 - t;
				for (var room_y = 0; room_y < size_y; room_y++)
				{
					var tile_present = this.tiles_type[ (y + room_y) * this.tiles_x + x + room_x];
					if	((tile_present == asbx.TILETYPE_WALL && room[size_y - 1 -room_y].charCodeAt(room_x) != asbx.CHARCODE_WALL)
						||	(tile_present == asbx.TILETYPE_AIR && room[size_y - 1 -room_y].charCodeAt(room_x) != asbx.CHARCODE_AIR)
						||	(tile_present == asbx.TILETYPE_LADDER && room[size_y - 1 -room_y].charCodeAt(room_x) != asbx.CHARCODE_LADDER))
					{
						clash = true;
					}
					if (tile_present == asbx.TILETYPE_UNDEFINED)
					{
						match = false;
					}
					if (	(tile_present == asbx.TILETYPE_AIR && room[size_y - 1 -room_y].charCodeAt(room_x) == asbx.CHARCODE_AIR)
						||	(tile_present == asbx.TILETYPE_LADDER && room[size_y - 1 -room_y].charCodeAt(room_x) == asbx.CHARCODE_LADDER))
					{
						air_match = true;
					}
				}
			}
			if (clash) continue;
			if (match && air_match) matches++;
			if (clash) clashes++;

			

			var match_thickness2 = 1;


			//if (force || (!inner_conflict && (bottom_match && top_match) && (right_match && left_match)))
			if (force || (!inner_conflict && matches >= 1 && clashes == 0))
			//if (force || (!inner_conflict && matches >= 2))
			//if (!inner_conflict && matches >= 2 & bottom_match && right_match && left_match)
			//if (!inner_conflict && (bottom_match || top_match) && (right_match || left_match))
			//if (!inner_conflict && matches >= 1 && (right_match || left_match || top_match || bottom_match))
			{
				valid_pos_x.push(x);
				valid_pos_y.push(y);
			}
		}
	}

	if (valid_pos_x.length > 0)
	{
		var selected = µ.rand_int(valid_pos_x.length - 1);
		var x = valid_pos_x[selected];
		var y = valid_pos_y[selected];

		this.room_counter++;

		for (var room_x = 0; room_x < size_x; room_x++)
		{
			for (var room_y = 0; room_y < size_y; room_y++)
			{
				this.tiles_room[ (y + room_y) * this.tiles_x + x + room_x] = this.room_counter;
				if (room[size_y - 1 - room_y].charCodeAt(room_x) == asbx.CHARCODE_WALL)
				{
					this.tiles_type[ (y + room_y) * this.tiles_x + x + room_x] = asbx.TILETYPE_WALL;
				}
				if (room[size_y - 1 - room_y].charCodeAt(room_x) == asbx.CHARCODE_AIR)
				{
					this.tiles_type[ (y + room_y) * this.tiles_x + x + room_x] = asbx.TILETYPE_AIR;
				}
				if (room[size_y - 1 - room_y].charCodeAt(room_x) == asbx.CHARCODE_LADDER)
				{
					this.tiles_type[ (y + room_y) * this.tiles_x + x + room_x] = asbx.TILETYPE_LADDER;
				}
			}
		}
		
		this.tiles_placed += (size_x - 2) * (size_y - 2);
	}
}


asbx.AreaData_Side.prototype.place_features = function()
{
	var success = false;
	var attempts = 0;
	while (!success && attempts < 100)
	{
		attempts++;
		var tile_x = 2 + µ.rand_int(this.tiles_x - 3);
		var tile_y = 2 + µ.rand_int(this.tiles_y - 3);

		if (	this.tiles_type[ (tile_y + 0) * this.tiles_x + tile_x] == asbx.TILETYPE_AIR
			&&	this.tiles_type[ (tile_y - 1) * this.tiles_x + tile_x] == asbx.TILETYPE_WALL
			)
		{
			success = true;
			this.tiles_type[ (tile_y + 0) * this.tiles_x + tile_x] = asbx.TILETYPE_ENTRANCE;
		}
	}
}


asbx.AreaData_Side.prototype.generate = function(seed)
{



	// seed RNG

	// place exits

	for (var x = 0; x < this.tiles_x; x++)
	{
		var y = 0;
		this.tiles_type[y * this.tiles_x + x] = asbx.TILETYPE_WALL;
		var y = this.tiles_y - 1;
		this.tiles_type[y * this.tiles_x + x] = asbx.TILETYPE_WALL;
	}
	for (var y = 0; y < this.tiles_y; y++)
	{
		var x = 0;
		this.tiles_type[y * this.tiles_x + x] = asbx.TILETYPE_WALL;
		var x = this.tiles_x - 1;
		this.tiles_type[y * this.tiles_x + x] = asbx.TILETYPE_WALL;
	}

	this.try_room(true);

	for (var i = 0; i < 500 && this.tiles_placed < 500; i++)
	{
		this.try_room(false);
	}
/*

	for (var i = 0; i < 0; i++)
	{
		if (this.try_platform() == false)
		{
			i--;
		}
	}
*/

	for (var x = 0; x < this.tiles_x; x++)
	{
		for (var y = 0; y < this.tiles_y; y++)
		{
			if (this.tiles_type[y * this.tiles_x + x] == asbx.TILETYPE_UNDEFINED)
			{
				this.tiles_room[y * this.tiles_x + x] = 99;
				this.tiles_type[y * this.tiles_x + x] = asbx.TILETYPE_WALL;
			}
		}
	}


	this.place_features();
}

asbx.AreaData_Side.prototype.draw = function()
{
	this.draw_background_gradient();
	this.draw_tiles();
}

asbx.AreaData_Side.prototype.draw_background_gradient = function()
{
	var hue = 205;
	var sat = 0.7;

	var lum_top_left 		= 0.05;
	var lum_top_right 		= 0.05;
	var lum_mid_left 		= 0.15;
	var lum_mid_right 		= 0.15;
	var lum_bottom_left 	= 0.2;
	var lum_bottom_right 	= 0.2;
	asbx.c.rectangle.draw(asbx.CAM_PLAYER,
		this.size_x * 0.5,
		this.size_y * 0.25,
		this.size_x,
		this.size_y * 0.5,
		90,
		hue, sat, lum_bottom_right, 1,
		hue, sat, lum_bottom_left, 1,
		hue, sat, lum_mid_left, 1,
		hue, sat, lum_mid_right, 1
	);
	asbx.c.rectangle.draw(asbx.CAM_PLAYER,
		this.size_x * 0.5,
		this.size_y * 0.75,
		this.size_x,
		this.size_y * 0.5,
		90,
		hue, sat, lum_mid_right, 1,
		hue, sat, lum_mid_left, 1,
		hue, sat, lum_top_left, 1,
		hue, sat, lum_top_right, 1
	);
}

asbx.AreaData_Side.prototype.draw_tiles = function()
{
	for (var x = 0; x < this.tiles_x; x++)
	{
		for (var y = 0; y < this.tiles_y; y++)
		{
			var alpha = this.tiles_room[y * this.tiles_x + x] == 99 ? 0.99 : 1.0;

			var pos_x = x * asbx.TILESIZE_SIDE + asbx.TILESIZE_SIDE_HALF;
			var pos_y = y * asbx.TILESIZE_SIDE + asbx.TILESIZE_SIDE_HALF;
			if (this.tiles_type[y * this.tiles_x + x] == asbx.TILETYPE_WALL)
			{
				asbx.c.rectangle_textured.draw(asbx.CAM_PLAYER,
					asbx.tex_tile_wall,
					pos_x,
					pos_y,
					asbx.TILESIZE_SIDE,
					asbx.TILESIZE_SIDE,
					90,
					0, 0, 1.0, 1.0 * alpha,
					-1, -1, -1, -1,
					-1, -1, -1, -1,
					-1, -1, -1, -1
				);
			}
			else if (this.tiles_type[y * this.tiles_x + x] == asbx.TILETYPE_ENTRANCE)
			{
				asbx.c.rectangle_textured.draw(asbx.CAM_PLAYER,
					asbx.tex_tile_wall,
					pos_x,
					pos_y,
					asbx.TILESIZE_SIDE,
					asbx.TILESIZE_SIDE,
					90,
					221, 1.5, 2.0, 1.0 * alpha,
					-1, -1, -1, -1,
					-1, -1, -1, -1,
					-1, -1, -1, -1
				);
			}
			else if (this.tiles_type[y * this.tiles_x + x] == asbx.TILETYPE_LADDER)
			{
				asbx.c.rectangle_textured.draw(asbx.CAM_PLAYER,
					asbx.tex_tile_wall,
					pos_x,
					pos_y,
					asbx.TILESIZE_SIDE,
					asbx.TILESIZE_SIDE,
					90,
					21, 1.1, 0.4, 1.0,
					-1, -1, -1, -1,
					-1, -1, -1, -1,
					-1, -1, -1, -1
				);
			}
/*
			asbx.fonts.draw_text(
				"" + this.tiles_room[y * this.tiles_x + x], 1,
				asbx.CAM_PLAYER, asbx.font_name,
				pos_x - asbx.TILESIZE_SIDE / 4, pos_y,
				asbx.TILESIZE_SIDE / 1.75, asbx.TILESIZE_SIDE / 1.75, asbx.TILESIZE_SIDE * 0.075,
				30 * this.tiles_room[y * this.tiles_x + x],
				1, 0.5, 1.0 * alpha * asbx.camera_stretch.mouse_pos_x,
				-1, -1, -1, -1,
				-1, -1, -1, -1,
				-1, -1, -1, -1
				);
*/

		}
	}


	asbx.c.rectangle_textured.draw(asbx.CAM_PLAYER,
		asbx.tex_tile_wall,
		asbx.player.tile_x * asbx.TILESIZE_SIDE + asbx.TILESIZE_SIDE_HALF,
		asbx.player.tile_y * asbx.TILESIZE_SIDE + asbx.TILESIZE_SIDE_HALF,
		asbx.TILESIZE_SIDE,
		asbx.TILESIZE_SIDE,
		90,
		320, 1, 1.0, 0.3,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
	);
	

	asbx.c.rectangle_textured.draw(asbx.CAM_PLAYER,
		asbx.tex_tile_wall,
		asbx.player.tile2_x * asbx.TILESIZE_SIDE + asbx.TILESIZE_SIDE_HALF,
		asbx.player.tile_y * asbx.TILESIZE_SIDE + asbx.TILESIZE_SIDE_HALF,
		asbx.TILESIZE_SIDE,
		asbx.TILESIZE_SIDE,
		90,
		320, 1, 1.0, 0.3,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
	);
	




	//asbx.fonts.flush_all();
}



asbx.AreaData_Side.prototype.__ = function()
{

}