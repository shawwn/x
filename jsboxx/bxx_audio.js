/*
with unspeakable gratitude to: https://github.com/greggman/html5bytebeat
I started by ripping away everything but ByteBeat, and had audio within seconds o_O
This is 100% cargo cult programming; I have no idea what any of this does, but I love it :D
*/
µ.Audio_Loop = function()
{
	this.reset();
}
µ.Audio_Loop.prototype.reset = function()
{
	this.active = false;
	this.volume = 1;
	this.funcL = null;
	this.funcR = null;
	this.vars = [];
	this.vars_next = [];
	this.inertia = [];
}
µ.Audio_Ear = function()
{
	this.reset();
}
µ.Audio_Ear.prototype.reset = function()
{
	this.volume = 1;
	this.pos_x = 0;
	this.pos_r = 0;
}
µ.Audio = function()
{
	this.buffer_size = 4096; // this is the minimum? for real?! audio latency in chrome sucks, but otherwise it's so smooth.. :(
	this.buffer0 = new Float32Array(this.buffer_size);
	this.buffer1 = new Float32Array(this.buffer_size);
	this.desiredSampleRate = 44100;
	this.time = 0;
	this.chunk_count = 0;
	this.last_data_length = 0;
	this.biggest_chunk = 0;
	this.total_chunk_samples = 0;
	this.expandMode = true;
	this.playing_sounds = [];
	this.sampled_sounds = [];
	this.max_registered_sounds = 32;
	this.registered_sounds = new Array(this.max_registered_sounds);
	for (var i = 0; i < this.max_registered_sounds; i++)
	{
		this.registered_sounds[i] = new µ.Audio_Loop();
	}
	this.setup();
};
µ.Audio.prototype.register_sound = function(soundL, soundR)
{
	for (var i = 0; i < this.max_registered_sounds; i++)
	{
		if (!this.registered_sounds[i].active)
		{
			this.registered_sounds[i].reset();
			this.registered_sounds[i].active = true;
			this.registered_sounds[i].funcL = soundL;
			this.registered_sounds[i].funcR = soundR;
			return i;
		}
	}
	return -1;
}
µ.Audio.prototype.set_sound_var = function(sound_id, variable, value)
{
	var sound = this.registered_sounds[sound_id];
	if (sound.vars[variable] == undefined)
	{
		sound.vars[variable] = value;
		sound.inertia[variable] = 1000;
	}
	sound.vars_next[variable] = value;
}
µ.Audio.prototype.set_sound_var_inertia = function(sound_id, variable, inertia)
{
	this.registered_sounds[sound_id].inertia[variable] = inertia;
}
µ.Audio.prototype.unregister_sound = function(sound_id)
{
	// todo: autofade?
	this.registered_sounds[sound_id].reset();
}

µ.Audio.prototype.sample_sound = function(duration, rate, soundL, soundR)
{
	var actual_duration = Math.ceil(duration * this.actualSampleRate)
	var actual_duration_rate = Math.ceil(duration * this.actualSampleRate * rate)
	
	//Float32Array
	var bufferL = new Array(actual_duration);
	var bufferR = new Array(actual_duration);

	var subtick = 0;
	var lastValueL = 0;
	var lastValueR = 0;
	var last_tick = 0;
	var this_tick = 0;
	
	console.log(actual_duration, actual_duration_rate);

	for (var i = 0; i < actual_duration; ++i)
	{
		bufferL[i] = 0;
		bufferR[i] = 0;
		subtick += rate; // increase subtick

		this_tick = Math.floor(subtick);

		if (last_tick == subtick)
		{
			bufferL[i] += lastValueL;
			bufferR[i] += lastValueR;
		}
		else
		{
			var this_time = last_tick;
			lastValueL = soundL(this_time, actual_duration_rate - 1);
			bufferL[i] += lastValueL;
			if (soundR)
			{
				lastValueR = soundR(this_time, actual_duration_rate - 1);
			}
			else
			{
				lastValueR = lastValueL;
			}
			bufferR[i] += lastValueR;
		}
		last_tick = this_tick;
	}
	
	for (var i = actual_duration - 20; i < actual_duration; ++i)
	{
		console.log(bufferR[i]);
	}

	this.sampled_sounds.push([
		actual_duration,
		actual_duration_rate,
		rate,
		bufferL,
		bufferR
	]);
	return (this.sampled_sounds.length - 1);
}

µ.Audio.prototype.play_sampled_sound = function(sampled_sound_id, rate)
{
	var sampled_sound = this.sampled_sounds[sampled_sound_id];
	this.playing_sounds.push([
		this.convertToDesiredSampleRate(this.time),
		Math.ceil(sampled_sound[1]),
		Math.ceil(sampled_sound[1] * rate), //sampled_sound[1],
		rate,// * sampled_sound[2],
		0,					// subtick
		0,					// last_tick
		0,					// last L value
		0,					// last R value
		undefined,
		undefined,
		sampled_sound[3],	// bufferL
		sampled_sound[4]	// bufferR
	]);
}

