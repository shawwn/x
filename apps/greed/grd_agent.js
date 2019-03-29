grd.AgentLimb = function (pos_x, pos_y, position, radius, density, friction, restitution, connected_to)
{
	this.pos_x = pos_x;
	this.pos_y = pos_y;
	this.radius = radius;
	this.density = density;
	this.friction = friction
	this.restitution = restitution;
	this.joint = null;
	this.connected_to = connected_to;
	this.connected_limbs = 0;
	if (connected_to != null)
	{
		connected_to.connected_limbs++;
		//this.torque_freq = 100 + µ.rand(900);
		
		this.torque_freq = 4000;
		this.torque_freq_offset = 0;//µ.rand(200000);

		this.torque_force = 1.5 + 5.45 * (1-position);//µ.rand(50);
		if (µ.rand(1) > 0.5)
		{
			//this.torque_force *= -1;
		}

		this.torque_offset1 = 0;//µ.rand(2);
		if (µ.rand(1) > 0.5)
		{
			//this.torque_offset1 *= -1;
		}
		
		//this.torque_offset1 = 0;

		this.torque_offset2 = 0;//µ.rand(1);
		if (µ.rand(1) > 0.5)
		{
			//this.torque_offset2 *= -1;
		}
		
		//this.torque_offset2 = 0;

		this.torque_factor1 = 1//;µ.rand(3);
		this.torque_factor2 = 4//;µ.rand(3);

		this.torque_freedom = 0.05 +  2.75 * position; //;µ.rand(1);

	}
	else
	{
		this.torque_freq = 0;
		this.torque_force = 0;
		this.torque_offset = 0;
	}
	this.body = null;
};


grd.Agent = function ()
{
	this.reset();
};

grd.Agent.prototype.next_generation = function ()
{
	this.scores = [];
}
grd.Agent.prototype.next_run = function ()
{
	this.scores.push(this.average_distance);
	this.now = 0;

	this.total_distance = 0;
	this.average_distance = 0;
	this.max_distance = -999;
}

grd.Agent.prototype.reset = function ()
{
	this.now = 0;

	this.ticks_elapsed = 0;
	this.last_score = 0;
	this.current_distance = 0;
	this.max_distance = 0;
	this.total_distance = 0;
	this.average_distance = 0;
	
	this.scores = [];

	this.limbs = Array();
	var first_limb = this.add_limb(null, grd.EVO__AGENT_BODY_RADIUS, 0);
	var directions = 1;// + µ.rand_int(8);
	var max_limbs = 50;
	var number_of_limbs = 0;

	for (var j = 0; j < directions; j++)
	{
		var angle = 360/directions * j;
		var previous_limb = first_limb;
		var l = 31;// + µ.rand_int(7); // µ.rand_int((max_limbs - number_of_limbs));
		var last_radius = grd.EVO__AGENT_LIMB_RADIUS;
		for (var i = 0; i < l; i++)
		{
			number_of_limbs++;
			previous_limb = this.add_limb(previous_limb, last_radius, angle, i / (l-1));
			last_radius *= grd.EVO__AGENT_LIMB_RADIUS_FACTOR2;
		}
	}
};

grd.Agent.prototype.add_limb = function (previous_limb, radius, angle, position)
{
	var friction = 0.95;
	var restitution = 1;
	if (previous_limb != null)
	{
		var pos_x = previous_limb.pos_x + µ.angle_to_x(angle) * (radius+previous_limb.radius);
		var pos_y = previous_limb.pos_y + µ.angle_to_y(angle) * (radius+previous_limb.radius);


		var density = 0.025 + .025 / ( Math.PI * 4 * radius * radius);
		this.limbs.push(new grd.AgentLimb(pos_x, pos_y, position, radius, density, friction, restitution, previous_limb));
	}
	else
	{
		var density = 2.55 / ( Math.PI * 4 * radius * radius);
		this.limbs.push(new grd.AgentLimb(grd.EVO__AGENT_START_POS_X, 28, position, radius, density, friction, restitution, null));
	}
	return this.limbs[this.limbs.length - 1];
}

