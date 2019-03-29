"use strict";

µ.app = function (namespace, init, think, render, think_freq, max_skip)
{
	this.init			= init;
	this.think			= think;
	this.render			= render;
	this.think_freq		= think_freq || 5;

	this.max_skip		= max_skip || 500;
	this.last_callback	= performance.now();
	this.total_time		= 0;
	this.render_time	= 0;
	this.think_time		= 0;
	this.init_index		= 0;
	this.think_times	= new µ.Le_Accumulator(20);
	this.render_times	= new µ.Le_Accumulator(20);
	this.callback_times	= new µ.Le_Accumulator(20);
	this.bootloader_status = {
		progress:	0,
		info:		'',
	};
	namespace.app		= this;
	var self			= this;

	this.all = function()
	{
		requestAnimationFrame(self.all);

		var this_tick = performance.now();
		self.render(self.render_time);
		self.render_times.add(performance.now() - this_tick);

		var time_delta = this_tick - self.last_callback
		self.callback_times.add(time_delta);
		if (time_delta > self.max_skip)
		{
			time_delta = self.max_skip;
		}
		self.last_callback = this_tick;
		self.think_time += time_delta;
		self.total_time += time_delta;
		while (self.think_time >= self.think_freq)
		{
			var stopwatch = performance.now();
			think(self.think_freq);
			self.think_times.add(performance.now() - stopwatch);
			self.think_time -= self.think_freq;
		}
	};

	this.do_init = function()
	{
		if (self.init_index < init.length)
		{
			//requestAnimationFrame(self.do_init); // meh
			setTimeout(self.do_init, 1);

			self.bootloader_status.progress = 1.0; 								// default unless overridden
			self.bootloader_status.info = 'init step #' + self.init_index; 		// default unless overridden
			self.init[self.init_index](self.bootloader_status);					// run next init function on stack
			bootloader.refresh((self.init_index + 1) / self.init.length, self.bootloader_status.info, self.bootloader_status.progress);
			// does the function need to be called again?
			if (self.bootloader_status.progress >= 1.0)
			{
				self.init_index++
			}
		}
		// done
		else
		{
			self.last_think = self.last_render = performance.now();
			//setTimeout(self.run, 1);
			//requestAnimationFrame(self.render_frame);
			requestAnimationFrame(self.all);
		}
	}
	this.do_init();
}