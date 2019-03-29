"use strict";

bootloader.done();

var ttypes_array = []

/*
for (var i in lgg.etypes)
{
	lgg.etypes[i].id = i;
	etypes_array.push(lgg.etypes[i]);
}
*/

for (var i = 0; i < civ.terrain_types.length; i++)
{
	civ.terrain_types[i].id = i;
	ttypes_array.push(civ.terrain_types[i]);
}


if (window.location.hash)
{
	var criterion = window.location.hash.substring(1);
}
else
{
	var criterion = 'danger';
}

ttypes_array.sort(function compare(a, b) {
  if (a[criterion] > b[criterion]) {
    return 1;
  }
  if (a[criterion] < b[criterion]) {
    return -1;
  }
  // a must be equal to b
  return 0;
});

var criteria = [
	'id',
	'name',
	'weight',
	'min_elevation',
	'max_elevation',
	'min_humidity',
	'max_humidity',
	'min_temperature',
	'max_temperature',
	'min_vegetation',
	'max_vegetation',
];
var el = document.createElement('div');


/*


civ.terrain_types[civ.TERRAIN_TYPE__DESERT] = {
	name:							'Desert',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__STONE,
	harvestable_resource1_amount: 	5,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							.1,
	min_elevation:					0.5,
	max_elevation:					0.75,
	min_humidity:					0,
	max_humidity:					0.3,
	min_temperature:				0.9,
	max_temperature:				1,
	min_vegetation:					0,
	max_vegetation:					1,
};
*/
el.setAttribute('class', 'civ');

var text = '<table style="background:#fff;color:#000;">';
text += '<tr>';
text += '<th>#</th>';
for (var i = 0; i < criteria.length; i++ )
{
	text += '<th><a onclick="window.location = \'#'+ criteria[i] +'\';window.location.reload(false);" href="#'+ criteria[i] +'">'+ criteria[i] +'</a></th>';
}
text += '</tr>';

ttypes_array = [];

for (var i = 0; i < ttypes_array.length; i++ )
{
	var ttype = ttypes_array[i];

	text += '<tr>';
	text += '<td>' + (i+1) + '</td>';
	for (var j in criteria)
	{
		text += '<td>' + ttype[criteria[j]] + '</td>';
	}
	text += '</tr>';
}
text += '</table>';


var tile_properties = 
[
	'humidity',
	'vegetation',
	'temperature',
	'height',
]

for (var a1 = 0; a1 < 2; a1++)
{
	for (var a2 = 0; a2 < 2; a2++)
	{
		for (var a3 = 0; a3 < 2; a3++)
		{
			for (var a4 = 0; a4 < 2; a4++)
			{
				text += 
					(a1 == 1 ? '<span style=color:white;>high ' : a1 == 2 ? '<span style=color:green;>' : '<span style=color:grey;>low ') + ' height</span> <span style=color:brown;>/</span> '+
					(a2 == 1 ? '<span style=color:white;>high ' : a2 == 2 ? '<span style=color:green;>' : '<span style=color:grey;>low ') + ' humidity</span> <span style=color:brown;>/</span> '+
					(a3 == 1 ? '<span style=color:white;>high ' : a3 == 2 ? '<span style=color:green;>' : '<span style=color:grey;>low ') + ' temperature</span> <span style=color:brown;>/</span> '+
					(a4 == 1 ? '<span style=color:white;>high ' : a4 == 2 ? '<span style=color:green;>' : '<span style=color:grey;>low ') + ' vegetation</span><br>';
			}
		}
	}
}


el.innerHTML = text;

//window.location.reload(false);

document.body.appendChild(el);

