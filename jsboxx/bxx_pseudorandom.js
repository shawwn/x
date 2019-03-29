"use strict";

µ.PRandom = function(a, c, m, seed) {
	this.a = a;
	this.c = c;
	this.m = m;
	this.x = seed;
};
µ.PRandom.prototype.seed = function(seed) {
	this.x = seed;
}
µ.PRandom.prototype.float = function(max) {
	this.x = (this.a * this.x + this.c) % this.m;
	//console.log('pr.float', max, (this.x / this.m) * max);
	return (this.x / this.m) * max;
};
µ.PRandom.prototype.int = function(max) {
	this.x = (this.a * this.x + this.c) % this.m;
	//console.log('pr.int', max, Math.floor((this.x / this.m) * (max + 1)));
	return Math.floor((this.x / this.m) * (max + 1));
};