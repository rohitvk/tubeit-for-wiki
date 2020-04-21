const FACTS = " facts";  //trailing space is Intentional 
const MOVIE = " movie film";


var delay = (function () {
	var timer = 0;
	return function (callback, ms) {
		clearTimeout(timer);
		timer = setTimeout(callback, ms);
	};
})();

$(document).ready(function () {
	$("#siteSub").append("</br>Powered by: Tubeit for Wikipedia</br><iframe id='box1' class='boxit' frameborder='0' allowfullscreen></iframe> <iframe id='box2' class='boxit' frameborder='0' allowfullscreen></iframe> <iframe id='box3' class='boxit' frameborder='0' allowfullscreen></iframe>");

	var query = $("#firstHeading").text();

	tubeit(query, getType(query));
});

$(document.body).bind('mouseup', function (e) {
	var selection = window.getSelection();
	if (selection) {
		var query = sanitizeQuery(selection);
		if (query) {

			var parent = $(selection.focusNode.parentElement);
			var oldHtml = parent.html();
			var newHtml = oldHtml.replace(query, "<span class='highlight'>" + query + "</span>");
			parent.html(newHtml);

			var fadeDelay = 5000;
			var fadeDuration = 1000;
			var div = $('<div class="image-wrapper">')
				.css({
					"left": e.pageX + 20 + 'px',
					"top": e.pageY - 30 + 'px'
				})
				.append($('<a href=#top> <img  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAATCAYAAACZZ43PAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxIAAAsSAdLdfvwAAADOSURBVDhPY2AgDOIIK8Gtog0o9ROIK8kxpB2o6T8SribFkC40zTCDaokxpAeHZpghDfgM6SegGWZIMzZDJhGpGWZIK8wQZiBjChbNH5HE/gHZb7GoaQEZsg6LxASgWBWaeAqQPweLWoY7aIKLoU4rQROPhIqvRRNnuIwksAgpcEBRhpwOQC4AASYgXoUkBzdgIVrI1qAZkIwkzwhkr4DKM3wHMpBthqnDZwBMzXIQIwLNZlIMYMGhFyxMjAvw6R8OBoDyPygJ/4XiJGweBgDJhoGHM5l46QAAAABJRU5ErkJggg=="> </a>'))
				.appendTo(document.body);

			setTimeout(function () {
				div.addClass('fade-out');
				setTimeout(function () {
					div.remove();
				}, fadeDuration);
			}, fadeDelay);

			delay(tubeit(query, getType(query)), 1000);
		}

	}

});

var getType = function (query) {
	var t = $("#catlinks").text();
	var cat = t.substring(12, 50);
	var type = false;
	if (query.includes('film') || cat.includes('movie') || cat.includes('film')) {
		return MOVIE; //default search
	} 
	return FACTS;
};

var tubeit = function (cleanQuery, type) {
	if (!cleanQuery) {
		return;
	}
	var videos = "https://www.googleapis.com/youtube/v3/search";
	var apiKey = "AIzaSyDwacaIHoZZb8Yc7RXnHhC3LJ6Up7945is"; // Insert here your api key
	var part = "part=snippet";

	function getUrl() {
		var url;
		if (type == MOVIE) { //default search
			url = videos + "?" + "key=" + apiKey + "&q=" + cleanQuery + "&" + part + "&type=video&videoEmbeddable=true&videoSyndicated=true";
		} else if (type == FACTS) {
			url = videos + "?" + "key=" + apiKey + "&q=" + cleanQuery + FACTS + "&" + part + "&type=video&videoEmbeddable=true&videoSyndicated=true";
		} 
		/*else { //set topic as knowledge
			url = videos + "?" + "key=" + apiKey + "&q=" + cleanQuery + "&" + part + "&type=video&videoEmbeddable=true&videoSyndicated=true&safeSearch=strict&topicId=/m/01k8wb";
		}*/
		return url;
	}

	$.get(getUrl(), function (response) {
		var status = response.pageInfo.totalResults;
		var title;
		if (status) {
			$.get(getUrl(), function (response) {
				title = response.items[0].snippet.title;
				$('#info').text(title);
				var ytEmbedPrefix = "https://www.youtube.com/embed/";
				var url1 = ytEmbedPrefix + response.items[0].id.videoId;
				var url2 = ytEmbedPrefix + response.items[1].id.videoId;
				var url3 = ytEmbedPrefix + response.items[2].id.videoId;
				$('#box1').attr('src', url1);
				$('#box2').attr('src', url2);
				$('#box3').attr('src', url3);
			})
		} else {
			//title = "Video doesn't exist";
			//$('#info').text(title);
			//$('#box1').attr('data', "");
		}
	});
};

var sanitizeQuery = function (qtext) {
	var cleanText = qtext.toString();
	if (cleanText.length > 40) {
		return "";
	}
	return cleanText;
};