µ.Audio.prototype.play_sound = function(duration, rate, soundL, soundR)
{
	this.playing_sounds.push([
		this.convertToDesiredSampleRate(this.time),
		Math.ceil(duration * this.actualSampleRate),
		Math.ceil(duration * this.actualSampleRate * rate),
		rate,
		0,		// subtick
		0,		// last_tick
		0,		// last L value
		0,		// last R value
		soundL,
		soundR,
		undefined,	// bufferL
		undefined	// bufferR
	]);
};
µ.Audio.prototype.reset = function() {
  this.time = 0;
};
µ.Audio.prototype.convertToDesiredSampleRate = function(rate) {
  return Math.floor(rate * this.desiredSampleRate / this.actualSampleRate);
};
µ.Audio.prototype.getDesiredSampleRate = function() {
  return this.desiredSampleRate;
};
µ.Audio.prototype.process = function(dataLength, leftData, rightData)
{
	this.chunk_count++;
	this.total_chunk_samples += dataLength;
	if (dataLength > this.biggest_chunk) this.biggest_chunk = dataLength;
	var time = this.convertToDesiredSampleRate(this.time);
	var lastSample = this.convertToDesiredSampleRate(dataLength) + 2;
	/*
	if (time % 3000 < 150) console.log(
		dataLength,
		//this.chunk_count,
		//this.total_chunk_samples,
		this.biggest_chunk,
		Math.round(this.total_chunk_samples / this.chunk_count));
	*/
	if (this.buffer0.length < lastSample)
	{
		console.log('expanding audio buffer from ' + this.buffer0.length + ' to ' + lastSample + '!');
		this.buffer0 = new Float32Array(lastSample);
		this.buffer1 = new Float32Array(lastSample);
	}
/*
	not doing this may hurt performance, but it also allows displaying the buffer super easily
	var buffer0 = this.buffer0;
	var buffer1 = this.buffer1;
*/
/*
	this.playing_sounds.push([
0		this.convertToDesiredSampleRate(this.time),
1		Math.ceil(duration * this.actualSampleRate),
2		Math.ceil(duration * this.actualSampleRate * rate),
3		rate,
4		0,		// subtick
5		0,		// last_tick
6		0,		// last L value
7		0,		// last R value
8		soundL,
9		soundR
10		undefined,	// bufferL
11		undefined	// bufferR
	]);*/

	for (var i = 0; i < lastSample; ++i)
	{
		this.buffer0[i] = 0;
		this.buffer1[i] = 0;
	}

	// I don't even fucking know how/why this works anymore o_O
	var playing = false;
	for (var s = 0; s < this.playing_sounds.length; s++)
	{
		var ps = this.playing_sounds[s];
		for (var i = 0; i < lastSample; ++i)
		{
			if (time + i - ps[0] <= ps[1] - 0)
			{
				playing = true;
				ps[4] += ps[3]; // increase subtick
				var last_tick = ps[5];
				ps[5] = Math.floor(ps[4]);
				if (last_tick == ps[5])
				{
					this.buffer0[i] += ps[6];
					this.buffer1[i] += ps[7];
					//console.log(last_tick);
				}
				else
				{
					//console.log(last_tick, ps[5], this_time, ps[2]);
					var this_time = ps[5];
					if (ps[10])
					{
						ps[6] = ps[10][this_time];
					}
					else
					{
						ps[6] = ps[8](this_time, ps[2]);
					}
					if (ps[6])
						this.buffer0[i] += ps[6];
					if (ps[11])
					{
						ps[7] = ps[11][this_time];
					}
					else if (ps[9])
					{
						ps[7] = ps[9](this_time, ps[2]);
					}
					else
					{
						ps[7] = ps[6];
					}
					if (ps[7])
						this.buffer1[i] += ps[7];
				}
				//console.log('----', this.buffer0[i]);
			}
		}
	}
	
	if (playing)	for (var i = 0; i < lastSample; ++i)
	{
		//console.log('----', this.buffer0[i]);
	}

	for (var j = 0; j < this.max_registered_sounds; j++)
	{
		var rs = this.registered_sounds[j];
		if (rs.active)
		{
			for (var i = 0; i < lastSample; ++i)
			{
				var vars = [];
				var len = rs.vars.length;
				for (var k = 0; k < len; k++)
				{
					rs.vars[k] += (rs.vars_next[k] - rs.vars[k]) / rs.inertia[k];
				}
				var chanL = rs.funcL(time + i, rs.vars);
				this.buffer0[i] += chanL;
				if (rs.funcR)
				{
					this.buffer1[i] += rs.funcR(time + i, rs.vars);
				}
				else
				{
					this.buffer1[i] += chanL;
				}
			}
		}
	}
	
	for (var i = 0; i < lastSample; ++i)
	{
		var clip = Math.max(Math.abs(this.buffer0[i]), Math.abs(this.buffer1[i]));
		if (clip > 1)
		{
			this.buffer0[i] /= clip;
			this.buffer1[i] /= clip;
		}
		//time++;
	}

	for (var i = this.playing_sounds.length-1; i >= 0; i--)
	{
		if (time - this.playing_sounds[i][0] > this.playing_sounds[i][1])
		{
			this.playing_sounds.splice(i,1);
		}
	}
	if (dataLength)
	{
		var step = this.convertToDesiredSampleRate(dataLength) / dataLength;
		var ndx = 0;
		function interp(buf)
		{
			var n = Math.floor(ndx);
			var f = ndx % 1;
			var v0 = buf[n];
			var v1 = buf[n + 1];
			return v0 + (v1 - v0) * f;
		}
		function trunc(buf)
		{
			return buf[Math.floor(ndx)];
		}
		var expandFn = this.expandMode ? interp : trunc;
		if (rightData)
		{
			for (var i = 0; i < dataLength; ++i)
			{
				leftData[i] = expandFn(this.buffer0);
				rightData[i] = expandFn(this.buffer1);
				ndx += step;
			}
		}
		else
		{
			for (var i = 0; i < dataLength; ++i)
			{
				leftData[i * 2] = expandFn(this.buffer0);
				leftData[i * 2 + 1] = expandFn(this.buffer1);
				ndx += step;
			}
		}
	}
	this.time += dataLength;
	this.last_data_length = dataLength
};
µ.Audio.prototype.play = function()
{
	if (this.node) {
		this.node.connect(this.context.destination);
	}
};
µ.Audio.prototype.pause = function()
{
	if (this.node)
	{
		this.node.disconnect();
	}
};
µ.Audio.prototype.setup = function(sound)
{
	// it all needs to be redone
	return;

/*


	var that = this;
	if (window.webkitAudioContext)
	{
		this.context = new webkitAudioContext();
		this.node = this.context.createJavaScriptNode(this.buffer_size, 2, 2);
		//this.context = { };
		//this.node = {
		//  connect: function() { },
		//  disconnect: function() { }
		//};
		console.log('Audio init, using webkitAudioContext, sample rate ' + this.context.sampleRate);
		this.actualSampleRate = this.context.sampleRate;
		this.node.onaudioprocess = function(e)
		{
			var data = e.outputBuffer.getChannelData(0);
			that.process(data.length, data, e.outputBuffer.getChannelData(1));
		};
		this.node.connect(this.context.destination);
		this.initialized = true;
	}
	else
	{
		var audio = new Audio()
		this.audio = audio;
		if (!audio.mozSetup)
		{
			console.log('Audio init FAILED!');
			return;
		}
		console.log('Audio init, using mozSetup');
		this.initialized = true;
		function AudioDataDestination(sampleRate, readFn)
		{
			// Initialize the audio output.
			var audio = new Audio();
			var channels = 2
			audio.mozSetup(channels, sampleRate);
			var currentWritePosition = 0;
			var prebufferSize = sampleRate * channels / 4; // buffer 250ms
			var tail = null, tailPosition;
			// The function called with regular interval to populate
			// the audio output buffer.
			setInterval(function()
			{
				var written;
				// Check if some data was not written in previous attempts.
				if(tail)
				{
					written = audio.mozWriteAudio(tail.subarray(tailPosition));
					currentWritePosition += written;
					tailPosition += written;
					if(tailPosition < tail.length)
					{
						// Not all the data was written, saving the tail...
						return; // ... and exit the function.
					}
					tail = null;
				}
				// Check if we need add some data to the audio output.
				var currentPosition = audio.mozCurrentSampleOffset();
				var available = currentPosition + prebufferSize - currentWritePosition;
				if(available > 0)
				{
					// Request some sound data from the callback function.
					var soundData = new Float32Array(available);
					readFn(soundData);
					// Writting the data.
					written = audio.mozWriteAudio(soundData);
					if(written < soundData.length)
					{
						// Not all the data was written, saving the tail.
						tail = soundData;
						tailPosition = written;
					}
					currentWritePosition += written;
				}
			},2);
		}
		this.actualSampleRate = this.desiredSampleRate; // uhh
		var audioDestination = new AudioDataDestination(this.actualSampleRate, function(buffer)
		{
			that.process(buffer.length >> 1, buffer);
		});
	}
*/
}
