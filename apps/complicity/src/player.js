btx.Player = function()
{
	this.controlled_person = -1;
}

btx.Player.prototype.control_person = function(person_id)
{
	console.log('player assumes control', this.controlled_person, person_id);
	
	if (this.controlled_person == person_id)
	{
		btx.persons.persons[this.controlled_person].controlled_by_player = false;
		this.controlled_person = -1
	}
	else
	{
		if (this.controlled_person != -1)
		{
			btx.persons.persons[this.controlled_person].controlled_by_player = false;
		}
		if (person_id != -1)
		{
			btx.persons.persons[person_id].controlled_by_player = true;
		}
		this.controlled_person = person_id;
	}
}


btx.Player.prototype._ = function()
{
}

