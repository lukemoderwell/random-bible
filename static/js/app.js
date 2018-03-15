const audio = document.querySelector('[data-audio-root]');
const randomBtn = document.querySelector('[data-audio-randomize]');
const title = document.querySelector('[data-book-title]');
const categoryText = document.querySelector('[data-book-categories]');
const playTime = document.querySelector('[data-playtime]');
const playBtn = document.querySelector('[data-play-button]');

let nextChapter;
let prevChapter;
let currentBook;

// Probably want to replace this object due to manual updating
const bible = {
  nt: [
    "Matthew", "Mark"
  ],
  chapters: [
    28, 16
  ],
  get randomize() {
    const number = Math.floor(Math.random() * Math.floor(this.nt.length))
    let chapterNumber
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

function fetchData(book, chapter) {
  fetch(`/bible/${book}/${chapter}`)
  .then((res) => {
    return res.json();
  })
  .catch((error) => {
    console.log(error);
  })
  .then((json) => {
    let data = json[0].fields;
    console.log(data);
    setAudio(data.Audio[0].url);
    setText(data.Book, data.Chapter, data.Categories);
    nextChapter = chapter += 1;
    currentBook = book;
  })
}

function animateProgress() {
  const bar = document.querySelector('[data-progress]');
  bar.style = `width: 100%; transition: ${audio.duration}s width linear`;
}

function fetchNext(){
  fetchData(currentBook, nextChapter)
}

function toggleAudio() {
  if (playBtn.classList.value == 'playBtn') {
    playBtn.classList.add('pause');
    audio.play();
  } else {
    playBtn.classList.remove('pause');
    audio.pause();
  }
}

function dataLoaded() {
  if (audio.readyState > 1) {
    audio.play()
    var minutes = Math.floor(audio.duration / 60);
    var seconds = Math.round(audio.duration - minutes * 60);
    playTime.textContent = `${minutes}:${seconds}`;
    animateProgress();
  } else {
    alert("Audio can't play")
  }
}

function init() {
  const selection = bible.randomize
  fetchData(selection[0], selection[1])
}

randomBtn.addEventListener('click', init)
init()