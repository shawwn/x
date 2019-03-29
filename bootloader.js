"use strict";

var Bootloader = function(title, script_paths)
{
	this.scripts_to_go = 0;
	for (var i in script_paths)
	{
		this.scripts_to_go += script_paths[i].length;
	}
	this.script_paths = script_paths;
	this.batch_to_go = 0;
	this.batch_total = 0;
	this.scripts_total = this.scripts_to_go;
	var tmp = document.createElement('div');
	tmp.setAttribute('id', 'bxx');
	document.body.appendChild(tmp);

	this.progress_div = document.createElement('div');
	this.progress_div.style.position = 'fixed';
	this.progress_div.style.zIndex = '5';
	this.progress_div.style.left = '2%';
	this.progress_div.style.borderRadius = '7px';
	this.progress_div.style.width = '96%';
	this.progress_div.style.height = '50px';
	this.progress_div.style.top= '20px';
	this.progress_div.style.boxShadow = '0px 0px 25px #f00';
	this.progress_div.style.padding = '20px 3px';
	this.progress_div.style.fontWeight = '700';
	this.progress_div.style.background= '#c00';
	this.progress_div.style.color= '#000';
	this.progress_div.style.webkitTransition = 'opacity .15s ease-in-out';
	this.progress_div.style.MozTransition="opacity .15s ease-in-out"
	this.progress_div.style.transition = 'opacity .15s ease-in-out';

	this.progress_title = document.createElement('div');
	this.progress_title.style.position = 'fixed';
	this.progress_title.style.top = '28px';
	this.progress_title.style.left = '5%';
	this.progress_title.style.width = '40%';
	this.progress_title.style.opacity = '0.95';
	this.progress_title.style.borderRadius = '5px';
	this.progress_title.style.padding = '2px';
	this.progress_title.style.zIndex = '2';
	this.progress_title.style.color = '#fff';
	this.progress_title.style.fontSize = '17px';
	this.progress_title.style.fontWeight = '400';
	this.progress_title.style.lineHeight = '100%';
	this.progress_title.style.fontFamily = 'Tahoma';
	this.progress_title.style.textShadow = '1px 1px 2px hsla(0,0%,0%,0.75)';
	this.progress_title.innerHTML = 'Loading '+ title + '...';

	this.inner_div = document.createElement('div');
	this.inner_div.style.background = '#ee0';
	this.inner_div.style.boxShadow = '0px 0px 25px #ff0';
	this.inner_div.style.borderRadius = '7px';
	this.inner_div.style.width = '0%';
	this.inner_div.style.height = '100%';
	this.inner_div.style.position = 'absolute';
	this.inner_div.style.top = '0px';
	this.inner_div.style.left = '0px';

	this.inner_div2 = document.createElement('div');
	this.inner_div2.style.background = '#0c0';
	this.inner_div2.style.boxShadow = '0px 0px 25px #0f0';
	this.inner_div2.style.borderRadius = '7px';
	this.inner_div2.style.width = '0%';
	this.inner_div2.style.height = '100%';
	this.inner_div2.style.position = 'absolute';
	this.inner_div2.style.top = '0px';
	this.inner_div2.style.left = '0px';
	this.progress_div.appendChild(this.progress_title);
	this.progress_div.appendChild(this.inner_div);
	this.progress_div.appendChild(this.inner_div2);
	document.body.appendChild(this.progress_div);
	
	var to_load = {};

	function append_scripts(paths)
	{
		bootloader.batch_to_go = bootloader.batch_total = paths.length;
		for (var i in paths)
		{
			append_script(paths[i]);
		}
	}

	function append_script(path)
	{
		var tmp;
		tmp = document.createElement('script');
		tmp.setAttribute('src', path);
		tmp.setAttribute('type', 'text/javascript');
		to_load[path] = path;
		tmp.onload = function()
		{
			bootloader.scripts_to_go--;
			bootloader.batch_to_go--;
			delete to_load[path];
			var blergh = 0,
				snippet = '';
			// list all files left to load
			for (var i in to_load)
			{
				snippet = snippet + '<br>' + to_load[i];
			}
			bootloader.progress_title.innerHTML = 'Loading <b>'+ title + '</b> (' + Math.round(bootloader.scripts_to_go / bootloader.scripts_total)
				+ '%)<div style="margin-top:3em;text-align:right;font-size:0.8em;background:hsla(0,0%,100%,0.1);border-radius:0.2em;">' + snippet + '</div>';
			var bar = 100 * ((bootloader.scripts_total - bootloader.scripts_to_go) / bootloader.scripts_total)


			bar = bar * ((bootloader.batch_total - bootloader.batch_to_go) / bootloader.batch_total)

			bootloader.inner_div.style.width = bar + '%';
			bootloader.inner_div.style.boxShadow = '0px 0px '+((100 - bar) / 2)+'px '+((100 - bar) / 8)+'px #ff0';

			bootloader.progress_div.style.boxShadow = '0px 0px ' + Math.round((100 - bar) / 4)+'px #f00';

			bootloader.inner_div2.style.boxShadow = '0px 0px '+(bar / 2)+'px '+(bar / 8)+'px #0f0';
			bootloader.inner_div2.style.width = bar + '%';
			bootloader.inner_div2.style.width = bar + '%';
			// done!
			if (bootloader.scripts_to_go === 0)
			{
				// prepare for the second init stage (specific to the app, and communicated back via refresh())
				bootloader.progress_div.style.background= '#008';
				bootloader.progress_div.style.background = '-webkit-linear-gradient(top, #11f 0%, #00e 15%, #008 85%,#007 100%)';
				bootloader.progress_div.style.background = '-moz-linear-gradient(top, #11f 0%, #00e 15%, #008 85%,#007 100%)';
				bootloader.progress_div.style.background = 'linear-gradient(top, #11f 0%, #00e 15%, #008 85%,#007 100%)';
				bootloader.progress_div.style.boxShadow = '0px 0px 25px #00f';
				var hue = 20;
				bootloader.inner_div.style.background = '-webkit-linear-gradient(top, hsl('+hue+',100%,70%) 0%, hsl('+hue+',100%,50%) 15%, hsl('+hue+',100%,30%) 85%, hsl('+hue+',100%,20%) 100%)';
				bootloader.inner_div.style.background = '-moz-linear-gradient(top, hsl('+hue+',100%,70%) 0%, hsl('+hue+',100%,50%) 15%, hsl('+hue+',100%,30%) 85%, hsl('+hue+',100%,20%) 100%)';
				bootloader.inner_div.style.background = 'linear-gradient(top, hsl('+hue+',100%,70%) 0%, hsl('+hue+',100%,50%) 15%, hsl('+hue+',100%,30%) 85%, hsl('+hue+',100%,20%) 100%)';
				bootloader.inner_div.style.boxShadow = '0px 0px 5px #ff0';

				bootloader.inner_div2.style.background = '#804';
				bootloader.inner_div2.style.background = '-webkit-linear-gradient(top, #f4a 0%, #f08 15%, #a05 85%,#904 100%)';
				bootloader.inner_div2.style.background = '-moz-linear-gradient(top, #f4a 0%, #f08 15%, #a05 85%,#904 100%)';
				bootloader.inner_div2.style.background = 'linear-gradient(top, #f4a 0%, #f08 15%, #a05 85%,#904 100%)';
				bootloader.inner_div2.style.boxShadow = '0px 0px 5px #f4c';
				bootloader.inner_div2.style.width = '50%';

			}
			else if (bootloader.batch_to_go === 0)
			{
				var next_batch = bootloader.script_paths.shift();
				if (next_batch)
				{
					append_scripts(next_batch);
				}
				else
				{
					alert( '??? unexpected bootloader failure');
				}
			}
		};
		document.body.appendChild(tmp);
	}
	function refresh(progress, text, step_progress)
	{
		var hue = Math.round(20 + 60 * progress);
		bootloader.inner_div.style.background = '-webkit-linear-gradient(top, hsl('+hue+',100%,70%) 0%, hsl('+hue+',100%,50%) 15%, hsl('+hue+',100%,30%) 85%, hsl('+hue+',100%,20%) 100%)';
		bootloader.inner_div.style.background = '-moz-linear-gradient(top, hsl('+hue+',100%,70%) 0%, hsl('+hue+',100%,50%) 15%, hsl('+hue+',100%,30%) 85%, hsl('+hue+',100%,20%) 100%)';
		bootloader.inner_div.style.background = 'linear-gradient(top, hsl('+hue+',100%,70%) 0%, hsl('+hue+',100%,50%) 15%, hsl('+hue+',100%,30%) 85%, hsl('+hue+',100%,20%) 100%)';
		bootloader.inner_div.style.width = (50 + (50 * progress)) + '%';
		bootloader.inner_div.style.boxShadow = '0px 0px ' + (5 + 40 * progress) + 'px ' + (5 + 5 * progress) + 'px hsl('+hue+',100%,40%)';

		var hue = Math.round(20 + 60 * step_progress);

		var suffix = (step_progress < 1.0) ? '<div style="width:'+(100)+'%;height:10px;background:hsla(0,0%,0%,0.1);">'

		+'<div style="width:'+(100 * progress)+'%;height:5px;background:hsla(0,0%,0%,0.2);">&nbsp;</div>'
		+'<div style="width:'+(100 * step_progress)+'%;height:5px;background:hsla(0,0%,20%,0.2);">&nbsp;</div>'
		+'</div>' : '';

		if (text)
		{
			bootloader.progress_title.innerHTML = 'Initializing <b>'+ title + suffix + '</b><div style="font-weight:800;color:#ff0;text-align:right;font-family:Tahoma;line-height:90%;"><br>' + text + '</div>';
		}
		else
		{
			bootloader.progress_title.innerHTML = 'Initializing <b>'+ title + suffix + '<br />' + text +'</b>';
		}
		if (progress >= 1)
		{
			bootloader.done();
		}
	}
	function done()
	{
		bootloader.progress_div.style.opacity = '0';
		setTimeout(remove, 50);
	}
	function remove()
	{
		bootloader.progress_div.parentNode.removeChild(bootloader.progress_div);
		bootloader = {};
	}
	return {
		go: function () {append_scripts(bootloader.script_paths.shift());},
		done: done,
		refresh: refresh,
		script_paths: this.script_paths,
		progress_div: this.progress_div,
		progress_title: this.progress_title,
		inner_div: this.inner_div,
		inner_div2: this.inner_div2,
		inner_div_sub: this.inner_div_sub,
		batch_to_go: this.batch_to_go,
		scripts_to_go: this.scripts_to_go,
		scripts_total: this.scripts_total,
	};
}