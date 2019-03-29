"use strict";

bootloader.done();

var etypes_array = []
for (var i in lgg.etypes)
{
	lgg.etypes[i].id = i;
	etypes_array.push(lgg.etypes[i]);
}

if (window.location.hash)
{
	var criterion = window.location.hash.substring(1);
}
else
{
	var criterion = 'danger';
}

etypes_array.sort(function compare(a, b) {
  if (a[criterion] < b[criterion]) {
    return 1;
  }
  if (a[criterion] > b[criterion]) {
    return -1;
  }
  // a must be equal to b
  return 0;
});

var criteria = [
	'id',
	'title',
	'danger',
	'weight',
	'probability',
	'spawn_min',
	'spawn_max',
	'batch_min',
	'batch_max',
	'armour',
	'shield',
	'linger_min',
	'linger_max',
	'combined',
	'description',
	'attack count',
	'highest attack damage',
];
var el = document.createElement('div');

el.setAttribute('class', 'lgg');

var text = '<table style="background:#fff;color:#000;">';
text += '<tr>';
text += '<th>#</th>';
for (var i = 0; i < criteria.length; i++ )
{
	text += '<th><a onclick="window.location = \'#'+ criteria[i] +'\';window.location.reload(false);" href="#'+ criteria[i] +'">'+ criteria[i] +'</a></th>';
}
text += '</tr>';

for (var i = 0, len = etypes_array.length; i < len; i++)
{
	var etype = etypes_array[i];
	text += '<tr>';
	text += '<td>' + (i+1) + '</td>';
	text += '<td>' + etype.id + '</td>';
	text += '<td>' + etype.title + '</td>';
	text += '<td>' + etype.danger + '</td>';
	text += '<td>' + etype.weight + '</td>';
	text += '<td>' + etype.probability + '</td>';
	text += '<td>' + (Math.round(etype.spawn_min / 1000 * 10) / 10) + '</td>';
	text += '<td>' + (Math.round(etype.spawn_max / 1000 * 10) / 10) + '</td>';
	text += '<td>' + etype.batch_min + '</td>';
	text += '<td>' + etype.batch_max + '</td>';
	text += '<td>' + (Math.round(1 / etype.armour * 10) / 10) + '</td>';
	text += '<td>' + (Math.round(etype.shield * 10) / 10) + '</td>';
	text += '<td>' + (Math.round(etype.linger_min / 1000 * 10) / 10) + '</td>';
	text += '<td>' + (Math.round(etype.linger_max / 1000 * 10) / 10)+ '</td>';
	
	text += '<td>' + ((1 / etype.armour) + etype.shield)  + '</td>';
		
	text += '<td>' + etype.description + '</td>';
	
	var highest_attack_damage = 0;
	for (var j = 0, len2 = etype.attacks.length; j < len2; j++)
	{
		if (highest_attack_damage < etype.attacks[j].damage)
		{
			highest_attack_damage = etype.attacks[j].damage;
		}
	}
	text += '<td>' + etype.attacks.length + '</td>';
	
	text += '<td>' + highest_attack_damage + '</td>';
	
	
	text += '</tr>';
/*
	text += '<td>' + etype. + '</td>';
*/
}
text += '</table>';



text += '<table style="background:#fff;color:#000;">';

text += '<tr>';
text += '<td colspan=3>100 + round_to(70 * i + 10 * Math.pow(1.12, i), 20)</td>';
text += '<td colspan=3>150 + round_to(1500* i + 20* Math.pow(1.12, i), 20)</td>';
text += '</tr>';


for (var i = 0; i < 50; i++ )
{
	text += '<tr>';

	text += '<td>' + i + '</td>';
	var j = i - 1;
	var val = 				100 + µ.round_to(70 * i + 10 * Math.pow(1.12, i), 20);
	var val_prev = i > 0 ? 	100 + µ.round_to(70 * j + 10 * Math.pow(1.12, j), 20) : val;
	text += '<td>' + Math.round(val) + '</td>';
	text += '<td>' + Math.round(val - val_prev) + '</td>';

	text += '<td>' + i + '</td>';
	var j = i - 1;
	var val = 				150 + µ.round_to(100 * i + 20 * Math.pow(1.12, i), 20);
	var val_prev = i > 0 ? 	150 + µ.round_to(100 * j + 20 * Math.pow(1.12, j), 20) : val;
	text += '<td>' + Math.round(val) + '</td>';
	text += '<td>' + Math.round(val - val_prev) + '</td>';

	text += '</tr>';
}

el.innerHTML = text;


//window.location.reload(false);

document.body.appendChild(el);
