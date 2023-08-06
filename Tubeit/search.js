const FACTS = " facts";
const MOVIE = " movie film";

function delay(callback, ms) {
  let timer = setTimeout(callback, ms);
  return () => clearTimeout(timer);
}

function getType(query) {
  const t = document.getElementById('catlinks').textContent;
  const cat = t.substring(12, 50);

  const isMovieQuery = query.includes('film') || cat.includes('movie') || cat.includes('film');
  return isMovieQuery ? MOVIE : FACTS;
}

function tubeit(cleanQuery, type) {
  if (!cleanQuery) {
    return;
  }

  const videos = "https://www.googleapis.com/youtube/v3/search";
  const apiKey = "AIzaSyDwacaIHoZZb8Yc7RXnHhC3LJ6Up7945is"; // Replace with your API key
  const part = "part=snippet";

  function getUrl() {
    return `${videos}?key=${apiKey}&q=${cleanQuery}${type}&${part}&type=video&videoEmbeddable=true&videoSyndicated=true`;
  }

  fetch(getUrl())
    .then(response => response.json())
    .then(data => {
		const totalVideos = data.pageInfo.totalResults;
		if (totalVideos <= 0) {
			return;
		}

		const boxitDiv = document.querySelector('.boxit'); 
		const boxes = boxitDiv.querySelectorAll('iframe');

		const ytEmbedPrefix = "https://www.youtube.com/embed/";

		for (let i = 0; i < Math.min(boxes.length, 3); i++) {
			const videoId = data.items[i].id.videoId;
			boxes[i].src = ytEmbedPrefix + videoId;
		}
	  } 
    )
}

function sanitizeQuery(qtext) {
  return qtext.length <= 40 ? qtext : "";
}

function initFeaturesInjection() {
	injectIframeAndSearch();
	toggleDarkMode();
}

function injectIframeAndSearch() {
	const siteSub = document.getElementById('siteSub');
	const poweredBy = document.createElement('div');
	poweredBy.innerHTML = "Powered by: Tubeit for Wikipedia";
	
	const iframeContainer = document.createElement('div');
	iframeContainer.classList.add('boxit');

	const iframe1 = createIframe('box1');
	const iframe2 = createIframe('box2');
	const iframe3 = createIframe('box3');
	
	// Append the elements to siteSub
	iframeContainer.appendChild(iframe1);
	iframeContainer.appendChild(iframe2);
	iframeContainer.appendChild(iframe3);

	siteSub.appendChild(poweredBy);
	siteSub.appendChild(iframeContainer);

	function createIframe(id) {
	  const iframe = document.createElement('iframe');
	  iframe.id = id;
	  iframe.allowFullscreen = true;
	  return iframe;
	}
	const query = document.getElementById('firstHeading').textContent;
	tubeit(query, getType(query));
}

if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded',initFeaturesInjection);
} else {
    initFeaturesInjection();
}
 
document.body.addEventListener('mouseup', function (e) {
  const selection = window.getSelection();
  if (selection) {
    const query = sanitizeQuery(selection.toString());
    if (query) {
      const parent = selection.focusNode.parentElement;
      const oldHtml = parent.innerHTML;
      const newHtml = oldHtml.replace(query, `<span class='highlight'>${query}</span>`);
      parent.innerHTML = newHtml;

      const fadeDelay = 5000;
      const fadeDuration = 1000;
      const div = document.createElement('div');
      div.classList.add('image-wrapper');
      div.style.left = e.pageX + 20 + 'px';
      div.style.top = e.pageY - 30 + 'px';
      div.innerHTML = `<a href=#top> <img  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAATCAYAAACZZ43PAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxIAAAsSAdLdfvwAAADOSURBVDhPY2AgDOIIK8Gtog0o9ROIK8kxpB2o6T8SribFkC40zTCDaokxpAeHZpghDfgM6SegGWZIMzZDJhGpGWZIK8wQZiBjChbNH5HE/gHZb7GoaQEZsg6LxASgWBWaeAqQPweLWoY7aIKLoU4rQROPhIqvRRNnuIwksAgpcEBRhpwOQC4AASYgXoUkBzdgIVrI1qAZkIwkzwhkr4DKM3wHMpBthqnDZwBMzXIQIwLNZlIMYMGhFyxMjAvw6R8OBoDyPygJ/4XiJGweBgDJhoGHM5l46QAAAABJRU5ErkJggg=="> </a>`;
      document.body.appendChild(div);

      setTimeout(function () {
        div.classList.add('fade-out');
        setTimeout(function () {
          div.remove();
        }, fadeDuration);
      }, fadeDelay);

      delay(() => tubeit(query, getType(query)), 1000);
    }
  }
});

function toggleDarkMode() {
	// const darkModeToggle = document.createElement('button');
	// darkModeToggle.textContent = 'Toggle Dark Mode';
	// darkModeToggle.classList.add('dark-mode-toggle');
	// const container = document.getElementById();
	// darkModeToggle.addEventListener('click', function () {
	// 	container.classList.toggle('dark-mode');
	// });
  
	// const rightNav = document.getElementById('right-navigation');
	// rightNav.appendChild(darkModeToggle);
}
