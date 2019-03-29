grd.render = function ()
{

	grd.b2world.DrawDebugData();
	
	var scale = 2;

	grd.c2d.ctx.beginPath();
	grd.c2d.ctx.strokeStyle = 'hsla(0, 100%, 100%, 0.75)';
	grd.c2d.ctx.moveTo(50, 50);
	grd.c2d.ctx.lineTo(50, 70);
	grd.c2d.ctx.closePath();
	grd.c2d.ctx.stroke();

	grd.c2d.ctx.beginPath();
	grd.c2d.ctx.strokeStyle = 'hsla(120, 100%, 50%, 0.75)';
	grd.c2d.ctx.fillStyle = 'hsla(120, 100%, 50%, 0.25)';
	grd.c2d.ctx.arc(50 + grd.agents.a[grd.simulation.current_agent].current_distance*scale, 55, 2, 0, Math.PI * 2, true);
	grd.c2d.ctx.closePath();
	grd.c2d.ctx.stroke();
	grd.c2d.ctx.fill();

	grd.c2d.ctx.beginPath();
	grd.c2d.ctx.strokeStyle = 'hsla(120, 100%, 50%, 0.75)';
	grd.c2d.ctx.moveTo(50, 55);
	grd.c2d.ctx.lineTo(50 + grd.agents.a[grd.simulation.current_agent].current_distance*scale, 55);
	grd.c2d.ctx.closePath();
	grd.c2d.ctx.stroke();


	grd.c2d.ctx.beginPath();
	grd.c2d.ctx.strokeStyle = 'hsla(180, 100%, 50%, 0.75)';
	grd.c2d.ctx.fillStyle = 'hsla(180, 100%, 50%, 0.25)';
	grd.c2d.ctx.arc(50 + grd.agents.a[grd.simulation.current_agent].max_distance*scale, 60, 2, 0, Math.PI * 2, true);
	grd.c2d.ctx.closePath();
	grd.c2d.ctx.stroke();
	grd.c2d.ctx.fill();

	grd.c2d.ctx.beginPath();
	grd.c2d.ctx.strokeStyle = 'hsla(180, 100%, 50%, 0.75)';
	grd.c2d.ctx.moveTo(50, 60);
	grd.c2d.ctx.lineTo(50 + grd.agents.a[grd.simulation.current_agent].max_distance*scale, 60);
	grd.c2d.ctx.closePath();
	grd.c2d.ctx.stroke();


	grd.c2d.ctx.beginPath();
	grd.c2d.ctx.strokeStyle = 'hsla(60, 100%, 50%, 0.75)';
	grd.c2d.ctx.fillStyle = 'hsla(60, 100%, 50%, 0.25)';
	grd.c2d.ctx.arc(50 + grd.agents.a[grd.simulation.current_agent].average_distance*scale, 65, 2, 0, Math.PI * 2, true);
	grd.c2d.ctx.closePath();
	grd.c2d.ctx.stroke();
	grd.c2d.ctx.fill();

	grd.c2d.ctx.beginPath();
	grd.c2d.ctx.strokeStyle = 'hsla(60, 100%, 50%, 0.75)';
	grd.c2d.ctx.moveTo(50, 65);
	grd.c2d.ctx.lineTo(50 + grd.agents.a[grd.simulation.current_agent].average_distance*scale, 65);
	grd.c2d.ctx.closePath();
	grd.c2d.ctx.stroke();
	

	grd.c2d.ctx.beginPath();
	grd.c2d.ctx.strokeStyle = 'hsla(240, 100%, 80%, 0.5)';
	grd.c2d.ctx.moveTo(50, 80);
	grd.c2d.ctx.lineTo(1050, 80);
	grd.c2d.ctx.closePath();
	grd.c2d.ctx.stroke();

	grd.c2d.ctx.beginPath();
	grd.c2d.ctx.strokeStyle = 'hsla(240, 100%, 80%, 0.5)';
	grd.c2d.ctx.moveTo(50, 80);
	grd.c2d.ctx.lineTo(1050 - grd.agents.a[grd.simulation.current_agent].now/grd.EVO__SIMULATION_DURATION * 1000, 80);
	grd.c2d.ctx.closePath();
	grd.c2d.ctx.stroke();


	for (var i = 0; i <= grd.simulation.current_run; i++)
	{
		grd.c2d.ctx.beginPath();
		grd.c2d.ctx.strokeStyle = 'hsla(60, 100%, 50%, 0.75)';
		grd.c2d.ctx.fillStyle = 'hsla(60, 100%, 50%, 0.55)';
		grd.c2d.ctx.arc(50 + i * 10, 90, 2, 0, Math.PI * 2, true);
		grd.c2d.ctx.closePath();
		grd.c2d.ctx.stroke();
		grd.c2d.ctx.fill();
	}


	for (var i = 0; i < grd.EVO__MAX_AGENTS; i++)
	{
		if (grd.agents.a[i].scores.length)
		{
			grd.c2d.ctx.beginPath();
			grd.c2d.ctx.moveTo(51 + i * 50, 120 - grd.agents.a[i].scores[0] / 2);
			grd.c2d.ctx.strokeStyle = 'hsla('+(i*30)+', 100%, 80%, 0.75)';
			for (var j = 0, len = grd.agents.a[i].scores.length; j < len; j++)
			{
				grd.c2d.ctx.lineTo(61 + j * 5 + i * 50, 120 - grd.agents.a[i].scores[j] / 2);
			}
			grd.c2d.ctx.stroke();
		}
	}


	/*
	grd.c.draw_rectangle('player', grd.playfield_width/2, 0.5, grd.playfield_width, 1, 90,
	
		[
			{r:1,g:1,b:1,a:.05},
			{r:1,g:1,b:1,a:.21},
			{r:1,g:1,b:1,a:.21},
			{r:1,g:1,b:1,a:.05}
		]
	
	);
	
	grd.c.flush_all();
	
	grd.c.set_blending(grd.c.gl.SRC_ALPHA, grd.c.gl.ONE, grd.c.gl.FUNC_ADD);
	grd.particlesGPU.draw(grd.now, grd.c.gl, grd.cameras.player);
	grd.c.set_blending(grd.c.gl.SRC_ALPHA, grd.c.gl.ONE_MINUS_SRC_ALPHA, grd.c.gl.FUNC_ADD);
	
	grd.c.flush_all();

*/
/*

	grd.c.draw_rectangle('player', -grd.playfield_width/10, 0.5, grd.playfield_width/5, 1, 90, {r:0,g:0,b:0,a:1});
	

	grd.c.draw_rectangle('player', grd.playfield_width/100, 0.5, grd.playfield_width/50, 1, 90,
	
		[
			{r:0,g:0,b:0,a:0},
			{r:0,g:0,b:0,a:1},
			{r:0,g:0,b:0,a:1},
			{r:0,g:0,b:0,a:0}
		]
	
	);
	

*/

};