var timeHero = function()
{
	var callbacks = [];
	var currentTime = 0;
	var timer;

	var fireCallbacks = function()
	{
		for (var i = 0; < callbacks.length; i ++)
		{
			callbacks[i](currentTime);
		}
	}.bind(this);
	
	var checkFinished = function()
	{
		if (currentTime === 0)
		{
			this.stopWatch();
		}
	}.bind(this);

	this.registerCallback = function(callback)
	{
		callbacks.push(callback);
	}

	this.startWatch = function(minutes, seconds)
	{
		currentTime = (minutes*60) + seconds;
		timer = window.setInterval(function()
		{
			fireCallbacks();
			checkFinished();
			currentTime = currentTime - 1;
		}, 1000);
	}

	this.stopWatch = function()
	{
		window.clearInterval(timer);
	}
}