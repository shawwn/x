"use strict";

µ.Particles2D = function (gl, pDefs, particle_count)
{
	this.something_to_draw = false;

	this.allocation_chunk_size = 3000;
	this.vertices_per_object = 6;
	this.attributes_per_object = 14;
	this.magic_number = this.vertices_per_object * this.attributes_per_object;

	// used for incoming
	this.vbuffer = new Float32Array(0);
	this.buffer_counter = 0;
	this.buffer_max = 0;

	this.particle_count = particle_count;
	this.p_pointer = 0;
	this.initial_p_pointer = 0;
	var item_attribute_count = 14;
	this.init_shaders(gl, pDefs);
	this.buffer_vertex = gl.createBuffer();
	// pre-init buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer_vertex);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.particle_count * this.vertices_per_object * this.attributes_per_object), gl.DYNAMIC_DRAW);
}

µ.Particles2D.prototype.add_particle = function (
	now,
	pos_x, pos_y,
	size_factor, 
	vel_x, vel_y,
	pDef_index,
	lifespan,
	color_tint_hue, color_tint_sat, color_tint_lum, color_tint_a)
{

	// this would mean it fully wrapped around once in ONE frame,
	// which is best solved by allocating more particles or spawning less of them

	if (this.buffer_counter == this.particle_count)
		return;

	var
		start = now,
		end = (start + lifespan);

	this.something_to_draw = true;


	if (this.buffer_counter == this.buffer_max)
	{
		this.vbuffer = Float32Concat(this.vbuffer, new Float32Array(this.magic_number * this.allocation_chunk_size));
		this.buffer_max += this.allocation_chunk_size;
	}

	var offset = this.buffer_counter * this.magic_number;

	// - + top left

	this.vbuffer[offset +  0] = -1;
	this.vbuffer[offset +  1] = +1;
	this.vbuffer[offset +  2] = pos_x;
	this.vbuffer[offset +  3] = pos_y;
	this.vbuffer[offset +  4] = vel_x;
	this.vbuffer[offset +  5] = vel_y
	this.vbuffer[offset +  6] = start
	this.vbuffer[offset +  7] = end
	this.vbuffer[offset +  8] = pDef_index
	this.vbuffer[offset +  9] = color_tint_hue;
	this.vbuffer[offset + 10] = color_tint_sat;
	this.vbuffer[offset + 11] = color_tint_lum;
	this.vbuffer[offset + 12] = color_tint_a;
	this.vbuffer[offset + 13] = size_factor;

	// + + top right

	this.vbuffer[offset + 14] = +1;
	this.vbuffer[offset + 15] = +1;
	this.vbuffer[offset + 16] = pos_x;
	this.vbuffer[offset + 17] = pos_y;
	this.vbuffer[offset + 18] = vel_x;
	this.vbuffer[offset + 19] = vel_y
	this.vbuffer[offset + 20] = start
	this.vbuffer[offset + 21] = end
	this.vbuffer[offset + 22] = pDef_index
	this.vbuffer[offset + 23] = color_tint_hue;
	this.vbuffer[offset + 24] = color_tint_sat;
	this.vbuffer[offset + 25] = color_tint_lum;
	this.vbuffer[offset + 26] = color_tint_a;
	this.vbuffer[offset + 27] = size_factor;

	// + - bottom right

	this.vbuffer[offset + 28] = +1;
	this.vbuffer[offset + 29] = -1;
	this.vbuffer[offset + 30] = pos_x;
	this.vbuffer[offset + 31] = pos_y;
	this.vbuffer[offset + 32] = vel_x;
	this.vbuffer[offset + 33] = vel_y
	this.vbuffer[offset + 34] = start
	this.vbuffer[offset + 35] = end
	this.vbuffer[offset + 36] = pDef_index
	this.vbuffer[offset + 37] = color_tint_hue;
	this.vbuffer[offset + 38] = color_tint_sat;
	this.vbuffer[offset + 39] = color_tint_lum;
	this.vbuffer[offset + 40] = color_tint_a;
	this.vbuffer[offset + 41] = size_factor;

	// - + top left

	this.vbuffer[offset + 42] = -1;
	this.vbuffer[offset + 43] = +1;
	this.vbuffer[offset + 44] = pos_x;
	this.vbuffer[offset + 45] = pos_y;
	this.vbuffer[offset + 46] = vel_x;
	this.vbuffer[offset + 47] = vel_y
	this.vbuffer[offset + 48] = start
	this.vbuffer[offset + 49] = end
	this.vbuffer[offset + 50] = pDef_index
	this.vbuffer[offset + 51] = color_tint_hue;
	this.vbuffer[offset + 52] = color_tint_sat;
	this.vbuffer[offset + 53] = color_tint_lum;
	this.vbuffer[offset + 54] = color_tint_a;
	this.vbuffer[offset + 55] = size_factor;

	// + - bottom right

	this.vbuffer[offset + 56] = +1;
	this.vbuffer[offset + 57] = -1;
	this.vbuffer[offset + 58] = pos_x;
	this.vbuffer[offset + 59] = pos_y;
	this.vbuffer[offset + 60] = vel_x;
	this.vbuffer[offset + 61] = vel_y
	this.vbuffer[offset + 62] = start
	this.vbuffer[offset + 63] = end
	this.vbuffer[offset + 64] = pDef_index
	this.vbuffer[offset + 65] = color_tint_hue;
	this.vbuffer[offset + 66] = color_tint_sat;
	this.vbuffer[offset + 67] = color_tint_lum;
	this.vbuffer[offset + 68] = color_tint_a;
	this.vbuffer[offset + 69] = size_factor;

	// - - bottom left

	this.vbuffer[offset + 70] = -1;
	this.vbuffer[offset + 71] = -1;
	this.vbuffer[offset + 72] = pos_x;
	this.vbuffer[offset + 73] = pos_y;
	this.vbuffer[offset + 74] = vel_x;
	this.vbuffer[offset + 75] = vel_y
	this.vbuffer[offset + 76] = start
	this.vbuffer[offset + 77] = end
	this.vbuffer[offset + 78] = pDef_index
	this.vbuffer[offset + 79] = color_tint_hue;
	this.vbuffer[offset + 80] = color_tint_sat;
	this.vbuffer[offset + 81] = color_tint_lum;
	this.vbuffer[offset + 82] = color_tint_a;
	this.vbuffer[offset + 83] = size_factor;

	this.buffer_counter++;

};

