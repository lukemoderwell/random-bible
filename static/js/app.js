const audio = document.querySelector('[data-audio-root]');
const randomBtn = document.querySelector('[data-audio-randomize]');
const title = document.querySelector('[data-book-title]');
const categoryText = document.querySelector('[data-book-categories]');
const playBtn = document.querySelector('[data-play-button]');
const bar = document.querySelector('[data-progress]');

let nextChapter;
let prevChapter;
let currentBook;

// Probably want to replace this object due to manual updating
const bible = {
  nt: [
    "Matthew", "Mark", "Luke", "John"
  ],
  chapters: [
    28, 16, 24, 21
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

function getData(book, chapter) {
  fetch(`/bible/${book}/${chapter}`)
  .then((res) => {
    return res.json();
  })
  .catch((error) => {
    console.log(error);
  })
  .then((json) => {
    resetData();
    let data = json[0].fields;
    console.log(data);
    currentBook = data.Book;
    setAudio(data.Audio[0].url);
    setText(data.Book, data.Chapter, data.Categories);
    setAdjacent(data.Chapter);
  })
}

function getCategorized(category) {
  fetch(`/category/${category}`)
  .then((res) => {
    return res.json();
  })
  .catch((error) => {
    console.log(error);
  })
  .then((json) => {
    resetData();
    let data = json.fields;
    console.log(data);
    currentBook = data.Book;
    setAudio(data.Audio[0].url);
    setText(data.Book, data.Chapter, data.Categories);
    setAdjacent(data.Chapter);
  })
}

function getAdjacent(direction){
  direction === "next" ?
    getData(currentBook, nextChapter) :
    getData(currentBook, prevChapter);
}

function animateProgress() {
  bar.style = `animation: grow ${audio.duration}s linear; animation-play-state: running;`;
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

function dataLoaded() {
  if (audio.readyState > 1) {
    animateProgress();
    audio.play();
    playBtn.classList.add('pause');
  } else {
    console.log("Audio failed to load")
  }
}

function resetData() {
  // animation reset
  bar.style.animation = '';
  
  // chapter reset
  nextChapter = '';
  prevChapter = '';
}

function init() {
  resetData();
  let selectionValue = document.querySelector('[data-select-category]').value;
  if (selectionValue === 'Choose A Category') {
    const selection = bible.randomize;
    getData(selection[0], selection[1]);
  } else {
    getCategorized(selectionValue);
  }
}

randomBtn.addEventListener('click', init)
init()
