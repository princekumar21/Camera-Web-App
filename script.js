let video = document.querySelector("video");
let record = document.querySelector("#record");
let recDiv = record.querySelector("div");
let capBtn = document.querySelector("#capture");
let capDiv = capBtn.querySelector("div");
let body = document.querySelector("body");
let minZoom = 1;
let maxZoom = 3;
let currZoom = 1;
let mediaRecorder;
let chunks = [];
let isRecording = false;
let captured = false;
let appliedfilter;

let zoomInBtn = document.querySelector(".zoom-in");
console.log(zoomInBtn);
zoomInBtn.addEventListener("click", function () {
  console.log(currZoom);
  if (currZoom < maxZoom) {
    currZoom = currZoom + 0.1;
  }
  console.log(video.style.transform);

  video.style.transform = `scale(${currZoom})`;
});

let zoomOutBtn = document.querySelector(".zoom-out");
zoomOutBtn.addEventListener("click", function () {
  if (currZoom > minZoom) {
    currZoom = currZoom - 0.1;
  }
  video.style.transform = `scale(${currZoom})`;
});

let galleryBttn = document.querySelector("#gallery");
galleryBttn.addEventListener("click", function () {
  location.assign("gallery.html");
});

navigator.mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then(function (mediaStream) {
    mediaRecorder = new MediaRecorder(mediaStream);

    mediaRecorder.addEventListener("dataavailable", function (e) {
      chunks.push(e.data);
    });

    mediaRecorder.addEventListener("stop", function (e) {
      let blob = new Blob(chunks, { type: "video/mp4" });
      chunks = [];
      addMedia(blob, "video");
      // let a = document.createElement("a");
      // let url = window.URL.createObjectURL(blob);
      // a.href = url;
      // a.download = "video.mp4";
      // a.click();
      // a.remove();
    });

    video.srcObject = mediaStream;
  })
  .catch(function (err) {
    console.log(err);
  });

let filters = document.querySelectorAll(".filter");
for (let i = 0; i < filters.length; i++) {
  filters[i].addEventListener("click", function (e) {
    removeFilter();
    appliedfilter = e.currentTarget.style.backgroundColor;
    let div = document.createElement("div");
    div.classList.add("filter-div");
    div.style.backgroundColor = appliedfilter;
    body.append(div);
  });
}

record.addEventListener("click", function (e) {
  if (isRecording) {
    mediaRecorder.stop();
    isRecording = false;
    recDiv.classList.remove("record-animation");
  } else {
    mediaRecorder.start();
    isRecording = true;
    recDiv.classList.add("record-animation");
  }
});

capBtn.addEventListener("click", function (e) {
  if (isRecording) return;
  capDiv.classList.add("capture-animation");
  setTimeout(function () {
    capDiv.classList.remove("capture-animation");
  }, 1000);

  let canvas = document.createElement("canvas");
  canvas.height = video.videoHeight;
  canvas.width = video.videoWidth;
  let tool = canvas.getContext("2d");

  //shifting origin
  tool.translate(canvas.width / 2, canvas.height / 2);
  tool.scale(currZoom, currZoom);
  tool.translate(-canvas.width / 2, -canvas.height / 2);
  tool.drawImage(video, 0, 0);

  if (appliedfilter) {
    tool.fillStyle = appliedfilter;
    tool.fillRect(0, 0, canvas.width, canvas.height);
  }

  let link = canvas.toDataURL();

  addMedia(link, "image");
  // let a = document.createElement("a");
  // a.href = link;
  // a.download = "image.jpg";
  // a.click();
  // a.remove();
  // e.currentTarget.classList.remove("capture-animation");
});

function removeFilter() {
  let div = document.querySelector(".filter-div");
  if (div) {
    div.remove();
  }
}
