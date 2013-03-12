var progressBar = 
{
	/*Assume there is a Twitter bootstrap progress bar element in the DOM.
	This function animates that bar from 0% to 100% in totalTime seconds
	intervalTime defines how often to update the bar (default=0.1seconds, so that it seems very continuous)*/
	animate:  function(totalTime,intervalTime){
		intervalTime = typeof intervalTime !== 'undefined' ? intervalTime : 0.1;
		var curWidth = 0;
		window.setInterval(function(){
			curWidth += 100*intervalTime/totalTime;
			$(".bar").css("width",curWidth.toString()+"%");
		},intervalTime*1000);		
	}
}