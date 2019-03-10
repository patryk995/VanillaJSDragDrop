var draggingImgId;
const imgPiecesIDs = ["tl", "tc", "tr", "cl", "cc", "cr", "bl", "bc", "br"];
const mainContainer = document.getElementById("imagesGridContainer");
const flexBodyContainer = document.getElementById("flexBodyContainer");
var shuffledPieces = imgPiecesIDs.slice();
document.getElementById("submitPuzzle").addEventListener("click", checkIfWin);
document.getElementById("reloadImage").addEventListener("click", getImageURL);
document.getElementById("showGrid").addEventListener("click", showGrid);
var imgUrl;
const url = "https://source.unsplash.com/random/450x450";

createContainers();
getImageURL();

const empties = document.querySelectorAll(".empty");
const fills = document.querySelectorAll(".fill");

function createContainers() {
  for (let i = 0; i < 9; i++) {
    let pieceContainer = document.createElement("div");
    pieceContainer.className = "empty";
    var piece = document.createElement("div");
    piece.setAttribute("draggable", true);
    piece.className = "fill";
    pieceContainer.append(piece);
    mainContainer.append(pieceContainer);
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
  // photoTaken.parentElement.append(tempPhoto);
}

function checkIfWin() {
  let i = 0;
  for (const fill of fills) {
    if (fill.id !== imgPiecesIDs[i]) {
      return alert("Wrong puzzle");
    }
    i++;
  }
  let ifPlayAgain = confirm("Congratulations! One more time?");
  if (ifPlayAgain) {
    getImageURL();
  }
}

function showGrid(e) {
  if (mainContainer.className.length > 0) {
    e.target.innerHTML = "Show Grid";
    mainContainer.className = "";
  } else {
    e.target.innerHTML = "Hide Grid";
    document.getElementById("imagesGridContainer").className = "show-grid";
  }
}
