
var inc = 0;

btx.NAVMESH_NODE_TYPE__BLOCK_CORNER 				= inc++;
btx.NAVMESH_NODE_TYPE__STREET_CROSSING 				= inc++;
btx.NAVMESH_NODE_TYPE__RANDOMLY_PLACED 				= inc++;
btx.NAVMESH_NODE_TYPE__HOUSE_DOOR	 				= inc++;
btx.NAVMESH_NODE_TYPE__ 				= inc++;


btx.Navmesh = function()
{
	this.nodes = [];

	this.nodes_processed = 0;
	this.nodeflows_processed = -1;
}

btx.Navmesh.prototype.add_nodes = function()
{

	for (var i = 0, len = btx.cityblocks.cityblocks.length; i < len; i++)
	{
		var block = btx.cityblocks.cityblocks[i];
		this.add_node(		btx.NAVMESH_NODE_TYPE__BLOCK_CORNER,
							block.pos_x - block.size_x * 0.5 + btx.street_width * 0.5 + btx.sidewalk_width * 0.5,
							block.pos_y - block.size_y * 0.5 + btx.street_width * 0.5 + btx.sidewalk_width * 0.5,
							-1);
		this.add_node(		btx.NAVMESH_NODE_TYPE__BLOCK_CORNER,
							block.pos_x + block.size_x * 0.5 - btx.street_width * 0.5 - btx.sidewalk_width * 0.5,
							block.pos_y - block.size_y * 0.5 + btx.street_width * 0.5 + btx.sidewalk_width * 0.5,
							-1);
		this.add_node(		btx.NAVMESH_NODE_TYPE__BLOCK_CORNER,
							block.pos_x - block.size_x * 0.5 + btx.street_width * 0.5 + btx.sidewalk_width * 0.5,
							block.pos_y + block.size_y * 0.5 - btx.street_width * 0.5 - btx.sidewalk_width * 0.5,
							-1);
		this.add_node(		btx.NAVMESH_NODE_TYPE__BLOCK_CORNER,
							block.pos_x + block.size_x * 0.5 - btx.street_width * 0.5 - btx.sidewalk_width * 0.5,
							block.pos_y + block.size_y * 0.5 - btx.street_width * 0.5 - btx.sidewalk_width * 0.5,
							-1);
	}
	for (var i = 0, len = btx.streets.street_crossings.length; i < len; i++)
	{
		var street_crossing = btx.streets.street_crossings[i];

		if (street_crossing.is_horizontal)
		{
			this.add_node(		btx.NAVMESH_NODE_TYPE__STREET_CROSSING,
								street_crossing.start_x - btx.sidewalk_width * 0.5,
								street_crossing.start_y,
								-1);
			this.add_node(		btx.NAVMESH_NODE_TYPE__STREET_CROSSING,
								street_crossing.end_x + btx.sidewalk_width * 0.5,
								street_crossing.end_y,
								-1);
		}
		else
		{
			this.add_node(		btx.NAVMESH_NODE_TYPE__STREET_CROSSING,
								street_crossing.start_x,
								street_crossing.start_y - btx.sidewalk_width * 0.5,
								-1);
			this.add_node(		btx.NAVMESH_NODE_TYPE__STREET_CROSSING,
								street_crossing.end_x,
								street_crossing.end_y + btx.sidewalk_width * 0.5,
								-1);
		}
	}
/*
	for (var i = 0, len = (btx.world_size_x * btx.world_size_y) * 0.5; i < len; i++)
	{
			this.add_node(		btx.NAVMESH_NODE_TYPE__RANDOMLY_PLACED,
								btx.street_width * 0.5 + µ.rand(btx.world_size_x - btx.street_width * 0.5),
								btx.street_width * 0.5 + µ.rand(btx.world_size_y - btx.street_width * 0.5),
								10);
	}
//*/

	console.log(this.nodes.length + ' navmesh nodes');
	return 1.0;
}

