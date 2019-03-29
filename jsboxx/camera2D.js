"use strict";

µ.Cameras2D = function(namespace, size_x, size_y)
{
	var orig_x = 'left';
	var orig_y = 'top';

	var aspect = size_x / size_y;
	var one_over_aspect = 1 / aspect;

	this.CAMERA_TYPE__STRETCH 	= 0;
	this.CAMERA_TYPE__PORTRAIT 	= 1;
	this.CAMERA_TYPE__LANDSCAPE = 2;

	this.ORIGIN__TOP			= 0;
	this.ORIGIN__LEFT			= 1;
	this.ORIGIN__RIGHT			= 2;
	this.ORIGIN__BOTTOM			= 3;
	this.ORIGIN__CENTER			= 4;

	this.c = [];
	this.c.push(new µ.Camera2D(this, this.CAMERA_TYPE__STRETCH, true, this.ORIGIN__LEFT, this.ORIGIN__BOTTOM));

	this.c[0].x_origin = orig_x;
	this.c[0].y_origin = orig_y;
	this.c[0].set_size(1.0, 1.0);
	this.c[0].set_pos(0.5, 0.5);
	this.c[0].set_zoom(1.0);
	this.c[0].aspect = aspect;
	this.c[0].one_over_aspect = one_over_aspect;
	this.c[0].auto_handle = true;


	this.c.push(new µ.Camera2D(this, this.CAMERA_TYPE__PORTRAIT, true, this.ORIGIN__LEFT, this.ORIGIN__BOTTOM));
	this.c[1].x_origin = orig_x;
	this.c[1].y_origin = orig_y;
	this.c[1].set_size(aspect, 1.0);
	this.c[1].set_pos(aspect / 2, 0.5);
	this.c[1].set_zoom(1.0);
	this.c[1].aspect = aspect;
	this.c[1].one_over_aspect = one_over_aspect;
	this.c[1].auto_handle = true;


	this.c.push(new µ.Camera2D(this, this.CAMERA_TYPE__LANDSCAPE, true, this.ORIGIN__LEFT, this.ORIGIN__BOTTOM));
	this.c[2].x_origin = orig_x;
	this.c[2].y_origin = orig_y;
	this.c[2].set_size(1.0, 1.0 / aspect);
	this.c[2].set_pos(0.5, 0.5 / aspect);
	this.c[2].set_zoom(1.0);
	this.c[2].aspect = aspect;
	this.c[2].one_over_aspect = one_over_aspect;
	this.c[2].auto_handle = true;

	// default cameras

	namespace.CAM_STRETCH = 0;
	namespace.CAM_PORTRAIT = 1;
	namespace.CAM_LANDSCAPE = 2;
}

µ.Cameras2D.prototype.add_camera = function(type, autohandle, orig_x, orig_y, size_x, size_y, pos_x, pos_y, zoom, restrict_to_bounding_box)
{
	this.c.push(new µ.Camera2D(this, type, autohandle, orig_x, orig_y));
	var cam_id = this.c.length - 1;
	this.c[cam_id].x_origin = orig_x;
	this.c[cam_id].y_origin = orig_y;
	this.c[cam_id].set_size(size_x, size_y);
	this.c[cam_id].set_pos(pos_x, pos_y);
	this.c[cam_id].set_zoom(zoom);
	this.c[cam_id].auto_handle = autohandle;
	this.c[cam_id].restrict_to_bounding_box = restrict_to_bounding_box != undefined ? restrict_to_bounding_box : true;
	return cam_id;
}

// called when the window size changes to resize 
µ.Cameras2D.prototype.resize = function (size_x, size_y)
{
	var aspect = size_x / size_y;
	var one_over_aspect = 1 / aspect;
	for (var i = 0; i < this.c.length; i++)
	{
		var cam = this.c[i];
		cam.aspect = aspect;
		cam.one_over_aspect = one_over_aspect;

		if (cam.type == this.CAMERA_TYPE__PORTRAIT && cam.auto_handle)
		{
			cam.set_pos(aspect / 2, 0.5);
			cam.set_size(aspect, 1.0);
			cam.recalc_zoom();
			cam.set_zoom(1.0); // ??
		}
		else if (cam.type == this.CAMERA_TYPE__LANDSCAPE && cam.auto_handle)
		{
			cam.set_pos(0.5, 0.5 / aspect);
			cam.set_size(1.0, 1.0 / aspect);
			cam.recalc_zoom();
			cam.set_zoom(1.0); // ??
		}
		else
		{
			cam.recalc_zoom();
		}
	}
}

µ.Cameras2D.prototype.handle_mousemove = function (mouse_x, mouse_y)
{
	for (var i = 0; i < this.c.length; i++)
	{
		var cam = this.c[i];
		cam.mouse_screen_x = mouse_x;
		cam.mouse_screen_y = mouse_y;
		cam.calc_mouse(mouse_x, mouse_y);
	}
}

µ.Camera2D = function (cameras, type, auto_handle, orig_x, orig_y)
{
	this.cameras = cameras;
	this.auto_handle = auto_handle || false;
	this.x_origin = orig_x || cameras.ORIGIN__CENTER;
	this.y_origin = orig_y || cameras.ORIGIN__CENTER;
	this.type = type;
	this.pos = new Float32Array([0, 0]);
	this.zoom = new Float32Array([1, 1]);
};

