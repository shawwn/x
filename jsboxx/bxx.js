"use strict";

var	µ = {};

µ.LOGLEVEL_SILENT = 0;
µ.LOGLEVEL_ERROR = 1;
µ.LOGLEVEL_WARNING = 2;
µ.LOGLEVEL_VERBOSE = 3;
µ.LOGLEVEL_DEBUG = 4;

µ.current_log_level = µ.LOGLEVEL_VEBOSE;

µ.log = function(message, log_level)
{
	if (log_level <= µ.current_log_level)
	{
		console.log(message);
	}
}