btx.Navmesh.prototype.add_node = function(type, pos_x, pos_y, min_neighbor_distance)
{
	if (	pos_x < btx.street_width * 0.5
		||	pos_x > btx.world_size_x - btx.street_width * 0.5
		||	pos_y < btx.street_width * 0.5
		||	pos_y > btx.world_size_y - btx.street_width * 0.5)
	{
		return - 1;
	}
	if (min_neighbor_distance != -1)
	{
		for (var i = 0, len = this.nodes.length; i < len; i++)
		{
			var dist = µ.distance2D(pos_x, pos_y, this.nodes[i].pos_x, this.nodes[i].pos_y);
			if (dist < min_neighbor_distance)
			{
				return - 1;
			}
		}
	}
	var tolerance = btx.person_radius;
	// am  I in any block, or on the street?
	for (var i = 0, len = btx.cityblocks.cityblocks.length; i < len; i++)
	{
		var block = btx.cityblocks.cityblocks[i];
		for (var j = 0, len2 = block.houses.length; j < len2; j++)
		{
			var house = block.houses[j];
			// within house
			if (
					pos_x > house.pos_x - house.size_x * 0.5 - tolerance
				&&	pos_x < house.pos_x + house.size_x * 0.5 + tolerance
				&&	pos_y > house.pos_y - house.size_y * 0.5 - tolerance
				&&	pos_y < house.pos_y + house.size_y * 0.5 + tolerance
				)
			{
				return - 1;
			}
		}

		if (
				pos_x > block.pos_x - block.size_x * 0.5
			&&	pos_x < block.pos_x + block.size_x * 0.5
			&&	pos_y > block.pos_y - block.size_y * 0.5
			&&	pos_y < block.pos_y + block.size_y * 0.5
			)
		{
			// on street
			if (
					pos_x < block.pos_x - block.size_x * 0.5 + btx.street_width * 0.5 + tolerance
				||	pos_x > block.pos_x + block.size_x * 0.5 - btx.street_width * 0.5 - tolerance
				||	pos_y > block.pos_y + block.size_y * 0.5 - btx.street_width * 0.5 - tolerance
				||	pos_y < block.pos_y - block.size_y * 0.5 + btx.street_width * 0.5 + tolerance
				)
			{
				return - 1;
			}
			else
			{
				break;
			}
		}
	}

	this.nodes.push(new btx.NavmeshNode(type, pos_x, pos_y));
	return (this.nodes.length - 1);
}

btx.Navmesh.prototype.make_connections = function()
{
	var nodes_to_do = Math.min(10, this.nodes.length - this.nodes_processed);
	for (var m = 0; m < nodes_to_do; m++)
	//for (var i = 0, len = this.nodes.length; i < len; i++)
	{
		var i = this.nodes_processed + m;
		var node = this.nodes[i];
		for (var j = 0, len2 = this.nodes.length; j < len2; j++)
		{
			if (i != j && !btx.skip_navmesh)
			{
				var node2 = this.nodes[j];
				// test a few points in between
				var biggest_dist = Math.max(Math.abs(node.pos_x - node2.pos_x), Math.abs(node.pos_y - node2.pos_y));
				if (biggest_dist < 40)
				{
					var clash_found = false;
					steps = 5 + Math.round(0.25 * biggest_dist);

					for (var n = 0; n <= steps && !clash_found; n++)
					{
						var frac = n / steps;
						var frac1 = 1 - frac;
						var pos_x = node.pos_x * frac + node2.pos_x * frac1;
						var pos_y = node.pos_y * frac + node2.pos_y * frac1;
						var tolerance = btx.person_radius * 0.02;
						var on_sidewalk = false;
						// on sidewalk?
						for (var k = 0, len3 = btx.streets.street_crossings.length; k < len3; k++)
						{
							var street_crossing = btx.streets.street_crossings[k];
							if (street_crossing.is_horizontal)
							{
								if (	pos_x > street_crossing.start_x - tolerance
									&& 	pos_x < street_crossing.end_x + tolerance
									&& 	pos_y > street_crossing.start_y - tolerance
									&&	pos_y < street_crossing.start_y + tolerance
									)
								{
									on_sidewalk = true;
									break;
								}
							}
							else
							{
								if (	pos_y > street_crossing.start_y - tolerance
									&& 	pos_y < street_crossing.end_y + tolerance
									&& 	pos_x > street_crossing.start_x - tolerance
									&&	pos_x < street_crossing.start_x + tolerance
									)
								{
									on_sidewalk = true;
									break;
								}
							}
						}
						// am  I in any block, or on the street?
						for (var k = 0, len3 = btx.cityblocks.cityblocks.length; k < len3 && !clash_found; k++)
						{
							var block = btx.cityblocks.cityblocks[k];
							for (var l = 0, len4 = block.houses.length; l < len4 && !clash_found; l++)
							{
								var house = block.houses[l];
								// within house
								if (
										pos_x > house.pos_x - house.size_x * 0.5 - tolerance
									&&	pos_x < house.pos_x + house.size_x * 0.5 + tolerance
									&&	pos_y > house.pos_y - house.size_y * 0.5 - tolerance
									&&	pos_y < house.pos_y + house.size_y * 0.5 + tolerance
									)
								{
									clash_found = true;
								}
							}

							if (
										pos_x > block.pos_x - block.size_x * 0.5
								&&	pos_x < block.pos_x + block.size_x * 0.5
								&&	pos_y > block.pos_y - block.size_y * 0.5
								&&	pos_y < block.pos_y + block.size_y * 0.5
								)
							{
								// on street
								if (	!on_sidewalk
									&&	(
											pos_x < block.pos_x - block.size_x * 0.5 + btx.street_width * 0.5 + tolerance
										||	pos_x > block.pos_x + block.size_x * 0.5 - btx.street_width * 0.5 - tolerance
										||	pos_y > block.pos_y + block.size_y * 0.5 - btx.street_width * 0.5 - tolerance
										||	pos_y < block.pos_y - block.size_y * 0.5 + btx.street_width * 0.5 + tolerance
										)
									)
								{
									clash_found = true;
								}
								else
								{
									break;
								}
							}
						}

					}
					if (!clash_found)
					{
						node.connected_to.push(j);
					}
				}

			}
		}
		//console.log(node.connected_to);
	}
	this.nodes_processed += nodes_to_do;
	return (this.nodes_processed / this.nodes.length);
}

