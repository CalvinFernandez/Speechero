var heroMath =
{
	mag3d: function(x1, x2)
	{
		return Math.sqrt( 
						Math.pow( ( x1.x - x2.x ), 2 ) +
						Math.pow( ( x1.y - x2.y ), 2 ) +
						Math.pow( ( x1.z - x2.z ), 2 ) );  
	},

	inSphere: function(center, radius, x)
	{
		return Math.pow( (x.x - center.x), 2 ) +
				Math.pow( (x.y - center.y), 2 )	+
				Math.pow( (x.z - center.z), 2 ) < (radius * radius);
	}
};

var performance_monitor = 
{
	/* Performance Monitor
	 * ------------------------------------------------
	 * Records hand position (for right now). Stores 
	 * hand position in 2D array for later use with report 
	 * card. Keeps track of waist position to determine appropriate
	 * hand gestures ie big and above waist or little-to-no-movement
	 * below the waist. Keeps a running score for the user to see
	 * as a percentage of things they've done well over all the things
	 * they've done well and done poorly. Will attempt to do some 
	 * basic rocking analysis as well (might want to focus on this
	 * for the next iteration). Print hand gestures for machine 
	 * learning later.
	 * 
	 */

	//	Wiggle room for user to make mistakes, move their 
	//	hands a little bit in either direction. 
	SMALL_MOVEMENT_RADIUS: 4,
	SMALL_MOVEMENT_ALPHA: 0.2,
	DWELL_ALPHA: 10,

	SCREEN_WIDTH: 480,
	SCREEN_HEIGHT: 640,
	NUM_X_BUCKETS: 48,
	NUM_Y_BUCKETS: 64,
	hand_coordinate_array: 0,
	waistY: 0,
	waist_offset: 0,	// offset for people with short arms
	movement_duration: 25,	// 25/30 seconds of movement
	left_movement_vector: [],	// cache about 1 second of movement
	right_movement_vector:[],               
    initHandTracker: false,

	updateWaist: function(waist_y)
	{
		this.waistY = waist_y + this.waist_offset;
		return this;
	},

	isAboveWaist: function(hand)
	{
		//console.log(hand.y + "--->" + this.waistY);
		if ( hand.y < this.waistY )
		{
			return true;
		}
		return false;
	},

	init_handtracker: function(num_x_buckets, num_y_buckets)
	{
		if (this.initHandTracker === false)
		{
			if (typeof num_x_buckets != "undefined" )
			{
				 this.NUM_X_BUCKETS = num_x_buckets;
			}
			if (typeof y_height !="undefined")
			{
				this.NUM_Y_BUCKETS = num_y_buckets;
			}

			//	Initiate buckets	
			this.hand_coordinate_array = new Array(this.NUM_X_BUCKETS);
			for (var i = 0; i < this.NUM_X_BUCKETS; i ++ )
			{	
				this.hand_coordinate_array[i] = 0;
				this.hand_coordinate_array[i] = new Array(this.NUM_Y_BUCKETS);
				for (var j = 0; j < this.NUM_Y_BUCKETS; j ++)
				{
					this.hand_coordinate_array[i][j] = 0;
				}
			}
			this.initHandTracker = true;
		}
		return this;
	},

	cache_hands: function(left_hand, right_hand)
	{
		/* cache_hands
		 * -----------------------------------------------------------
		 * stores hands in a 2d array. Will store exactly
		 * movement_durations worth of hand positions and then start 
		 * popping off the last hand position to make room for the new
		 * hand position.
		 */
		if (this.left_movement_vector.length === this.movement_duration)
		{
			// Vector is full, start throwing away things at the end
			// to make room
			this.left_movement_vector.pop();
			this.left_movement_vector.unshift(left_hand);
			this.right_movement_vector.pop();
			this.right_movement_vector.unshift(right_hand);
		}
		else
		{
			// Vector not completely full. carry on.
			this.left_movement_vector.push(left_hand);
			this.right_movement_vector.push(right_hand);
		}
	},

	add_hands: function(left_hand, right_hand)
	{
		/* track_hands
		 * ---------------------------------------------
		 * tracks hand positions and stores them in a bucket
		 * of hand positions. Also stores them in cache for 
		 * heuristic analysis. 
		 *
		 */
		if (this.initHandTracker === false)
		{
			// Auto initialize hand tracker in 
			// the event that the user hasn't done
			// that yet
			this.initHandTracker();
			this.initHandTracker = true;
		}
		//this.record_hand_position(left_hand, right_hand);
		this.cache_hands(left_hand, right_hand);
		//this.analyze();
		return this;
	},

	interpolate_hand_position: function(hand)
	{
		/*
		 * interpolate_hand_position
		 * ----------------------------------------------------------
		 * interpolates hand position so it fits withing a defined 
		 * number of buckets in the array.
		 */
		return { 'x': Math.max( ( (hand.x / this.SCREEN_WIDTH ) * this.NUM_X_BUCKETS ), 0),
				 'y': Math.max( ( (hand.y / this.SCREEN_HEIGHT) * this.NUM_Y_BUCKETS ), 0) }
	},

	record_hand_position: function(left_hand, right_hand)
	{
		/*
		 * record_hand_position
		 * ------------------------------------------------------------
		 * records all hand positions in a 2d array for analysis after 
		 * the person is finished speaking.
		 *
		 */
		left_hand_interpolated = Math.floor(this.interpolate_hand_position(
															left_hand));
		right_hand_interpolated = Math.floor(this.interpolate_hand_position(
															right_hand));
		this.hand_coordinate_array[left_hand_interpolated.x][left_hand_interpolated.y] += 1;
		this.hand_coordinate_array[right_hand_interpolated.x][right_hand_interpolated.y] += 1;
	},

	analyze: function( callback )
	{
		if (this.left_movement_vector.length === this.movement_duration)
		{
			// If the vector is full analyze //


			var right_in_sphere = 0;
			var right_out_of_sphere = 0;
			var left_in_sphere = 0;
			var left_out_of_sphere = 0;
			var central_left = this.left_movement_vector[Math.floor(this.left_movement_vector.length / 2)];
			var central_right = this.right_movement_vector[Math.floor(this.right_movement_vector.length / 2)];
			var left_above_waist = this.isAboveWaist(central_left);
			var right_above_waist = this.isAboveWaist(central_right);
			var left_large_movement = false;
			var right_large_movement = false;

			for (var hand = 0; hand < this.left_movement_vector.length; hand ++)
			{
				if (heroMath.inSphere(central_left, this.SMALL_MOVEMENT_RADIUS, 
							this.left_movement_vector[hand]))
				{
					left_in_sphere += 1;
				}
				else 
				{
					left_out_of_sphere += 1;
				}
				if (heroMath.inSphere(central_right, this.SMALL_MOVEMENT_RADIUS,
							this.right_movement_vector[hand]))
				{
					right_in_sphere += 1;
				}
				else
				{
					right_out_of_sphere += 1;
				}
			}
			if ((left_out_of_sphere / ( left_in_sphere + left_out_of_sphere)) 
				> this.SMALL_MOVEMENT_ALPHA)
			{
				left_large_movement = true;
			}
			if ((right_out_of_sphere / (right_in_sphere + right_out_of_sphere)) 
				> this.SMALL_MOVEMENT_ALPHA)
			{
				right_large_movement = true;
			}

			if (typeof callback === 'function')
			{
				callback({hand: 'left', aboveWaist: left_above_waist,
							largeMovement: left_large_movement
						});
				callback({hand:'right', aboveWaist: right_above_waist,
							largeMovement: right_large_movement
						});
			}
			//console.log("hand: left: aboveWaist: " + left_above_waist + "largeMovement?: " + left_large_movement);
			/*
			self.postMessage(JSON.stringify(
			{
				hand: 'left', 
				aboveWaist: left_above_waist,
				largeMovement: left_large_movement
			}));
			self.postMessage(JSON.stringify(
			{
				hand: 'right',
				aboveWaist: right_above_waist,
				largeMovement: right_large_movement
			}));*/
		}
	}
};

addEventListener('message', function(e)     
{
	var data = e.data;
	switch (data.func)
	{
		case 'initialize':
			performance_monitor.init_handtracker();
			break;
		case 'add_hands':     
			performance_monitor.add_hands(data.left_hand, data.right_hand);
			break;
		case 'stop':
			this.close();
			break;
		case 'updateWaist':
			performance_monitor.updateWaist(data.waist);
			break;
		default:
			break;
	};
}, false);