var qc = {};
qc.init = [
	function()
	{
		qc.now = 0;		
		qc.scale = 1;
		qc.last_play = 0;

		qc.cameras = new µ.Cameras2D(qc, window.innerWidth, window.innerHeight);
		qc.CAM_PLAYER = qc.cameras.add_camera('portrait', false, 'left', 'bottom', 1, 1, .5, .5, 1);

		qc.c = new µ.canvas_webgl('bxx', qc.scale, -1, -1, qc.cameras, {
				autoresize: true,
			});
/*
		return 'stuff';
	},
	function()
	{
*/
		qc.quantities = [1, 10, 100, 1000, 10000, 100000];
		qc.max_quantity = 0;
		qc.update();

		qc.COMPARE_MODE_LENGTH = 0;
		qc.COMPARE_MODE_CIRCLE = 1;
		qc.COMPARE_MODE_SQUARE = 2;

		qc.input = new µ.input(qc.c.canvas, qc.scale, qc.cameras);
		qc.fonts = new µ.WebGL_Font(qc.c, qc.c.canvas.ctx, qc.cameras, qc.c.textures);
		qc.fonts.add_font('font', 'Tahoma', 'normal', 700, 1024);
		return 'done!';
	},
];
qc.think = function(time_delta)
{
	qc.now += time_delta;
};

qc.update = function()
{
	qc.max_quantity = 0;
	for (var i = 0; i < qc.quantities.length; i++)
	{
		if (qc.max_quantity < qc.quantities[i])
			qc.max_quantity = qc.quantities[i];
	}
};

qc.render = function()
{
	//qc.c.clear();
	var frac_per_q = 1 / qc.quantities.length;
	
	for (var i = 0; i < qc.quantities.length; i++)
	{
		var frac = i * frac_per_q;
		var frac_q = qc.quantities[i] / qc.max_quantity;
		qc.c.rectangle.draw(qc.CAM_PLAYER,
			0.5 * frac_q,
			frac_per_q * 0.5 + i * frac_per_q,
			frac_q,
			frac_per_q,
			90,
			i * (360/qc.quantities.length) , 0.3, 0.75, 1,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1
	);


	}
/*
	var fps = qc.app.render_times.read();
	qc.fonts.draw_text("" + (Math.round(fps * 100) / 100) + "ms ", 'stretch', 'font', 0.035, 0.9, 0.08, 0.15, 0.01,
		0, 0, .3, .99, 0, 0, .5, .99, 0, 0, .9, .99, 0, 0, .7, .99);
	qc.fonts.draw_text((Math.round(1000 / fps * 10) / 10) + "", 'stretch', 'font', 0.035, 0.8, 0.08, 0.15, 0.01,
		0, 0, .3, .99, 0, 0, .5, .99, 0, 0, .9, .99, 0, 0, .7, .99);

	var fps = qc.app.think_times.read();
	qc.fonts.draw_text("" + (Math.round(fps * 100000) / 100000) + "ms ", 'stretch', 'font', 0.035, 0.6, 0.08, 0.15, 0.01,
		0, 0, .3, .99, 0, 0, .5, .99, 0, 0, .9, .99, 0, 0, .7, .99);
	qc.fonts.draw_text((Math.round(1000 / fps * 10) / 10) + "", 'stretch', 'font', 0.035, 0.5, 0.08, 0.15, 0.01,
		0, 0, .3, .99, 0, 0, .5, .99, 0, 0, .9, .99, 0, 0, .7, .99);

	qc.fonts.flush_all();
*/

	qc.c.flush_all();
	qc.c.gl.finish();
};

var app = new µ.app(qc, qc.init, qc.think, qc.render);