grd.Agent.prototype.think = function (time_delta)
{
	this.now += time_delta;
	this.ticks_elapsed++;

	//this.limbs[0].body.ApplyTorque(200);

	if (this.now  > grd.EVO__SIMULATION_INITIAL_LIMPNESS)
	{
		for(var i = 0, len = this.limbs.length; i < len; ++i)
		{

			var limb = this.limbs[i];
			if (i == 0)
			{
				var vel = 120;
				var pos = limb.body.GetWorldCenter();
				if (grd.input.KEY_CURSOR_UP.pressed)
				{
					limb.body.ApplyForce(new b2Vec2(0, -vel), pos);
				}
				if (grd.input.KEY_CURSOR_DOWN.pressed)
				{
					limb.body.ApplyForce(new b2Vec2(0, vel), pos);
				}
				if (grd.input.KEY_CURSOR_LEFT.pressed)
				{
					
					limb.body.ApplyForce(new b2Vec2(-vel, 0), pos);
				}
				if (grd.input.KEY_CURSOR_RIGHT.pressed)
				{
					limb.body.ApplyForce(new b2Vec2(vel, 0), pos);
				}
				if (grd.input.KEY_CURSOR_DOWN.pressed)
				{
					limb.body.ApplyForce(new b2Vec2(vel, 0), pos);
				}
				/*
				var angle = µ.vector2D_to_angle(grd.cameras.player.mouse_pos_x * 240 - pos.x, 55 - grd.cameras.player.mouse_pos_y * 55 - pos.y);
				//console.log(angle, pos.x, pos.y);
				limb.body.ApplyForce(new b2Vec2(µ.angle_to_x(angle) * 389.10, µ.angle_to_y(angle) * 382.10), pos);
				*/
			}
			if (limb.torque_force && limb.joint != null)
			{
				var torque = 1;//Math.sin(this.now / limb.torque_freq + limb.torque_freq_offset);
				torque *= limb.torque_factor1;
				torque += limb.torque_offset1;
				torque *= limb.torque_factor2;
				if (torque > 1)
					torque = 1;
				if (torque < -1)
					torque = -1;
				torque += limb.torque_offset2;

				torque *= limb.torque_force;
				
				//limb.body.ApplyTorque(torque);
				if (grd.input.KEY_A.pressed)
				{
					if (limb.joint.GetJointAngle() > 0)
					{
						limb.joint.SetMotorSpeed(-torque);
					}
				}
				else if (grd.input.KEY_D.pressed)
				{
					if (limb.joint.GetJointAngle() < 0)
					{
						limb.joint.SetMotorSpeed(torque);
					}
				}
				else if (grd.input.KEY_S.pressed)
				{
					limb.joint.SetMotorSpeed(-limb.joint.GetJointAngle() * 2);
				}
				else
				{
					limb.joint.SetMotorSpeed(0);
				}
			}
		}
	}
	this.current_distance = this.limbs[0].body.GetPosition().x - grd.EVO__AGENT_START_POS_X;
	this.total_distance += this.current_distance;
	this.average_distance = this.total_distance / this.ticks_elapsed;
	if (this.current_distance > this.max_distance)
	{
		this.max_distance = this.current_distance;
	}
};

grd.Agent.prototype.remove_body = function (world)
{
	for(var i = this.limbs.length - 1; i >= 0; --i)
	{
		grd.b2world.DestroyBody(this.limbs[i].body);
	}

}

grd.Agent.prototype.make_body = function (world)
{
	var bodyDef = new b2BodyDef;
	bodyDef.type = b2Body.b2_dynamicBody;

	var fixDef = new b2FixtureDef;

	var revoluteJointDef = new b2RevoluteJointDef;
	var lineJointDef = new b2LineJointDef;
	var distanceJointDef = new b2DistanceJointDef;
	
	

	for(var i = 0, len = this.limbs.length; i < len; ++i)
	{

		fixDef.density = this.limbs[i].density;
		fixDef.friction = this.limbs[i].friction;
		fixDef.restitution = this.limbs[i].restitution;

		fixDef.shape = new b2CircleShape(this.limbs[i].radius);

		//fixDef.shape = new b2PolygonShape;
		//fixDef.shape.SetAsBox(this.limbs[i].radius, this.limbs[i].radius);

		bodyDef.position.x = this.limbs[i].pos_x;
		bodyDef.position.y = this.limbs[i].pos_y;
		var body = grd.b2world.CreateBody(bodyDef);
		body.CreateFixture(fixDef);
		//body.SetBullet(true);
		
		if (i == 0)
		{
			body.SetLinearDamping(1);
			//body.SetFixedRotation(true);
		}

		this.limbs[i].body = body;

		if (this.limbs[i].connected_to != null)
		{

			var body_pos1 = body.GetPosition();
			var body_pos2 = this.limbs[i].connected_to.body.GetPosition();

			/*
			distanceJointDef.Initialize(body, this.limbs[i].connected_to.body,
				body.GetWorldCenter(), this.limbs[i].connected_to.body.GetWorldCenter()
				);
			grd.b2world.CreateJoint(distanceJointDef);
			*/


			if (Math.random() > -20.5)
			{
				revoluteJointDef.Initialize(body, this.limbs[i].connected_to.body,
					body.GetWorldCenter(),
					this.limbs[i].connected_to.body.GetWorldCenter()
				);
			}
			else
			{
				revoluteJointDef.Initialize(body, this.limbs[i].connected_to.body,
					this.limbs[i].connected_to.body.GetWorldCenter(),
					body.GetWorldCenter()
				);
			}

			revoluteJointDef.maxMotorTorque = 10;
			this.limbs[i].joint = grd.b2world.CreateJoint(revoluteJointDef);
			this.limbs[i].joint.SetLimits(-0.4*this.limbs[i].torque_freedom*Math.PI, 0.4*this.limbs[i].torque_freedom*Math.PI);
			this.limbs[i].joint.EnableLimit(true);
			this.limbs[i].joint.EnableMotor(true);
			
			this.limbs[i].joint.SetMaxMotorTorque(200);

/*
			lineJointDef.Initialize(body, this.limbs[i].connected_to.body,
				(new b2Vec2((body_pos1.x + body_pos2.x) / 2, (body_pos1.y + body_pos2.y) / 2)),
				new b2Vec2(1, 1)
				);

			lineJointDef.lowerTranslation = -grd.EVO__AGENT_LIMB_RADIUS/2;
			lineJointDef.upperTranslation = grd.EVO__AGENT_LIMB_RADIUS/2;
			lineJointDef.enableLimit = true;

			grd.b2world.CreateJoint(lineJointDef);
*/
		}
		else
		{
			this.limbs[i].joint = null;
		}
	}
};