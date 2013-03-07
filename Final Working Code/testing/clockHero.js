var clockHero = function()
{
	var parent = $("#fancyClock")
		.append($("<div>")
			.attr({"class": "clockHero", "id": "minuteClockHero"}))
		.append($("<div>")
			.attr({"class": "clockHero", "id": "secondClockHero"}));

	var minuteClockHero = $("#minuteClockHero");
	var	secondClockHero = $("#secondClockHero");

	var currentTime = 120,
		clockInterval;

	var callbacks = [];

	var tick = function()
	{
		var minutes = Math.floor( currentTime / 60 ),
			seconds = currentTime - minutes*60;

		var minuteString = minutes < 10 ? "<h1> 0" + minutes + "</h1>" : "<h1>" + minutes + "</h1>",
			secondString = seconds < 10 ? "<h1> 0" + seconds + "</h1>" : "<h1>" + seconds + "</h1>";

		minuteClockHero.html(minuteString);
		secondClockHero.html(secondString);
		currentTime -= 1;

	}.bind(this) 
	
	var fireCallbacks = function()
	{
		for (var i = 0; i < callbacks.length; i ++)
		{
			callbacks[i]();
		}
	}

	var zero = function()
	{
		if (currentTime === 0)
		{
			this.stopClock();
			fireCallbacks();
		}
		return false;
	}.bind(this);

	this.stopClock = function()
	{
		window.clearInterval(clockInterval);
	}

	this.registerCallback = function(callback)
	{
		callbacks.push(callback);
	}

	this.startClock = function(minutes, seconds)
	{
		currentTime = minutes*60 + seconds;
		clockInterval = window.setInterval(
			function()
			{
				tick();
				zero();
			}, 1000);
	}
}