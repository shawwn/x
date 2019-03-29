"use strict";

µ.generate_canvas_texture = function(size_x, size_y, gen_func, data)
{
	var cv = document.createElement('canvas');
	cv.width = size_x;
	cv.height = size_y;
	var ctx = cv.getContext('2d');
	gen_func(ctx, size_x, size_y, data);
	return cv;
}


µ.canvas = function(parent_el_id, width, height) {
	this.canvas = document.createElement('canvas');
	this.ctx = this.canvas.getContext("2d");
	document.getElementById(parent_el_id).appendChild(this.canvas);
	
	this.canvas.setAttribute('width', width);
	this.canvas.setAttribute('height', height);
	this.canvas.style.width = width + 'px';
	this.canvas.style.height = height + 'px';
};