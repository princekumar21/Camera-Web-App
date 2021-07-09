let request = indexedDB.open("Camera", 1);

let db;

request.addEventListener("success", function () {
  db = request.result;
});

request.addEventListener("upgradeneeded", function () {
  let acessstoDB = request.result;
  acessstoDB.createObjectStore("Gallery", {
    keyPath: "mID",
    autoIncrement: true,
  });
});

request.addEventListener("error", function () {
  console.log("Something is wrong");
});

function addMedia(media, type) {
  if (!db) {
    return;
  }

  let obj = {
    mID: Date.now(),
    media,
    type,
  };
  let trans = db.transaction("Gallery", "readwrite");
  let gallery = trans.objectStore("Gallery");
  gallery.add(obj);
}

function deleteMedia(id) {
  let transaction = db.transaction("Gallery", "readwrite");
  let gallery = transaction.objectStore("Gallery");
  gallery.delete(Number(id));
}

function viewMedia() {
  let body = document.querySelector("body");
  let transaction = db.transaction("Gallery", "readonly");
  let gallery = transaction.objectStore("Gallery");
  let curReq = gallery.openCursor();

  curReq.addEventListener("success", function () {
    let cursor = curReq.result;
    let linkD;
    if (cursor) {
      let mediaObj = cursor.value;

      let div = document.createElement("div");
      div.classList.add("media-container");
      let linkForDownBtn = "";
      if (mediaObj.type == "video") {
        linkForDownBtn = window.URL.createObjectURL(mediaObj.media);
        let url = linkForDownBtn;

        div.innerHTML = `
        <div class="media">
          <video src = "${url}" autoplay controls ></video>
        </div>
        <div class="action">
        <div  class="material-icons download">download</div>
        <div class="material-icons delete" data-id="${mediaObj.mID}" >delete</div>
        </div>`;
      } else {
        linkForDownBtn = mediaObj.media;
        div.innerHTML = `
        <div class="media">
          <img src = "${mediaObj.media}"  >
        </div>
        <div class="action">
        <div  class="material-icons download">download</div>
        <div class="material-icons delete" data-id="${mediaObj.mID}" >delete</div>
        </div>`;
      }

      let downloadBttn = div.querySelector(".download");
      downloadBttn.addEventListener("click", function () {
        let a = document.createElement("a");
        a.href = linkForDownBtn;

        if (mediaObj.type == "video") {
          a.download = "video.mp4";
        } else {
          a.download = "image.jpg";
        }
        a.click();
        a.remove();
      });

      let deleteBttn = div.querySelector(".delete");
      deleteBttn.addEventListener("click", function (event) {
        let id = event.currentTarget.getAttribute("data-id");
        deleteMedia(id);

        event.currentTarget.parentElement.parentElement.remove();
      });
      body.append(div);
      cursor.continue();
    }
  });
}
