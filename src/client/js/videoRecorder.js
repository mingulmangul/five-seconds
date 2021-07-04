const { createFFmpeg, fetchFile } = require("@ffmpeg/ffmpeg");

const recordBtn = document.getElementById("recordBtn");
const preview = document.getElementById("preview");

let stream;
let recorder;
let videoFile;
let recorderTimeout;

const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumbnail: "thumbnail.jpg",
};

const downloadFile = (fileUrl, filename) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
};

const handleReStart = () => {
  init();
  recordBtn.innerText = "Start Recording";
  recordBtn.removeEventListener("click", handleReStart);
  recordBtn.addEventListener("click", handleStart);
};

const handleDownload = async () => {
  recordBtn.innerText = "Transcoding...";
  recordBtn.disabled = true;
  recordBtn.removeEventListener("click", handleDownload);

  const ffmpeg = createFFmpeg({
    corePath: "/convert/ffmpeg-core.js",
    log: true,
  });
  await ffmpeg.load();
  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));
  await ffmpeg.run("-i", files.input, "-r", "60", files.output);
  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    files.thumbnail
  );

  const mp4Output = ffmpeg.FS("readFile", files.output);
  const thumbOutput = ffmpeg.FS("readFile", files.thumbnail);

  const mp4Blob = new Blob([mp4Output.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbOutput], { type: "image/jpg" });

  const mp4File = URL.createObjectURL(mp4Blob);
  const thumbFile = URL.createObjectURL(thumbBlob);

  downloadFile(mp4File, "MyVideo.mp4");
  downloadFile(thumbFile, "MyThumbnail.jpg");

  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumbnail);

  URL.revokeObjectURL(mp4File);
  URL.revokeObjectURL(thumbFile);
  URL.revokeObjectURL(videoFile);

  recordBtn.innerText = "Record Again";
  recordBtn.disabled = false;
  recordBtn.addEventListener("click", handleReStart);
};

const handleStop = () => {
  recordBtn.innerText = "Download Recording";
  recordBtn.removeEventListener("click", handleStop);
  recordBtn.addEventListener("click", handleDownload);
  if (recorderTimeout) {
    clearTimeout(recorderTimeout);
    recorderTimeout = null;
  }
  recorder.stop();
};

const handleStart = () => {
  recordBtn.innerText = "Stop Recording";
  recordBtn.removeEventListener("click", handleStart);
  recordBtn.addEventListener("click", handleStop);
  recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  recorder.ondataavailable = (event) => {
    console.log(event.data);
    videoFile = URL.createObjectURL(event.data);
    preview.srcObject = null;
    preview.src = videoFile;
    preview.loop = true;
    preview.play();
  };
  recorder.start(10 * 1000);
  recorderTimeout = setTimeout(() => {
    handleStop();
  }, 5 * 1000);
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    video: {
      width: 1024,
      height: 576,
    },
    audio: false,
  });
  preview.srcObject = stream;
  preview.play();
};

init();

recordBtn.addEventListener("click", handleStart);
