var wave = function()
{
	var self = this;
	var QUALITY = 1;
	var WIDTH = 300 / QUALITY;//Math.floor( window.innerWidth / QUALITY );
	var HEIGHT = 375 / QUALITY;//Math.floor( window.innerHeight / QUALITY );
	var CANVAS_WIDTH = 300;//window.innerWidth;
	var CANVAS_HEIGHT = 375,//window.innerHeight,
        SIZE = WIDTH*HEIGHT,
        context, image, data,
        buffer1, buffer2, 
        tempbuffer, pointers, 
        userInteraction;

	this.init = function(parentID, id)
	{
		self._id = "waveid";
		self._class = "wave";

		if (typeof id != 'undefined')
		{
			self._id = id;
		}
		self._canvas = document.getElementById(self._id);
		if (!self._canvas)
		{
			self._canvas = document.createElement("canvas");
			self._canvas.setAttribute("id", self._id);
			self._canvas.setAttribute("class", self._class);
			self._canvas.width = WIDTH;
			self._canvas.height = HEIGHT;
			self._canvas.style.width = CANVAS_WIDTH + 'px';
			self._canvas.style.height = CANVAS_HEIGHT + 'px';
		}
		self._parentID = "waveParentID"
		if (typeof parentID != 'undefined')
		{
			self._parentID = parentID;
		}
		self._parent = document.getElementById(self._parentID);
		if (!self._parent)
		{
			self._parent = document.createElement("div");
			self._parent.setAttribute("id", self._parentID);
			self._parent.setAttribute("class", self._class);
			document.body.appendChild(self._parent);
		}

		self._parent.appendChild(self._canvas);

		context = self._canvas.getContext("2d");
		context.fillStyle = "rgb(20,155,223)";
		context.fillRect(0, 0, WIDTH, HEIGHT);
		image = context.getImageData(0, 0, WIDTH, HEIGHT);
		data = image.data;

		buffer1 = [];
		buffer2 = [];
		for (var i = 0; i < SIZE; i ++ )
		{
			// initialize all buffers to zero.
			buffer1[i] = 0;
			buffer2[i] = 0;
		}
		setInterval(self.loop, 1000/60);
	}

	this.kinectCallback = function(coords, _this)
	{
		userInteraction = true;
		var hipCenter = coords[0][heroKinectEngine.jnt("HIP_CENTER")];
		//var handLeft = coords[0][heroKinectEngine.jnt("HAND_LEFT")];
		//var handRight = coords[0][heroKinectEngine.jnt("HAND_RIGHT")];

		//handRight.x = heroKinectEngine.fixZeroTo200(handRight.x);
		//handRight.y = heroKinectEngine.fixZeroTo200(handRight.y);

		//handLeft.x = heroKinectEngine.fixZeroTo200(handLeft.x);
		//handLeft.y = heroKinectEngine.fixZeroTo200(handLeft.y);

		//hipCenter.x = heroKinectEngine.fixZeroTo200(hipCenter.x);
		//hipCenter.y = heroKinectEngine.fixZeroTo200(hipCenter.y);

		pointers = [[( ( hipCenter.x / 100 ) * CANVAS_WIDTH ) / QUALITY, 
					 ( ( hipCenter.y / 100 ) * CANVAS_HEIGHT ) / QUALITY],
					 [( ( (hipCenter.x + 1) / 100 ) * CANVAS_WIDTH ) / QUALITY, 
					 ( ( (hipCenter.y + 1) / 100 ) * CANVAS_HEIGHT ) / QUALITY],
					 [( ( (hipCenter.x - 1) / 100 ) * CANVAS_WIDTH ) / QUALITY, 
					 ( ( (hipCenter.y - 1) / 100 ) * CANVAS_HEIGHT ) / QUALITY],
					 [( ( (hipCenter.x + 1) / 100 ) * CANVAS_WIDTH ) / QUALITY, 
					 ( ( (hipCenter.y - 1) / 100 ) * CANVAS_HEIGHT ) / QUALITY],
					 [( ( (hipCenter.x - 1) / 100 ) * CANVAS_WIDTH ) / QUALITY, 
					 ( ( (hipCenter.y + 1) / 100 ) * CANVAS_HEIGHT ) / QUALITY],
					 [( ( (hipCenter.x + 2) / 100 ) * CANVAS_WIDTH ) / QUALITY, 
					 ( ( (hipCenter.y + 2) / 100 ) * CANVAS_HEIGHT ) / QUALITY],
					 [( ( (hipCenter.x - 2) / 100 ) * CANVAS_WIDTH ) / QUALITY, 
					 ( ( (hipCenter.y - 2) / 100 ) * CANVAS_HEIGHT ) / QUALITY],
					 [( ( (hipCenter.x + 2) / 100 ) * CANVAS_WIDTH ) / QUALITY, 
					 ( ( (hipCenter.y - 2) / 100 ) * CANVAS_HEIGHT ) / QUALITY],
					 [( ( (hipCenter.x - 2) / 100 ) * CANVAS_WIDTH ) / QUALITY, 
					 ( ( (hipCenter.y + 2) / 100 ) * CANVAS_HEIGHT ) / QUALITY]];

					//[( ( handLeft.x / 200 ) * CANVAS_WIDTH ) / QUALITY ,
					 //( ( handLeft.y / 200 ) * CANVAS_HEIGHT )/ QUALITY ],
					//[( ( handRight.x / 200) * CANVAS_WIDTH ) / QUALITY ,
					 //( ( handRight.y / 200) * CANVAS_HEIGHT) / QUALITY ]];
	}

	this.setWidth = function(width)
	{
		WIDTH = width;
		self._canvas.width = width;
		self._canvas.style.width = width + 'px';
		SIZE = WIDTH * HEIGHT;
	}

	this.setHeight = function(height)
	{
		HEIGHT = height;
		self._canvas.height = height;
		self._canvas.style.height = height + 'px';
		SIZE = WIDTH * HEIGHT;
	}

	this.ripple = function(x, y)
    {
      buffer1[ Math.floor(x) + (Math.floor(y) * WIDTH)] = 255;
    }

	this.loop = function()
    {
		if (userInteraction)
		{
			for (var i = 0; i < pointers.length; i ++ )
			{
				self.ripple(pointers[i][0], pointers[i][1]);
			}
		}
		var pixel;
		var iMax = (WIDTH * HEIGHT) - WIDTH;

		for ( var i = WIDTH; i < iMax; i ++ )
		{
			pixel = ((buffer1[i - 1] + buffer1[i + 1] + buffer1[i - WIDTH] + buffer1[i + WIDTH]) >> 1) - buffer2[i];
			pixel -= pixel >> 30;

			buffer2[i] = pixel;
          
			pixel = pixel > 255 ? 255 : pixel < 0 ? 0 : pixel;

			data[ (i * 4) + 0 ] = pixel;
			//data[ (i + 4) + 1] = pixel < 219 ? 219 : pixel;
			data[ ((i + 1) * 4) + 2 ] = 223;

			//data[ (i * 4) + 0 ] = pixel*2;
			//data[ ((i + 1) * 4) + 2 ] = pixel*0.3;
			//data[ (i * 4) + 1 ] = pixel*0.8;      		
        }

        tempbuffer = buffer1;
        buffer1 = buffer2;
        buffer2 = tempbuffer;
        context.putImageData(image, 0, 0);
    }
}