btx.Navmesh.prototype.nodeflow_recurse = function(source_node_id, current_node_id, distance_so_far)
{
	if (btx.skip_navmesh)
	{
		return;
	}
	
	var node = this.nodes[current_node_id];
	var	nodeflow = this.nodeflows[source_node_id];
	for (var i = 0, len = node.connected_to.length; i < len; i++)
	{
		// faster, and leads to fucking awful routes like it should
		//if (nodeflow[node.connected_to[i]] == -1)
		{
			var node2 = this.nodes[node.connected_to[i]];
			var dist = µ.distance2D(node.pos_x, node.pos_y, node2.pos_x, node2.pos_y);
			if (nodeflow[node.connected_to[i]] == -1 || nodeflow[node.connected_to[i]] > distance_so_far + dist)
			{
				nodeflow[node.connected_to[i]] = distance_so_far + dist;
				this.nodeflow_recurse(source_node_id, node.connected_to[i], distance_so_far + dist);
			}
		}
	}
}

btx.Navmesh.prototype.make_nodeflows = function()
{

	if (this.nodeflows_processed == -1)
	{
		this.nodeflows = new Array(this.nodes.length);
		this.nodeflows_processed = 0;
	}

	var nodeflows_to_do = Math.min(2, this.nodeflows.length - this.nodeflows_processed);

	for (var m = 0; m < nodeflows_to_do; m++)
	//for (var i = 0, len = this.nodes.length; i < len; i++)
	{

		var i = this.nodeflows_processed + m;

		var node = this.nodes[i];
		this.nodeflows[i] = new Float32Array(this.nodes.length);
		var	nodeflow = this.nodeflows[i];

		for (var j = 0, len2 = this.nodes.length; j < len2; j++)
		{
			nodeflow[j] = -1;
		}
		// distance to self
		nodeflow[i] = 0;
		if (btx.skip_navmesh)
		{
			continue;
		}
		for (var j = 0, len2 = node.connected_to.length; j < len2; j++)
		{
			var node2 = this.nodes[node.connected_to[j]];
			var dist = µ.distance2D(node.pos_x, node.pos_y, node2.pos_x, node2.pos_y);
			nodeflow[node.connected_to[j]] = dist;
			this.nodeflow_recurse(i, node.connected_to[j], dist);
		}
	}


	this.nodeflows_processed += nodeflows_to_do;
	return (this.nodeflows_processed / this.nodeflows.length);

}

btx.Navmesh.prototype.draw = function()
{
	if (btx.options_debug_values[btx.DEBUG_OPTION__SHOW_NAVMESH_NODES])
	{
		for (var i = 0, len = this.nodes.length; i < len; i++)
		{
			var node = this.nodes[i];
			var hue = 10;
			if (node.type == btx.NAVMESH_NODE_TYPE__BLOCK_CORNER)
			{
				var hue = 180;
			}
			if (node.type == btx.NAVMESH_NODE_TYPE__STREET_CROSSING)
			{
				var hue = 200;
			}
			btx.c.rectangle_textured.draw(
				btx.CAM_PLAYER,
				btx.tex_circle,
				node.pos_x,
				node.pos_y,
				0.3,
				0.3,
				90,
				hue, 1, 0.5, 0.5, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);

			if (btx.options_debug_values[btx.DEBUG_OPTION__SHOW_CONNECTIONS_BETWEEN_NAVMESH_NODES])
			{
				for (var j = 0, len2 = node.connected_to.length; j < len2; j++)
				{
					var node2 = this.nodes[node.connected_to[j]];
					btx.c.rectangle_textured.draw_line(btx.CAM_PLAYER,
						btx.tex_noise,
						node.pos_x,
						node.pos_y,
						node2.pos_x,
						node2.pos_y,
						0.25,
						0, 0, 0.9, 0.3,
						-1, -1, -1, -1,
						-1, -1, -1, -1,
						-1, -1, -1, -1);
				}
			}
		}
	}
	btx.c.flush_all();
}

btx.Navmesh.prototype._ = function()
{
}

btx.NavmeshNode = function(type, pos_x, pos_y)
{
	this.type = type;
	this.pos_x = pos_x;
	this.pos_y = pos_y;
	this.connected_to = [];
}

btx.NavmeshNode.prototype._ = function()
{
}