µ.Particles2D.prototype.spawn = function (
										now, count,
										pos_x, pos_y,
										pos2_x, pos2_y,
										size,
										vel_x, vel_y,
										angle, angle_vel,
										//pDef,
										pDef_index,
										lifespan,
										color_tint_hue,
										color_tint_sat,
										color_tint_lum,
										color_tint_a,
										// optional:

										vary_angle,
										vary_angle_vel,
										vary_pos_x,
										vary_pos_y,
										vary_size,
										vary_vel_x,
										vary_vel_y,
										vary_lifespan,
										vary_color_hue,
										vary_color_sat,
										vary_color_lum,
										vary_color_a

										)
{



	if (count === 0)
		return;
	// ??
	//var distance = pos.distance_from(pos2);
	//count += count * Math.ceil(distance * 3);
	var distance_x = pos2_x - pos_x;
	var distance_y = pos2_y - pos_y;
	var step_size = 1.0 / count;

	for (var i = 0; i < count; ++i)
	{
		var angle2 = vary_angle ? angle - vary_angle / 2 + Math.random()*vary_angle : angle;
		angle2 = (360 + angle2) * Math.PI / 180;
		var angle_vel2 = vary_angle_vel ? angle_vel - vary_angle_vel / 2 + Math.random()*vary_angle_vel : angle_vel;
		this.add_particle(now,
			(vary_pos_x ? pos_x + distance_x * step_size * i - (vary_pos_x/2) + Math.random()*vary_pos_x : pos_x + distance_x * step_size * i),
			(vary_pos_y ? pos_y + distance_y * step_size * i - (vary_pos_y/2) + Math.random()*vary_pos_y : pos_y + distance_y * step_size * i),
			(vary_size ? (size - (vary_size/2) + Math.random()*vary_size) : size),
			(vary_vel_x ? vel_x - (vary_vel_x/2) + Math.random()*vary_vel_x : vel_x) + Math.cos(angle2) * angle_vel2,
			(vary_vel_y ? vel_y - (vary_vel_y/2) + Math.random()*vary_vel_y : vel_y) + Math.sin(angle2) * angle_vel2,
			pDef_index,
			//this.pDef_indices[pDef],
			(vary_lifespan ? Math.round(lifespan - (vary_lifespan/2) + Math.random()*vary_lifespan) : lifespan),
			(vary_color_hue ? color_tint_hue - (vary_color_hue/2) + Math.random()*vary_color_hue : color_tint_hue),
			(vary_color_sat ? color_tint_sat - (vary_color_sat/2) + Math.random()*vary_color_sat : color_tint_sat),
			(vary_color_lum ? color_tint_lum - (vary_color_lum/2) + Math.random()*vary_color_lum : color_tint_lum),
			(vary_color_a ? color_tint_a - (vary_color_a/2) + Math.random()*vary_color_a : color_tint_a)
			);
	}

/*
	angle2 = (360 + angle) * Math.PI / 180;
	for (var i = 0; i < count; ++i)
	{
		this.add_particle(now,
			pos_x + distance_x * step_size * i,
			pos_y + distance_y * step_size * i,
			size,
			vel_x + Math.cos(angle2) * angle_vel,
			vel_y + Math.sin(angle2) * angle_vel,
			this.pDef_indices[pDef],
			lifespan,
			color_tint_r, color_tint_g, color_tint_b, color_tint_a
			);
	}
*/
};

