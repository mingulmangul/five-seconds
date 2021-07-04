const player = document.querySelector(".player");
const video = document.querySelector("video");
const controls = document.getElementById("videoControls");
const playBtn = document.getElementById("playBtn");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("muteBtn");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volumeRange");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const fullscreenBtnIcon = fullscreenBtn.querySelector("i");

let controlsTimeout = null;
let controlsMovementTimeout = null;
video.volume = volumeRange.value;

const handlePlay = () => (playBtnIcon.className = "fas fa-pause");
const handlePause = () => (playBtnIcon.className = "fas fa-play");

const handlePlayBtn = (event) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
};

const handleVolumeChange = () => {
  muteBtnIcon.className =
    video.muted || video.volume === 0
      ? "fas fa-volume-mute"
      : "fas fa-volume-up";
};

const handleMuteBtn = (event) => {
  if (video.muted) {
    video.muted = false;
    volumeRange.value = video.volume;
  } else {
    video.muted = true;
    volumeRange.value = 0;
  }
};

const handleVolumeRange = (event) => {
  const { value } = event.target;
  video.muted = false;
  video.volume = value;
};

const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(14, 5);

const handleLoadedMetadata = () => {
  const playtime = Math.floor(video.duration);
  totalTime.innerText = formatTime(playtime);
  timeline.max = playtime;
};

const handleTimeUpdate = () => {
  const time = Math.floor(video.currentTime);
  currentTime.innerText = formatTime(time);
  timeline.value = time;
};

const handleTimeline = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleFullscreenChange = () => {
  const fullscreen = document.fullscreenElement;
  fullscreenBtnIcon.className = fullscreen
    ? "fas fa-compress"
    : "fas fa-expand";
};

const handleFullscreenBtn = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
  } else {
    player.requestFullscreen();
  }
};

const hideControls = () => controls.classList.remove("showing");

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  controls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 2000);
};

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 1000);
};

const handleKeyDown = (event) => {
  const { key } = event;
  if (key === " ") {
    event.preventDefault();
    handlePlayBtn();
  } else if (key === "m") {
    handleMuteBtn();
  } else if (key === "f") {
    handleFullscreenBtn();
  }
};

const handleEnded = () => {
  const { id } = player.dataset;
  fetch(`/api/videos/${id}/views`, {
    method: "POST",
  });
};

document.addEventListener("keydown", handleKeyDown);
video.addEventListener("play", handlePlay);
video.addEventListener("pause", handlePause);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("volumechange", handleVolumeChange);
video.addEventListener("ended", handleEnded);
video.addEventListener("click", handlePlayBtn);
playBtn.addEventListener("click", handlePlayBtn);
muteBtn.addEventListener("click", handleMuteBtn);
volumeRange.addEventListener("input", handleVolumeRange);
timeline.addEventListener("input", handleTimeline);
video.addEventListener("timeupdate", handleTimeUpdate);
fullscreenBtn.addEventListener("click", handleFullscreenBtn);
player.addEventListener("fullscreenchange", handleFullscreenChange);
player.addEventListener("mousemove", handleMouseMove);
player.addEventListener("mouseleave", handleMouseLeave);
