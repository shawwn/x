drp.init = [
	function() {
		drp.now = 0;
		drp.scale = 1;
		
		drp.CON_LINES = 40;
		drp.CON_CPL = 80;
		
		drp.HUD_LINE = 0;

		drp.STATUS_LINE = drp.CON_LINES - 2;
		drp.MENU_LINE = drp.CON_LINES - 1;

		drp.cameras = new µ.Cameras2D(drp, window.innerWidth, window.innerHeight);

		drp.rand = new MersenneTwister(42);
		drp.audio = new µ.Audio();
	},

	function() {
		drp.con = new µ.Monospace_Console('bxx', drp.CON_CPL, drp.CON_LINES)
		drp.con.line_colors(drp.HUD_LINE, '#fff', '#000')
		drp.con.line_colors(drp.MENU_LINE, '#040', '#cec')
		drp.con.line_colors(drp.STATUS_LINE, '#802', '#fde')
		return 'input';
	},
	function() {
		drp.input = new µ.input(drp.con.container, drp.scale, drp.cameras);
		return 'game';
	},
	function() {
		drp.locations = new drp.Locations();
		drp.game = new drp.Game();
		return 'done!';
	},
];
	