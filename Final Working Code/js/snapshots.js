var video,canvas,context = null;
var picsArray = [];

$(document).ready(function(){
	initDOM();
});

function initDOM(){
	video = document.createElement('video');
	video.setAttribute('autoplay', true);
	video.style.display = 'none';

	canvas = document.createElement('canvas');
	canvas.setAttribute('id','snapshotsCanvas');
	canvas.setAttribute('width', 640);
	canvas.setAttribute('height', 480);	
	canvas.style.display = 'none';
	context = canvas.getContext('2d');
};


/* */
function takeSnapshot(){
	console.log('taking snapshot');
	context.drawImage(video,0,0);
	var imgUrl = canvas.toDataURL('image/png');
	picsArray.push(imgUrl);
};

var errorFn = function(e) {
    console.log('Reeeejected!', e);
};

window.URL = window.URL || window.webkitURL;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

navigator.getUserMedia({video: true, audio: true}, function(stream) {
        video.src = window.URL.createObjectURL(stream);
        localMediaStream = stream;
        context.drawImage(video,0,0,canvas.width,canvas.height);

}, errorFn);


$(document).click(function(){
	takeSnapshot();
	var img = document.createElement('img');
	img.setAttribute('src',picsArray[picsArray.length-1]);
	img.style.display = 'block';
    document.getElementById('pics').appendChild(img);
});
