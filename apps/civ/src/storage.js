'use strict';

civ.Storage = function(max_amount, bucket_count, spoilage_frequency)
{
	this.bucket_count 		= bucket_count;
	this.spoilage_frequency = spoilage_frequency;
	this.next_spoilage		= spoilage_frequency;
	this.buckets	 		= new Float32Array(bucket_count);
}

civ.Storage.prototype.think = function(time_delta)
{
	this.next_spoilage		-= time_delta;
	if (this.next_spoilage <= 0 && this.spoilage_frequency > 0)
	{
		this.spoil();
		this.next_spoilage = this.spoilage_frequency;
	}
}

civ.Storage.prototype.spoil = function()
{
	for (var i = this.bucket_count - 1; i > 0; i--)
	{
		this.buckets[i] = this.buckets[i-1];
	}
	this.buckets[0] = 0;
}

civ.Storage.prototype.put = function(amount)
{
}

civ.Storage.prototype.put = function(amount)
{
	this.buckets[0] += amount;
}

civ.Storage.prototype.get = function(amount)
{
	var amount_taken = 0;
	var amount_to_take = amount;
	for (var i = bucket_count - 1; i >= 0 && amount_to_take > 0; i--)
	{
		amount_here = Math.min(this.buckets[i], amount_to_take);
		this.buckets[i] -= amount_here;
		amount_to_take -= amount_here;
		amount_taken += amount_here;
	}
	return amount_taken;
}
