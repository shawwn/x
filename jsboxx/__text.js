"use strict";

µ.pad_text = function (maxlen, text)
{
	text = ''+text;
	var len = text.length;
	if (len < maxlen)
	{
		for (var i = 0; i < maxlen-len; i++)
		{
			text = ' ' + text;
		}
	}
	else if (len > maxlen)
	{
		text = text.substr(0,maxlen);
	}
	return text;
}

µ.random_char = function (char_string)
{
	return char_string.substr(µ.rand_int(char_string.length-1), 1);
}