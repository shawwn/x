var st = {};
st.init = [
	function() {
		st.now = 0;
		
		
		st.last_play = 0;
		st.cameras = µ.Camera2D_Defaults(Math.round((window.innerWidth - 0) / 1), Math.round((window.innerHeight - 4) / 1));
		st.cameras.player = new µ.Camera2D('portrait');
		st.cameras.player.x_origin = 'left';
		st.cameras.player.y_origin = 'bottom';
		st.cameras.player.set_size(1.0, 1.0);
		st.cameras.player.set_zoom(1.0);
		st.desired_zoom = 2.0;
		st.c = new µ.canvas_webgl('bxx', 1, -1, -1, st.cameras, {
				autoresize: true,
			});
		st.cameras.player.set_pos(0.5, 0.5);
		st.cameras.player.set_size(1.0, 1.0);
		st.rand = new µ.PRandom(7.7, 2.3, 323144740992, 123445432);
		return 'stuff';
	},
	function() {
		st.input = new µ.input(st.c.canvas, 1, st.cameras);
		st.audio = new µ.Audio();

		st.sampled_sound = st.audio.sample_sound(1, .5, function(time, duration) {
				var frac = time / duration;
				var frac1 = 1-frac*frac*frac;
				var fade = time < 180 ? time / 180 : 1;
				return (
								0.25 * Math.sin(time / (32 + 3 * (1 + Math.sin((time)/200) / 2) ))
				) * fade * frac1;
			},
			function(time, duration) {
				var frac = time / duration;
				var frac1 = 1-frac*frac*frac;
				var fade = time < 180 ? time / 180 : 1;
				return (
								0.25 * Math.sin(time / (31 + 3 * (1 + Math.sin((time)/200) / 2) ))
				) * fade * frac1;
			});


		st.song_pos = 0;
		st.song_patterns = [
		
			30,
			10,
			14,
			10,
			17,
			20,
			10,
			11
		
		];
		return 'done!';
	},
];
st.think = function(time_delta) {
	st.now += time_delta;
	var autoplay = false;
	if ((st.input.key('KEY_SPACE').pressed || autoplay == true) && st.now - st.last_play > 500)
	{
		var sni = function (time, factor) { return Math.sin(time / factor) };
		var sni1 = function (time, factor) { return (1 + Math.sin(time / factor))/2 };
		
		var base = 150 + µ.rand(200);
		
		var a1 = 150 + µ.rand(50);
		var a2 = 150 + µ.rand(50);
		var b1 = 150 + µ.rand(50);
		var b2 = 150 + µ.rand(50);
		var c1 = 50 + µ.rand(50);
		var c2 = 25 + µ.rand(50);
		
		var filter = 500 + (1+Math.sin(st.now/(3600 + 10 * Math.sin(st.now/1777))))*2 * 1000; // 100 + µ.rand(1000);
		var vibrate = 2500 + µ.rand(250);
		var pitch = st.song_patterns[st.song_pos]; //1 + µ.rand(50);
		
		st.audio.play_sampled_sound(st.sampled_sound, .5);
/*
		st.audio.play_sound(1, 2, function(time, duration) {
				var frac = time / duration;
				var frac1 = 1-frac*frac*frac;
				var fade = time < 180 ? time / 180 : 1;
				return (
								0.25 * Math.sin(time / (32 + 3 * (1 + Math.sin((time)/200) / 2) ))
				) * fade * frac1;
			},
			function(time, duration) {
				var frac = time / duration;
				var frac1 = 1-frac*frac*frac;
				var fade = time < 180 ? time / 180 : 1;
				return (
								0.25 * Math.sin(time / (31 + 3 * (1 + Math.sin((time)/200) / 2) ))
				) * fade * frac1;
			});
*/
		 st.last_play = st.now;
		st.song_pos++;
		if (st.song_pos >= st.song_patterns.length)
			st.song_pos = 0;
	}
};
st.render = function()
{
	st.c.flush_all();
	var used_samples = Math.min(4096, st.audio.last_data_length);
	var bar_width = 1 / used_samples;
	last_valL = 0.5;
	last_valR = 0.5;
	for (var i = 0; i < used_samples; i++) 
	{
		var valL = (1 + st.audio.buffer0[i] * 1) / 2;
		st.c.draw_line('stretch',
			i * bar_width / 2,
			valL,
			(i-1) * bar_width / 2,
			last_valL,
			0.0023,
			{r:valL,g:1,b:valL,a:.85}
		);
		last_valL = valL;
		var valR = (1 + st.audio.buffer1[i] * 1) / 2;
		st.c.draw_line('stretch',
			0.5 + i * bar_width / 2,
			valR,
			0.5 + (i-1) * bar_width / 2,
			last_valR,
			0.00213,
			{r:valR,g:valR,b:1,a:.85}
		);
		last_valR = valR;
		/*
		st.c.draw_line('stretch',
			i * bar_width,
			(valL + valR)/2,
			(i-1) * bar_width,
			(last_valL+last_valR)/2,
			0.0033,
			{r:1,g:1,b:valL,a:.85}
		);
		
		*/
	}

	//console.log('render', st.audio.buffer0.length, total);
	st.c.flush_all();
};
var app = new µ.app(st, st.init, st.think, st.render);
				/*
				guard?
0.05 * sni(time,
	base
	+ a1 * sni1(time,a2)
	+ b1 * sni1(time,b2)
	+ c1 * sni1(time,c2)
	- c1 * sni1(time,a2) / 8
	- b1 * sni1(time,b2) / 8
	- a1 * sni1(time,c2) / 8
	)			
				
perfectly legit synth lead WTF (see "song" above :P
				0.25 * Math.sin(time / (filter + vibrate * (1 + Math.sin(time / pitch) / 2) ))
				
high pitch soft ring
#	0.05 * Math.sin(2 * time / (1321 + 123 * (1 + Math.sin(time / 2) / 2) ))
hostile scan (use for eyes?)
	0.05 * Math.sin(2 * time / (321 + 123 * (1 + Math.sin(time / 2) / 2) ))
energy shot
	0.05 * Math.sin(2 * time / (250 + 50 * (1 + Math.sin(time / 8) / 2) ))
metalic warbles
				
	0.05 * Math.sin(3 * time / (50 + 5 * (1 + Math.sin(time / 8) / 2) ))
	0.05 * Math.sin(2 * time / (450 + 1250 * (1 + Math.sin(time / 8) / 2) ))
	0.05 * sni(time, 50 + 50 * sni1(time, 3))
	0.05 * sni(time, 50 + 10 * sni1(time, 10))
	0.05 * sni(time, 50 + 50 * sni1(time, 13))
				*/