'use strict';

civ.init_generate_textures = function(bootloader_status)
{
	var size = 256;
	civ.generated_textures = [
		[
			'tex_noise',
			size,
			function(ctx, size_x, size_y, data)
			{
				for (var x = 0; x < size_x; x++)
				{
					for (var y = 0; y < size_y; y++)
					{
						//var lum = 200 + µ.rand_int(55);
						var lum = 40 + µ.rand(20);
						//ctx.fillStyle = "rgb("+lum+","+lum+","+lum+")";
						ctx.fillStyle = "hsl(0,100%,"+lum+"%)";
						ctx.fillRect (x, y, 1, 1);
					}
				}
			}
		],
		[
			'tex_soft_square',
			size,
			function(ctx, size_x, size_y, data)
			{
				var edge_dist = size_x / 4;
				for (var x = 0; x < size_x; x++)
				{
					for (var y = 0; y < size_y; y++)
					{
						if (x > edge_dist && x < size_x - edge_dist && y > edge_dist && y < size_y - edge_dist)
						{
							continue;
						}
						var alpha = 1;
						if (x < edge_dist)				alpha *= x/edge_dist;
						else if (x > (size_x - edge_dist))	alpha *= (size_x-x)/edge_dist;
						if (y < edge_dist)				alpha *= y/edge_dist;
						else if (y > (size_y - edge_dist))	alpha *= (size_y-y)/edge_dist;
						ctx.fillStyle = "rgba(255,255,255,"+alpha+")";
						ctx.fillRect (x, y, 1, 1); // heh!
					}
				}
				ctx.fillStyle = "rgba(255,255,255,1)";
				ctx.fillRect(edge_dist, edge_dist, size_x-edge_dist*2, size_y-edge_dist*2);
			}
		],
		[
			'tex_square',
			size,
			function(ctx, size_x, size_y, data)
			{
				ctx.fillStyle = "rgb(255,0,0)";
				ctx.fillRect (0, 0, size_x - 1, size_y - 1);
			}
		],
		[
			'tex_square_outline',
			size,
			function(ctx, size_x, size_y, data)
			{
				ctx.lineWidth = size_x / 32;
				ctx.strokeStyle = "rgb(255,0,0)";
				ctx.strokeRect (0, 0, size_x - 1, size_y - 1);
			}
		],
		[
			'tex_square_thick_outline',
			size,
			function(ctx, size_x, size_y, data)
			{
				ctx.lineWidth = size_x / 8;
				ctx.strokeStyle = "rgb(255,0,0)";
				ctx.strokeRect (0, 0, size_x - 1, size_y - 1);
			}
		],
		[
			'tex_circle',
			size,
			function(ctx, size_x, size_y, data)
			{
				ctx.beginPath();
				ctx.arc(size_x / 2, size_y / 2, size_x / 2, 0, 2 * Math.PI, false);
				ctx.fillStyle = '#f00';
				ctx.fill();
			}
		],
		[
			'tex_circle_outline_dash_1_1',
			size,
			function(ctx, size_x, size_y, data)
			{
				ctx.beginPath();
				var linewidth = size_x / 16;
				ctx.arc(size_x / 2, size_y / 2, size_x / 2 - linewidth / 2, 0, 2 * Math.PI, false);
				ctx.strokeStyle = '#f00';
				ctx.lineWidth = linewidth;

				ctx.setLineDash([.25 * linewidth, .25 * linewidth]);
				ctx.lineDashOffset = 0;

				ctx.stroke();
			}
		],
		[
			'tex_circle_outline',
			size,
			function(ctx, size_x, size_y, data)
			{
				var linewidth = size_x / 256;
				ctx.beginPath();
				ctx.arc(size_x / 2, size_y / 2, size_x / 2 - linewidth / 2, 0, 2 * Math.PI, false);
				ctx.strokeStyle = '#f00';
				ctx.lineWidth = linewidth;
				ctx.stroke();
			}
		],
		[
			'tex_circle_outline2',
			size,
			function(ctx, size_x, size_y, data)
			{
				var linewidth = size_x / 32;
				ctx.beginPath();
				ctx.arc(size_x / 2, size_y / 2, size_x / 2 - linewidth / 2, 0, 2 * Math.PI, false);
				ctx.strokeStyle = '#f00';
				ctx.lineWidth = linewidth;
				ctx.stroke();
			}
		],
		[
			'tex_circle_thick_outline',
			size,
			function(ctx, size_x, size_y, data)
			{
				var linewidth = size_x / 16;
				ctx.beginPath();
				ctx.arc(size_x / 2, size_y / 2, size_x / 2 - linewidth / 2, 0, 2 * Math.PI, false);
				ctx.strokeStyle = '#f00';
				ctx.lineWidth = linewidth;
				ctx.stroke();
			}
		],
		[
			'tex_circle_soft_reverse',
			size,
			function(ctx, size_x, size_y, data)
			{
				var gradient = ctx.createRadialGradient(size_x/2, size_y/2, 0, size_x/2, size_y/2, size_x);
				gradient.addColorStop(0, 	'hsla(0,100%,50%,0)');
				gradient.addColorStop(0.25, 'hsla(0,100%,50%,0.25)');
				gradient.addColorStop(0.5, 	'hsla(0,100%,50%,0.5)');
				gradient.addColorStop(0.75, 'hsla(0,100%,50%,0.75)');
				gradient.addColorStop(1, 	'hsla(0,100%,50%,1)');
				ctx.beginPath();
			    ctx.arc(size_x / 2, size_y / 2, size_x / 2, 0, 2 * Math.PI, false);
			    ctx.fillStyle = gradient;
			    ctx.fill();
			}
		],
		[
			'tex_circle_soft',
			size,
			function(ctx, size_x, size_y, data)
			{
				var gradient = ctx.createRadialGradient(size_x/2, size_y/2, 0, size_x/2, size_y/2, size_x);
				gradient.addColorStop(0, 	'hsla(0,100%,50%,1)');
				gradient.addColorStop(0.25, 'hsla(0,100%,50%,0.75)');
				gradient.addColorStop(0.5, 	'hsla(0,100%,50%,0.5)');
				gradient.addColorStop(0.75, 'hsla(0,100%,50%,0.25)');
				gradient.addColorStop(1, 	'hsla(0,100%,50%,0)');
				ctx.beginPath();
			    ctx.arc(size_x / 2, size_y / 2, size_x / 2, 0, 2 * Math.PI, false);
			    ctx.fillStyle = gradient;
			    ctx.fill();
			}
		],
		[
			'tex_circle_shield',
			size,
			function(ctx, size_x, size_y, data)
			{
				var gradient = ctx.createRadialGradient(size_x/2, size_y/2, 0, size_x/2, size_y/2, size_x);
				gradient.addColorStop(0, 	'hsla(0,100%,50%,0)');
				gradient.addColorStop(0.25, 'hsla(0,100%,50%,0)');
				gradient.addColorStop(0.66, 'hsla(0,100%,50%,1)');
				gradient.addColorStop(1, 	'hsla(0,100%,50%,1)');

				ctx.beginPath();
				ctx.arc(size_x / 2, size_y / 2, size_x / 2, 0, 2 * Math.PI, false);
				ctx.fillStyle = gradient;
				ctx.fill();
			}
		],
		[
			'tex_bar_shield',
			size,
			function(ctx, size_x, size_y, data)
			{

				var gradient = ctx.createLinearGradient(0, 0, size_x, size_y);
				gradient.addColorStop(0, 	'hsla(0,100%,100%,1)');
				gradient.addColorStop(0.25, 'hsla(5,100%,40%,1)');
				gradient.addColorStop(0.75, 'hsla(10,100%,30%,1)');
				gradient.addColorStop(1, 	'hsla(15,100%,20%,1)');
				ctx.lineWidth = size_x / 32;
				ctx.strokeStyle = "rgb(255,0,0)";
				ctx.fillStyle = gradient;
				ctx.fillRect (0, 0, size_x, size_y);
				//ctx.strokeRect (0, 0, size_x - 1, size_y - 1);
			}
		],

	];
	bootloader_status.info = 'Generating textures';
	civ.texture_gen_progress = 0;
};