µ.Particles2D.prototype.draw = function(now, gl, camera)
{
	var program = this.program;
	gl.useProgram(program);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer_vertex);

	var item_attribute_count = 14;

	if (this.buffer_counter > 0)
	{
		var buffer_start = 0;
		var items_to_push = this.buffer_counter;
		if ((this.p_pointer + this.buffer_counter) >= this.particle_count)
		{
			items_to_push = this.particle_count - this.p_pointer;
			gl.bufferSubData(gl.ARRAY_BUFFER,
				this.p_pointer * this.vertices_per_object * this.attributes_per_object * 4,
				this.vbuffer.subarray(0, items_to_push * this.magic_number)
			);
			this.p_pointer = 0;
			buffer_start += items_to_push;
			items_to_push = this.buffer_counter - items_to_push;
		}

		gl.bufferSubData(gl.ARRAY_BUFFER,
			this.p_pointer * this.vertices_per_object * this.attributes_per_object * 4,
			this.vbuffer.subarray(buffer_start * this.magic_number, (buffer_start + items_to_push) * this.magic_number)
		);
		this.p_pointer += items_to_push;
		this.buffer_counter = 0;
	}

	gl.enableVertexAttribArray(this.program.aVertexPosition);
	gl.enableVertexAttribArray(this.program.aPosition);
	gl.enableVertexAttribArray(this.program.aVelocity);
	gl.enableVertexAttribArray(this.program.aStartEnd);
	gl.enableVertexAttribArray(this.program.aPDefIndex);
	gl.enableVertexAttribArray(this.program.aColor);
	gl.enableVertexAttribArray(this.program.aSize);

	gl.vertexAttribPointer(program.aVertexPosition,		2, gl.FLOAT,	false, 4 * item_attribute_count, 0);
	gl.vertexAttribPointer(program.aPosition,			2, gl.FLOAT,	false, 4 * item_attribute_count, 8);
	gl.vertexAttribPointer(program.aVelocity,			2, gl.FLOAT,	false, 4 * item_attribute_count, 16);
	gl.vertexAttribPointer(program.aStartEnd,			2, gl.FLOAT,	false, 4 * item_attribute_count, 24);
	gl.vertexAttribPointer(program.aPDefIndex,			1, gl.FLOAT,	false, 4 * item_attribute_count, 32);
	gl.vertexAttribPointer(program.aColor,				4, gl.FLOAT,	false, 4 * item_attribute_count, 36);
	gl.vertexAttribPointer(program.aSize,				1, gl.FLOAT,	false, 4 * item_attribute_count, 52);

	gl.uniform2fv(program.uCamPosition, camera.pos);
	gl.uniform2fv(program.uCamZoom, camera.zoom);

	gl.uniform1f(program.uTime, now);

	gl.drawArrays(gl.TRIANGLES,	0, this.particle_count * 6);

	gl.disableVertexAttribArray(this.program.aVertexPosition);
	gl.disableVertexAttribArray(this.program.aPosition);
	gl.disableVertexAttribArray(this.program.aVelocity);
	gl.disableVertexAttribArray(this.program.aStartEnd);
	gl.disableVertexAttribArray(this.program.aPDefIndex);
	gl.disableVertexAttribArray(this.program.aColor);
	gl.disableVertexAttribArray(this.program.aSize);

};
