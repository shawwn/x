/*
javascript:(function(){el_canvas=document.createElement('canvas');el_canvas.setAttribute('id',"perfgraph");el_canvas.style.pointerEvents='none';el_canvas.style.position='fixed';el_canvas.style.bottom='0px';el_canvas.style.left='0px';document.body.appendChild(el_canvas);el_script=document.createElement('script');el_script.setAttribute('src','http://127.0.0.1/jsBoxx/perfgraph.js');el_script.onload=function(){var graph=new PerfGraph("perfgraph");};document.body.appendChild(el_script);})();
*/

PerfGraph = function(canvas_id)
{
	this.bucket_count = 240;
	this.buckets = new Array(this.bucket_count);
	this.buckets_draw = new Array(this.bucket_count);
	this.bucket_index = 0;
	this.sample_freq = 16;
	this.border = 4;
	this.border_right = 60;
	this.scale_x = 3;
	this.size_y = 200;
	this.stopped = 0;

	
	for (var i = 0; i < this.bucket_count; i++)
	{
		this.buckets[i] = 0;
		this.buckets_draw[i] = 0;
	}
	function addEventListener(element, eventType, eventHandler, useCapture)
	{
		if (element.addEventListener) element.addEventListener(eventType, eventHandler, useCapture);
		else if (element.attachEvent) element.attachEvent('on' + eventType, eventHandler);
		else element['on' + eventType] = eventHandler;
	}
	function removeEventListener(element, eventType, eventHandler)
	{
		if (element.removeEventListener) element.removeEventListener(eventType, eventHandler);
		else if (element.detachEvent) element.detachEvent('on' + eventType, eventHandler);
		else element['on' + eventType] = null;
	}
	var requestAnimationFrame =
		window.requestAnimationFrame || window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;
	this.start = this.prev = window.performance.now();
	this.canvas = document.getElementById(canvas_id);
	this.canvas.style.width = this.canvas_width() + 'px';
	this.canvas.width = this.canvas_width();
	this.canvas.style.height = this.size_y + 'px';
	this.canvas.height = this.size_y;
	this.ctx = this.canvas.getContext('2d');
	//addEventListener(window, 'resize', this.resize_handler, false);
	//this.resize_handler();

	self = this;

	this.handler = function()
	{
		if (self.stopped)
			return;
		timestamp = window.performance.now(); 
		var delay = timestamp - self.prev;
		self.prev = timestamp;
		var t = timestamp - self.start;
		var new_index = Math.round(t / self.sample_freq);
		var old_index = self.bucket_index;
		while (self.bucket_index < new_index)
		{
			self.bucket_index++;
			self.buckets[self.bucket_index % self.bucket_count] = delay;
		}
		self.drawGraph();
		var draw_delay = window.performance.now() - timestamp;
		self.bucket_index = old_index;
		while (self.bucket_index < new_index)
		{
			self.bucket_index++;
			self.buckets_draw[self.bucket_index % self.bucket_count] = draw_delay;
		}
		window.requestAnimationFrame(self.handler);
	}

	window.requestAnimationFrame(this.handler);
}

PerfGraph.prototype.xpos = function(index)
{
	return this.border + index * this.scale_x;
}

PerfGraph.prototype.canvas_width = function()
{
	return this.border + this.bucket_count * this.scale_x + this.border_right;
}

PerfGraph.prototype.ypos = function(delay)
{
	var r = this.size_y - (Math.log(delay)) * ( this.size_y / 5.08);

	return r;
}

PerfGraph.prototype.drawScale = function(delay)
{
	this.ctx.fillStyle = 'rgb(250,150,150, 0.5)';
	this.outlineText(delay+'ms', this.xpos(this.bucket_count) + 4, this.ypos(delay) + 3, 'rgb(255,255,255)', 'rgba(0, 0, 0, 0.65)');
	this.ctx.lineWidth = 1;
	this.ctx.strokeStyle = 'rgba(155, 155, 155, 1)';
	this.ctx.beginPath();
	this.ctx.moveTo(this.xpos(0), this.ypos(delay));
	this.ctx.lineTo(this.xpos(this.bucket_count), this.ypos(delay));
	this.ctx.stroke();
}

PerfGraph.prototype.outlineText = function(text, pos_x, pos_y, fillstyle1, fillstyle2)
{
	this.ctx.fillStyle = fillstyle2;

	this.ctx.fillText(text, pos_x - 1, pos_y - 1);
	this.ctx.fillText(text, pos_x - 1, pos_y + 1);
	this.ctx.fillText(text, pos_x + 1, pos_y - 1);
	this.ctx.fillText(text, pos_x + 1, pos_y + 1);
/*
	this.ctx.fillText(text, pos_x    , pos_y - 1);
	this.ctx.fillText(text, pos_x    , pos_y + 1);
	this.ctx.fillText(text, pos_x + 1, pos_y    );
	this.ctx.fillText(text, pos_x - 1, pos_y    );
*/
	this.ctx.fillStyle = fillstyle1;
	this.ctx.fillText(text, pos_x, pos_y);
}

