var btnPlay = document.querySelector('#playButton');
var btnPause = document.querySelector('#pauseButton');


window.onload = function() {
  audio.play();
}

btnPlay.addEventListener('click', function() {
  
  audio.play();
});

btnPause.addEventListener('click', function() {
  
  audio.pause();
});