µ.Camera2D.prototype.restrict_to_bounding_box = true;
µ.Camera2D.prototype.aspect = 1.0;
µ.Camera2D.prototype.one_over_aspect = 1.0;
µ.Camera2D.prototype.mouse_pos_x = 0;
µ.Camera2D.prototype.mouse_pos_y = 0;
µ.Camera2D.prototype.mouse_screen_x = 0;
µ.Camera2D.prototype.mouse_screen_y = 0;
µ.Camera2D.prototype.old_mouse_pos_x = 0;
µ.Camera2D.prototype.old_mouse_pos_y = 0;
µ.Camera2D.prototype.pos_x = 0;
µ.Camera2D.prototype.pos_y = 0;
µ.Camera2D.prototype.zoom_x = 1;
µ.Camera2D.prototype.zoom_y = 1;
µ.Camera2D.prototype.zoom_ = 1;
µ.Camera2D.prototype.size_x = 1;
µ.Camera2D.prototype.size_y = 1;

µ.Camera2D.prototype.top_edge_y = 0;
µ.Camera2D.prototype.left_edge_x = 0;
µ.Camera2D.prototype.right_edge_x = 0;
µ.Camera2D.prototype.bottom_edge_y = 0;

µ.Camera2D.prototype.set_pos = function (target_x, target_y)
{
	//console.log(target_x, target_y);

	this.pos_x = target_x;
	this.pos_y = target_y;
	this.pos[0] = target_x + 0;
	this.pos[1] = target_y + 0;

	if (this.restrict_to_bounding_box)
	{
		if (this.zoom_x <= this.size_x)
		{
			if (this.pos_x < this.zoom_x / 2)
			{
				this.pos_x = this.zoom_x / 2;
			}
			if (this.pos_x > this.size_x - this.zoom_x / 2)
			{
				this.pos_x = this.size_x - this.zoom_x / 2;
			}
		}
		else
		{
			this.pos_x = this.size_x/2;
		}
		if (this.zoom_y <= this.size_y)
		{
			if (this.pos_y < this.zoom_y / 2)
			{
				this.pos_y = this.zoom_y / 2;
			}
			if (this.pos_y > this.size_y - this.zoom_y / 2)
			{
				this.pos_y = this.size_y - this.zoom_y / 2;
			}
		}
		else
		{
			this.pos_y = this.size_y/2;
		}
	}

	this.pos[0] = this.pos_x + 0;
	this.pos[1] = this.pos_y + 0;

	this.top_edge_y = this.pos_y + this.zoom_y;
	this.left_edge_x = this.pos_x - this.zoom_x;
	this.right_edge_x = this.pos_x + this.zoom_x;
	this.bottom_edge_y = this.pos_y - this.zoom_y;

};

µ.Camera2D.prototype.recalc_zoom = function ()
{
	if (this.type === this.cameras.CAMERA_TYPE__LANDSCAPE)
	{
		this.zoom_x = this.zoom_;
		this.zoom_y = this.zoom_ / this.aspect;
	}
	else if (this.type === this.cameras.CAMERA_TYPE__PORTRAIT)
	{
		this.zoom_x = this.zoom_ * this.aspect;
		this.zoom_y = this.zoom_;
	}
	else
	{
		this.zoom_x = this.zoom_;
		this.zoom_y = this.zoom_;
	}
	this.zoom[0] = this.zoom_x + 0;
	this.zoom[1] = this.zoom_y + 0;
};

µ.Camera2D.prototype.set_zoom = function (zoom)
{
	if (zoom < 0)
		this.zoom_ /= 1.1; // ???????? heh, make this actually do something useful or get rid of it you big silly
	else
		this.zoom_ = zoom;
	this.recalc_zoom();
};

µ.Camera2D.prototype.set_size = function (size_x, size_y)
{
	this.size_x = size_x;
	this.size_y = size_y;
};
/*
	expects mouse coordinates ranging from 0,0 (top left) to 1,1 (bottom right) and translates those to camera coordinates
*/
µ.Camera2D.prototype.calc_mouse = function (target_pos_x, target_pos_y)
{
	var
		this_x = this.pos_x,
		this_y = this.pos_y,
		this_zoom_x = this.zoom_x,
		this_zoom_y = this.zoom_y,
		this_size_x = this.size_x,
		this_size_y = this.size_y,
		x,
		y;
	if (this.x_origin == this.cameras.ORIGIN__RIGHT)
	{
		target_pos_x = 1 - target_pos_x;
	}
	else if (this.x_origin == this.cameras.ORIGIN__CENTER)
	{
		target_pos_x = 0.5 - target_pos_x;
	}
	if (this.y_origin == this.cameras.ORIGIN__BOTTOM)
	{
		target_pos_y = 1 - target_pos_y;
	}
	else if (this.x_origin == this.cameras.ORIGIN__CENTER)
	{
		target_pos_y = 0.5 - target_pos_y;
	}
	target_pos_y *= this_zoom_y * this_zoom_y;
	target_pos_x *= this_zoom_x * this_zoom_x;
	x = (this_x - this_zoom_x / 2) + (target_pos_x / this_zoom_x);
	y = (this_y - this_zoom_y / 2) + (target_pos_y / this_zoom_y);
	this.old_mouse_pos_x = this.mouse_pos_x;
	this.old_mouse_pos_y = this.mouse_pos_y;
	this.mouse_pos_x = x;
	this.mouse_pos_y = y;
};

µ.Camera2D.prototype.recalc_mouse = function ()
{
	this.calc_mouse(this.mouse_screen_x, this.mouse_screen_y);
}