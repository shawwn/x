µ.Monospace_Console = function(parent_el_id, width, height)
{
	this.container = document.createElement('pre');
	this.lines = [];
	
	for (var y = 0; y < height; y++)
	{
		this.lines.push(document.createElement('div'));
		this.container.appendChild(this.lines[y]);
	}
	document.getElementById(parent_el_id).appendChild(this.container);
};

µ.Monospace_Console.prototype.write_line = function(line_y, text)
{
	this.lines[line_y].innerHTML = text;
}

µ.Monospace_Console.prototype.line_colors = function(line_y, bg, fg)
{
	this.lines[line_y].style = 'color:'+fg+';background:'+bg+';';
}
