const audio = document.querySelector('[data-audio-root]');
const randomBtn = document.querySelector('[data-audio-randomize]');
const title = document.querySelector('[data-book-title]');
const categoryText = document.querySelector('[data-book-categories]');
const playBtn = document.querySelector('[data-play-button]');
const bar = document.querySelector('[data-progress]');
const categoryDropdown = document.querySelector('[data-select-category]');
const countdown = document.querySelector('[data-countdown]');
const duration = document.querySelector('[data-duration]');

let nextChapter;
let prevChapter;
let currentBook;

// Probably want to replace this object due to manual updating
const bible = {
  nt: [
    "Matthew",
    "Mark",
    "Luke",
    "John",
    "Acts",
    "Romans",
    "1 Corinthians",
    "2 Corinthians",
    "Galatians",
    "Ephesians",
    "Philippians",
    "Colossians",
    "1 Thessalonians",
    "2 Thessalonians",
    "1 Timothy",
    "2 Timothy",
    "Titus",
    "Philemon",
    "Hebrews",
    "James",
    "1 Peter",
    "2 Peter",
    "1 John",
    "2 John",
    "3 John",
    "Jude",
    "Revelation"
  ],
  chapters: [
    28, 16, 24, 21, 28, 16, 16, 13, 6, 4, 5, 3, 5, 3, 3, 1, 12, 4, 5, 3, 5, 1, 1, 1, 22
  ],
  get randomize() {
    const number = Math.floor(Math.random() * Math.floor(this.nt.length))
    const book = this.nt[number]
    let chapter = Math.floor(Math.random() * Math.floor(this.chapters[number]))
    if (chapter === 0) {
      chapter = Math.floor(Math.random() * Math.floor(this.chapters[number]))
    } else {
      return [book, chapter]
    }
  }
}

function setText(book, chapter, categories) {
  title.textContent = `${book} ${chapter}`;
  categoryText.textContent = "";
  if (categories !== null) {
    for (let i = 0; i < categories.length; i += 1) {
      var elm = document.createElement('span');
      elm.classList.add('category');
      elm.innerText = categories[i];
      categoryText.appendChild(elm);
    }
  }
}

function setAudio(source) {
  audio.src = source;
}

function setAdjacent(current) {
  prevChapter = current - 1;
  nextChapter = current + 1;
}

function setCategories() {
  fetch(`/categories`)
    .then((res) => {
      return res.json();
    })
    .catch((error) => {
      console.log(error);
    })
    .then((json) => {
      for (let i = 0; i < json.length; i += 1) {
        var elm = document.createElement('option');
        elm.innerText = json[i];
        categoryDropdown.appendChild(elm);
      }
    })
}

function getData(book, chapter) {
  fetch(`/bible/${book}/${chapter}`)
    .then((res) => {
      return res.json();
    })
    .catch((error) => {
      console.log(error);
    })
    .then((json) => {
      reset();
      let data = json[0].fields;
      console.log(data);
      currentBook = data.Book;
      setAudio(data.Audio[0].url);
      setText(data.Book, data.Chapter, data.Categories);
      setAdjacent(data.Chapter);
    })
}

function getCategorized(category) {
  fetch(`/random/${category}`)
    .then((res) => {
      return res.json();
    })
    .catch((error) => {
      console.log(error);
    })
    .then((json) => {
      reset();
      let data = json.fields;
      console.log(data);
      currentBook = data.Book;
      setAudio(data.Audio[0].url);
      setText(data.Book, data.Chapter, data.Categories);
      setAdjacent(data.Chapter);
    })
}

function getAdjacent(direction) {
  direction === "next" ?
    getData(currentBook, nextChapter) :
    getData(currentBook, prevChapter);
}

function animateProgress() {
  bar.style = `animation: grow ${audio.duration}s linear; animation-play-state: running;`;
  bar.classList.add('playing');
}

function toggleAudio() {
  if (playBtn.classList.value == 'playBtn') {
    playBtn.classList.add('pause');
    audio.play();
    bar.style.animationPlayState = "running"
  } else {
    playBtn.classList.remove('pause');
    audio.pause();
    bar.style.animationPlayState = "paused";
  }
}
// TODO: Pause Playtime
function incrementPlayTime() {
  let min = 0;
  let sec = 00;
  setInterval(function() {
    sec += 1;
    if (sec == 60) {
      min += 1;
      sec = 0;
    }
    countdown.innerText = `${min}:${sec}`
  }, 1000)
}

function setTime() {
  var time = Math.round(audio.duration);
  var minutes = Math.floor(time / 60);
  var seconds = time - minutes * 60;
  seconds === 0 ? seconds = `00` : seconds;
  duration.innerText = `${minutes}:${seconds}`;
  incrementPlayTime();
}

function dataLoaded() {
  if (audio.readyState > 2) {
    animateProgress();
    setTime();
    audio.play();
    playBtn.classList.add('pause');
  } else {
    console.log("Audio failed to load")
  }
}

function reset() {
  // animation reset
  bar.style.animation = '';
  bar.classList.remove('playing');
  // chapter reset
  nextChapter = '';
  prevChapter = '';
}

function init() {
  reset();
  let selectionValue = categoryDropdown.value;
  if (selectionValue === 'Choose A Category') {
    const selection = bible.randomize;
    getData(selection[0], selection[1]);
  } else {
    getCategorized(selectionValue);
  }
}

randomBtn.addEventListener('click', init);
setCategories();
init();
