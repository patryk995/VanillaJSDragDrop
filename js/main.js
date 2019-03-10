"use strict";
var draggingImgId;
const imgPiecesIDs = ["tl", "tc", "tr", "cl", "cc", "cr", "bl", "bc", "br"];
const imagesContainer = document.getElementById("imagesGridContainer");
const flexBodyContainer = document.getElementById("flexBodyContainer");
var shuffledPieces = imgPiecesIDs.slice();
document
  .getElementById("showFullImage")
  .addEventListener("click", showFullImage);
document.getElementById("reloadImage").addEventListener("click", getImageURL);
document.getElementById("showGrid").addEventListener("click", showGrid);
var imgUrl;
var imageThirdSize;
// init user moves counter
var moves = 0;
// Responsive image size
var devWidth = document.body.clientWidth; // El. width minus scrollbar width
var devWidth = document.body.scrollWidth; // El. width minus scrollbar width
var devwidth = window.innerWidth > 0 ? window.innerWidth : screen.width;

var imageWidth;
if (devWidth > 800) {
  var devHeight = document.body.clientHeight;
  // minus header height and margins of body container
  imageWidth = devHeight - 57 - 40;
} else {
  imageWidth = devWidth;
}
// make image devisible by 3
imageWidth = imageWidth - (imageWidth % 3);
// size for puzzle pieces
imageThirdSize = imageWidth / 3;
console.log(devWidth + " " + imageWidth);

// url with responsive parameters
const url = `https://source.unsplash.com/random/${imageWidth}x${imageWidth}`;

// set grid responsive to screen size
imagesContainer.style.cssText = `width:${imageWidth}px;height:${imageWidth}px;grid-template-columns:${imageThirdSize}px ${imageThirdSize}px ${imageThirdSize}px`;

createContainers();
getImageURL();

const empties = document.querySelectorAll(".empty");
const fills = document.querySelectorAll(".fill");

function createContainers() {
  for (let i = 0; i < 9; i++) {
    let pieceContainer = document.createElement("div");
    pieceContainer.className = "empty";
    //responsive size
    pieceContainer.style.cssText = `width:${imageThirdSize}px;height:${imageThirdSize}px`;
    var piece = document.createElement("div");
    piece.setAttribute("draggable", true);
    piece.style.cssText = `width:${imageThirdSize}px;height:${imageThirdSize}px`;

    piece.className = "fill";
    pieceContainer.append(piece);
    imagesContainer.append(pieceContainer);
  }
}
function setLoading() {
  flexBodyContainer.className = "loading";
}
function setLoaded() {
  flexBodyContainer.className = "loaded";
}
function getImageURL() {
  setLoading();
  moves = 0;
  console.log("get Image");
  fetch(url, { cache: "no-store" })
    .then(response => {
      imgUrl = response.url;
      document.getElementById("fetchedImg").src = imgUrl;
      showPieces(shuffledPieces);
    })
    .catch(err => {
      console.log(err);
      getImageURL();
    });
}
shuffledPieces = shuffle(shuffledPieces);

function showPieces(arr) {
  let i = 0;
  for (const fill of fills) {
    fill.style.background = `url(${imgUrl})`;
    fill.id = arr[i];
    i++;
  }
  setLoaded();
}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Loop through fills and call drag events
for (const fill of fills) {
  fill.addEventListener("dragstart", dragStart, false);
  fill.addEventListener("dragend", dragEnd);
}

// Loop through empties and call drag events
for (const empty of empties) {
  empty.addEventListener("dragover", dragOver);
  empty.addEventListener("dragenter", dragEnter);
  empty.addEventListener("dragleave", dragLeave);
  empty.addEventListener("drop", dragDrop);
}

// Drag Functions
function dragStart(e) {
  console.log("Drag Start");
  e.dataTransfer.setData("text/html", e.target.id);
  draggingImgId = this.id;
  this.className += " hold";
  // setTimeout(() => (this.className = "invisible"), 0);
}
function dragEnd() {
  this.className = "fill";
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
  this.className += " hovered";
}

function dragLeave() {
  this.className = "empty";
}
function dragDrop() {
  this.className = "empty";
  const destImgId = this.children[0].id;
  document.getElementById(draggingImgId).id = destImgId;
  this.children[0].id = draggingImgId;
  checkIfWin();
}

function checkIfWin() {
  let i = 0;
  moves += 1;
  for (const fill of fills) {
    if (fill.id !== imgPiecesIDs[i]) {
      return null;
    }
    i++;
  }
  setTimeout(
    () =>
      confirm(`Congratulations!\nYou made ${moves} moves.\n One more time?`) &&
      getImageURL(),
    1000
  );
}

function showGrid(e) {
  if (imagesContainer.className.length > 0) {
    e.target.innerHTML = "Show Grid";
    imagesContainer.className = "";
    for (const empty of empties) {
      empty.style.border = "0px";
      empty.style.width = `${imageThirdSize}px`;
      empty.style.height = `${imageThirdSize}px`;
      empty.children[0].style.width = `${imageThirdSize}px`;
      empty.children[0].style.height = `${imageThirdSize}px`;
    }
  } else {
    e.target.innerHTML = "Hide Grid";
    for (const empty of empties) {
      empty.style.border = "1px salmon solid";
      empty.style.width = `${imageThirdSize - 2}px`;
      empty.style.height = `${imageThirdSize - 2}px`;
      empty.children[0].style.width = `${imageThirdSize - 2}px`;
      empty.children[0].style.height = `${imageThirdSize - 2}px`;
    }
    document.getElementById("imagesGridContainer").className = "show-grid";
  }
}

function showFullImage() {
  let imagePopup = document.getElementById("fullImgPopup");
  imagePopup.className = "active";
  setTimeout(() => (imagePopup.className = ""), 2000);
}