PerfGraph.prototype.drawGraph = function()
{
	this.ctx.clearRect(0, 0, this.canvas_width(), this.size_y);
	this.ctx.fontStyle = "Tahoma";
	this.ctx.fontSize = "16px";
	this.ctx.font = "normal 700 14px sans-serif";
	this.ctx.textAlign = 'left';
	this.drawScale(2);
	this.drawScale(4);
	this.drawScale(8);
	this.drawScale(16);
	this.drawScale(32);
	this.drawScale(64);
	this.drawScale(128);
	this.drawScale(256);
	this.drawScale(512);
	this.drawScale(1024);
	this.drawScale(2048);
	// line outer, taking note of extremes
	var
		worst = 0, worstpos = 0,
		best = 999999999999, bestpos = 0;
	this.ctx.strokeStyle = 'rgba(255,255,255, 0.4)';
	this.ctx.lineWidth = 3;
	this.ctx.beginPath();
	for (var i = 0; i < this.bucket_count; i++)
	{
		this.ctx.lineTo(this.xpos(i), this.ypos(this.buckets[i]));
		if (this.buckets[i] >= worst)
		{
			worst = this.buckets[i];
			worstpos = i;
		}
		if (this.buckets[i] <= best)
		{
			best = this.buckets[i];
			bestpos = i;
		}
	}
	this.ctx.stroke();
// line inner
	this.ctx.strokeStyle = 'rgb(0,0,0)';
	this.ctx.lineWidth = 1;
	this.ctx.beginPath();
	for (var i = 0; i < this.bucket_count; i++)
	{
		this.ctx.lineTo(this.xpos(i), this.ypos(this.buckets[i]));
	}
	this.ctx.stroke();
// draw_delay
	this.ctx.strokeStyle = 'rgba(255,0,255, 0.5)';
	this.ctx.lineWidth = 1.5;
	this.ctx.beginPath();
	for (var i = 0; i < this.bucket_count; i++)
	{
		this.ctx.lineTo(this.xpos(i), this.ypos(this.buckets_draw[i]));
	}
	this.ctx.stroke();
// extreme labeling (heh)
	this.ctx.font = "normal 400 19px sans-serif";
	if (worst)
	{
		if (worstpos > this.bucket_count / 2)
			this.ctx.textAlign = 'right';
		else
			this.ctx.textAlign = 'left';

		this.outlineText(''+(Math.round(worst * 10) / 10)+'ms', this.xpos(worstpos), 21, 'rgb(255,200,0)', 'rgba(0, 0, 0, 0.5)')
		this.ctx.strokeStyle = 'rgba(255,0,0,0.25)';
		this.ctx.lineWidth = 3;
		this.ctx.beginPath();
		this.ctx.moveTo(this.xpos(worstpos), 0);
		this.ctx.lineTo(this.xpos(worstpos), this.size_y);
		this.ctx.stroke();
	}
	if (best < 999999999999)
	{
		if (bestpos > this.bucket_count / 2)
			this.ctx.textAlign = 'right';
		else
			this.ctx.textAlign = 'left';
		this.outlineText(''+(Math.round(best * 10) / 10)+'ms', this.xpos(bestpos), this.size_y - 2, 'rgb(100,250,0)', 'rgba(0, 0, 0, 0.5)')
		this.ctx.strokeStyle = 'rgba(0,255,0,0.25)';
		this.ctx.lineWidth = 3;
		this.ctx.beginPath();
		this.ctx.moveTo(this.xpos(bestpos), 0);
		this.ctx.lineTo(this.xpos(bestpos), this.size_y);
		this.ctx.stroke();
	}
	var where = this.bucket_index % this.bucket_count;
	this.ctx.strokeStyle = 'rgba(255,255,255,0.2)';
	this.ctx.lineWidth = 4;
	this.ctx.beginPath();
	this.ctx.moveTo(this.xpos(where), 0);
	this.ctx.lineTo(this.xpos(where), this.size_y);
	this.ctx.stroke();
	this.ctx.strokeStyle = 'rgba(0,0,0,0.2)';
	this.ctx.lineWidth = 2;
	this.ctx.beginPath();
	this.ctx.moveTo(this.xpos(where), 0);
	this.ctx.lineTo(this.xpos(where), this.size_y);
	this.ctx.stroke();
	this.ctx.fillStyle = 'rgba(0,0,0,0.75)';
	this.ctx.beginPath();
	this.ctx.arc(this.xpos(where), this.ypos(this.buckets[where]), 4, 0, Math.PI*2, true);
	this.ctx.fill();
	this.ctx.fillStyle = 'rgba(255,255,255,0.75)';
	this.ctx.beginPath();
	this.ctx.arc(this.xpos(where), this.ypos(this.buckets[where]), 3, 0, Math.PI*2, true);
	this.ctx.fill();
}

PerfGraph.prototype.stopstart = function()
{
	if (stopped) {
		window.requestAnimationFrame(handler);
		prev = window.performance.now();
		start += prev - stopped;
		document.getElementById('stop').value = 'Stop';
		stopped = 0;
	} else {
		document.getElementById('stop').value = 'Start';
		stopped = window.performance.now();
	}
}

PerfGraph.prototype.resize_handler = function()
{
	size_x = Math.round((window.innerWidth - 0) / 1);
	self.bucket_count = Math.floor((size_x - self.border - self.border_right) / self.scale_x);
	self.buckets = new Array(self.bucket_count);
	self.buckets_draw = new Array(self.bucket_count);
	self.canvas.width = self.canvas_width();
	self.canvas.style.width = self.canvas_width() + "px";
	for (var i = 0; i < self.bucket_count; i++)
	{
		self.buckets[i] = 0;
		self.buckets_draw[i] = 0;
	}
}

