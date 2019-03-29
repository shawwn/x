grd.init = [
	function() {
		grd.now = 0;
		grd.scale = 1;

		grd.world_size_x = 1200;
		grd.world_size_y = 600;

		grd.EVO__SIMULATION_INITIAL_LIMPNESS = 500;
		grd.EVO__SIMULATION_DURATION = 3000000;
		grd.EVO__SIMULATION_RUNS_PER_AGENT = 3;

		//grd.EVO__ELITE_CLONES = 3;
		
		grd.EVO__MAX_AGENTS = 3;
		grd.EVO__AGENT_BODY_RADIUS = 0.9;
		
		grd.EVO__AGENT_START_POS_X = 35;
		grd.EVO__AGENT_LIMB_RADIUS = 0.85;
		grd.EVO__AGENT_LIMB_RADIUS_FACTOR2 = 0.98;

		return 'cameras';
	},
	function() {
		grd.cameras = new µ.Cameras2D(grd, window.innerWidth, window.innerHeight);


		grd.CAM_PLAYER = grd.cameras.add_camera('portrait', false, 'left', 'bottom', grd.world_size_x, grd.world_size_y, grd.world_size_x, grd.world_size_y, 1);


		grd.camera_landscape = grd.cameras.c[grd.CAM_LANDSCAPE];
		grd.camera_portrait = grd.cameras.c[grd.CAM_PORTRAIT];
		grd.camera_stretch = grd.cameras.c[grd.CAM_STRETCH];
		grd.camera_player = grd.cameras.c[grd.CAM_PLAYER];

		grd.camera_player.set_pos(600, 150);


		return 'webgl';
	},
	function() {

		grd.c2d = new µ.canvas('bxx', 1200, 300);


		/*
		grd.c = new µ.canvas_webgl('bxx', grd.scale, -1, -1, grd.cameras, {
				autoresize: true,
			});
		*/
		//grd.cameras.player.aspect = grd.c.size_x / grd.c.size_y;
		grd.camera_player.set_zoom(1);
		grd.camera_player.set_pos(grd.camera_player.aspect/2, 0.5);
		//grd.particlesGPU = new µ.Particles2D_GPU(grd.c.gl, grd.pDefsGPU, 3000);
		//grd.particlesGPU2 = new µ.Particles2D_GPU(grd.c.gl, grd.pDefsGPU, 2000);
		return 'stuff';
	},
	function() {
		grd.rand = new MersenneTwister(42);
		grd.audio = new µ.Audio();

		grd.agents = new grd.Agents();
		grd.simulation = new grd.Simulation();

		grd.agents.spawn();

		return 'textures';
	},


	function() {
		//grd.tex_alfred = grd.c.load_texture('img/alfred.png');
		return 'box2d';
	},
	function() {

		b2Vec2 = Box2D.Common.Math.b2Vec2,
			b2BodyDef = Box2D.Dynamics.b2BodyDef,
			b2Body = Box2D.Dynamics.b2Body,
			b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
			b2Fixture = Box2D.Dynamics.b2Fixture,
			b2World = Box2D.Dynamics.b2World,
			b2MassData = Box2D.Collision.Shapes.b2MassData,
			b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,

			b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint,
			b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef,
			b2DistanceJoint = Box2D.Dynamics.Joints.b2DistanceJoint,
			b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef,
			b2FrictionJoint = Box2D.Dynamics.Joints.b2FrictionJoint,
			b2FrictionJointDef = Box2D.Dynamics.Joints.b2FrictionJointDef,
			b2WeldJoint = Box2D.Dynamics.Joints.b2WeldJoint,
			b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef,
			b2LineJoint = Box2D.Dynamics.Joints.b2LineJoint,
			b2LineJointDef = Box2D.Dynamics.Joints.b2LineJointDef,

			b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
			b2DebugDraw = Box2D.Dynamics.b2DebugDraw;


		grd.b2world = new Box2D.Dynamics.b2World(new b2Vec2(0, 100),  true);

		 var fixDef = new b2FixtureDef;
		 fixDef.density = 1.0;
		 fixDef.friction = 0.9995;
		 fixDef.restitution = 0.999;

		 var bodyDef = new b2BodyDef;
		 
		 var world_size_x = 240;
		 var world_size_y = 55;

		 //create ground
		 bodyDef.type = b2Body.b2_staticBody;
		 fixDef.shape = new b2PolygonShape;

		 // bottom
		 fixDef.shape.SetAsBox(world_size_x, 2);
		 bodyDef.position.Set(world_size_x / 2, world_size_y);
		 grd.simulation.world.body_bottom = grd.b2world.CreateBody(bodyDef);
		 grd.simulation.world.body_bottom.SetAngle(-0.05);
		 grd.simulation.world.body_bottom.CreateFixture(fixDef);
		 

		 // top
		 bodyDef.position.Set(world_size_x / 2, 0);
		 grd.b2world.CreateBody(bodyDef).CreateFixture(fixDef);

		 // left
		 fixDef.shape.SetAsBox(2, world_size_y);
		 bodyDef.position.Set(0, world_size_y / 2);
		 grd.b2world.CreateBody(bodyDef).CreateFixture(fixDef);

		 // right
		 bodyDef.position.Set(world_size_x, world_size_y / 2);
		 grd.b2world.CreateBody(bodyDef).CreateFixture(fixDef);
		 
		 /*
		 for (var i = 0; i < 90; i++)
		 {
		 	fixDef.shape.SetAsBox(.5, 1.5);
		 	bodyDef.position.Set(world_size_x / 50 +  world_size_x / 90 * i, world_size_y + 4.5 - i / 7.5);
		 	grd.b2world.CreateBody(bodyDef).CreateFixture(fixDef);
		 }*/
		 
	 	fixDef.shape.SetAsBox(.5, 1.5);
	 	bodyDef.position.Set(world_size_x / 2, world_size_y / 2);
	 	grd.b2world.CreateBody(bodyDef).CreateFixture(fixDef);
		 

	 	fixDef.shape.SetAsBox(.5, 1.5);
	 	bodyDef.position.Set(world_size_x / 2 + 10, world_size_y / 2);
	 	grd.b2world.CreateBody(bodyDef).CreateFixture(fixDef);

	 	fixDef.shape.SetAsBox(.5, 1.5);
	 	bodyDef.position.Set(world_size_x / 2 + 20, world_size_y / 2);
	 	grd.b2world.CreateBody(bodyDef).CreateFixture(fixDef);

	 	fixDef.shape.SetAsBox(.5, 1.5);
	 	bodyDef.position.Set(world_size_x / 2 + 10, world_size_y / 2 + 15);
	 	grd.b2world.CreateBody(bodyDef).CreateFixture(fixDef);

	 	fixDef.shape.SetAsBox(5.5, 1.5);
	 	bodyDef.position.Set(world_size_x / 2 + 40, world_size_y / 2 + 15);
	 	grd.b2world.CreateBody(bodyDef).CreateFixture(fixDef);

			//*

		//create some objects
		bodyDef.type = b2Body.b2_dynamicBody;

		var lineJointDef = new b2LineJointDef;
		var revoluteJointDef = new b2RevoluteJointDef;

		grd.bodies = Array(3);

		var connected_ones = 0;
		var last_body = undefined;


		 fixDef.density = 0.0025;
		 fixDef.friction = 0.2995;
		 fixDef.restitution = 0.15;

		for(var i = 0; i < 3; ++i) {

			/*
			if(Math.random() > 0.5) {
			   fixDef.shape = new b2PolygonShape;
			   fixDef.shape.SetAsArray([0.0, 0.5, 0.5, -0.5, -0.5, -0.5], 3);
			} else
			*/
			/*
			if(Math.random() > 0.5)
			{
			   fixDef.shape = new b2PolygonShape;
			   fixDef.shape.SetAsBox(
					 Math.random() * 0.25 + 0.75 //half width
				  ,  Math.random() * 0.25 + 0.75 //half height
			   );
			}
			else*/
			 {
			   fixDef.shape = new b2CircleShape(0.25 + Math.random() * 0.75);
			}

			if (last_body != undefined)
			{
				bodyDef.position.x = last_body.GetPosition().x + 0.52;
				bodyDef.position.y = last_body.GetPosition().y + 0.252;
			}
			else
			{
				bodyDef.position.x = 1;
				bodyDef.position.y = 1;
			}

			var body2 = grd.b2world.CreateBody(bodyDef);

			body2.CreateFixture(fixDef);

			body2.SetBullet(true);

			if (last_body != undefined && connected_ones < 0)
			{

				var body_pos1 = body2.GetPosition();
				var body_pos2 = last_body.GetPosition();
				
				revoluteJointDef.Initialize(body2, last_body,
					(new b2Vec2((body_pos1.x + body_pos2.x) / 2, (body_pos1.y + body_pos2.y) / 2))
					);
				grd.b2world.CreateJoint(revoluteJointDef);

				lineJointDef.Initialize(body2, last_body,
					(new b2Vec2((body_pos1.x + body_pos2.x) / 2, (body_pos1.y + body_pos2.y) / 2)),
					new b2Vec2(1, 1)
					);
				
				lineJointDef.lowerTranslation = 0;
				lineJointDef.upperTranslation = 3.5;
				lineJointDef.enableLimit = true;

				grd.b2world.CreateJoint(lineJointDef);

				connected_ones ++;

			}
			else
			{
				connected_ones = 0;
			}


			grd.bodies[i] = body2;

			grd.bodies[i].torque = (-15 + Math.random() * 30);
			last_body = grd.bodies[i];
		 }

			//*/

			

		 grd.b2debugDraw = new b2DebugDraw();

		 grd.b2debugDraw.SetDrawScale(.2);


			grd.b2debugDraw.SetSprite(grd.c2d.canvas.getContext("2d"));
			grd.b2debugDraw.SetDrawScale(5.0);
			grd.b2debugDraw.SetFillAlpha(0.25);
			grd.b2debugDraw.SetLineThickness(11.0);
			grd.b2debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit /* | b2DebugDraw.e_aabbBit | b2DebugDraw.e_pairBit | b2DebugDraw.e_centerOfMassBit */);

			grd.b2world.SetDebugDraw(grd.b2debugDraw);



		grd.simulation.init();


		return 'input';
	},
	function() {
		grd.input = new µ.input(grd.c2d.canvas, grd.scale, grd.cameras);
		return 'done!';
	},
];
