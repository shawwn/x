µ.Accumulating_Graph = function(bucket_count, bucket_size, bucket_sizes, avg_mode, carry_over_mode)
{
	this.bucket_count = bucket_count;
	this.bucket_size = bucket_size;
	this.avg_mode = avg_mode;
	this.carry_over_mode = carry_over_mode;

	this.bucket_sizes = bucket_sizes;

	this.buckets = new Array(bucket_count);
	this.bucket_indices = new Array(bucket_count);
	for (var i = 0; i < bucket_count; i++)
	{
		if (this.bucket_sizes[i] == undefined)
		{
			this.bucket_sizes[i] = bucket_size;
		}
		this.buckets[i] = new Array(this.bucket_sizes[i]);
		for (var j = 0; j < this.bucket_sizes[i]; j++)
		{
			this.buckets[i][j] = Math.random() * 0.0;
		}
		this.bucket_indices[i] = 0;
	}
};

µ.Accumulating_Graph.prototype.accum_bucket = function(bucket_id)
{
	var accum = 0;
	for (var j = 0; j < this.bucket_sizes[bucket_id]; j++)
	{
		accum += this.buckets[bucket_id][j];
	}
	return accum / this.bucket_sizes[bucket_id];
};


µ.Accumulating_Graph.prototype.median_bucket = function(bucket_id)
{
	var values = this.buckets[bucket_id].concat();
    values.sort( function(a,b) {return a - b;} );
    var half = Math.floor(values.length/2);
    if(values.length % 2)
        return values[half];
    else
        return (values[half-1] + values[half]) / 2.0;
};

µ.Accumulating_Graph.prototype.put = function(value)
{
	this.put_bucket(0, value);
};

µ.Accumulating_Graph.prototype.put_bucket = function(bucket_id, value)
{
	var bucket_index = this.bucket_indices[bucket_id];

	if (
			(this.avg_mode == 0 && this.bucket_indices[bucket_id] == 0)
		||
			(this.avg_mode > 0 && !(bucket_index % this.avg_mode))
		)
	{ 
		if (bucket_id < this.bucket_count - 1)
		{
			// average
			if (this.carry_over_mode == 0)
			{
				var overflow = this.accum_bucket(bucket_id);
				this.put_bucket(bucket_id + 1, overflow);
			}
			// just carry over the current one (usefulness doubtful)
			else if (this.carry_over_mode == 1)
			{
				this.put_bucket(bucket_id + 1, this.buckets[bucket_id][bucket_index]);
			}
			// median
			else if (this.carry_over_mode == 2)
			{
				this.put_bucket(bucket_id + 1, this.median_bucket(bucket_id));
			}
			// min
			else if (this.carry_over_mode == 3)
			{
				this.put_bucket(bucket_id + 1, Math.min(...this.buckets[bucket_id]));
			}
			// max
			else if (this.carry_over_mode == 4)
			{
				this.put_bucket(bucket_id + 1, Math.max(...this.buckets[bucket_id]));
			}
		}
	}

	this.buckets[bucket_id][bucket_index] = value;
	bucket_index++;
	if (bucket_index == this.bucket_sizes[bucket_id])
	{
		bucket_index = 0;
	}
	this.bucket_indices[bucket_id] = bucket_index;
};
