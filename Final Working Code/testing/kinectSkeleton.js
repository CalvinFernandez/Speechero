function kinectSkeleton(id, parentID)
{
	// Our constructor.. broossss.
	if ( !document.getElementById(id) )
	{
		this._canvas = document.createElement("canvas");
		this._parent = document.getElementById(parentID).appendChild(this._canvas);
		this._canvas.width = 480;
		this._canvas.height = 640;
		this._canvas.style.width = 480 + 'px';
		this._canvas.style.height = 640 + 'px';
	}
	else
	{
		this._canvas = document.getElementById(id);
	}
	this._context = this._canvas.getContext("2d");
}

kinectSkeleton.prototype.kinectCallback = function(coords, _this)
{
	var self = _this;
	self._context.clearRect(0, 0, self._canvas.width, self._canvas.height);
	for (var i = 0; i < coords[0].length; i ++ )
	{
		self._context.beginPath();
		self._context.arc(coords[0][i].x, coords[0][i].y, 2, 0, 2 * Math.PI, false);
		self._context.fillStyle = 'red';
		self._context.fill();
	}
}