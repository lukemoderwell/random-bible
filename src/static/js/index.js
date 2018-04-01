import axios from 'axios';

const audio = document.querySelector('[data-audio-root]');
const randomBtn = document.querySelector('[data-audio-randomize]');
const title = document.querySelector('[data-book-title]');
const categoryText = document.querySelector('[data-book-categories]');
const playBtn = document.querySelector('[data-play-button]');
const prevBtn = document.querySelector('[data-prev]');
const nextBtn = document.querySelector('[data-next]');
const bar = document.querySelector('[data-progress]');
const categoryDropdown = document.querySelector('[data-select-category]');
const countdown = document.querySelector('[data-countdown]');
const duration = document.querySelector('[data-duration]');
const loading = document.querySelector('[data-loading]');

let prevId;
let nextId;

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
  isLoading(false);
}

function setAdjacent(id) {
  prevId = id - 1;
  nextId = id + 1;
}

function setCategories() {
  axios(`/categories`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error(error);
    })
    .then((json) => {
      for (let i = 0; i < json.length; i += 1) {
        var elm = document.createElement('option');
        elm.innerText = json[i];
        categoryDropdown.appendChild(elm);
      }
    })
}

function getRandom() {
  axios(`/random`).then((res) => {
    return res.data;
  }).catch((error) => {
    console.error(error);
  }).then((json) => {
    reset();
    let data = json.fields;
    setAudio(data.Audio[0].url);
    setText(data.Book, data.Chapter, data.Categories);
    setAdjacent(data.Id);
  })
}

function getSpecific(id) {
  axios(`/id/${id}`).then((res) => {
    return res.data;
  }).catch((error) => {
    console.error(error);
  }).then((json) => {
    reset();
    let data = json[0].fields;
    setAudio(data.Audio[0].url);
    setText(data.Book, data.Chapter, data.Categories);
    setAdjacent(data.Id);
  })
}

function getRandomCategorized(category) {
  fetch(`/category/${category}`)
    .then((res) => {
      return res.json();
    })
    .catch((error) => {
      console.error(error);
    })
    .then((json) => {
      reset();
      let data = json.fields;
      setAudio(data.Audio[0].url);
      setText(data.Book, data.Chapter, data.Categories);
      setAdjacent(data.Id);
    })
}

function getAdjacent(event) {
  event.currentTarget.className == 'next'
    ? getSpecific(nextId) 
    : getSpecific(prevId);
}

function isLoading(bool) {
  bool === true ? loading.classList.remove('loaded') : loading.classList.add('loaded');
}

function animateProgress() {
  bar.style = `animation: grow ${audio.duration}s linear; animation-play-state: running;`;
  bar.classList.add('playing');
}

function toggleAudio() {
  if (playBtn.classList.value == 'playBtn') {
    playBtn.classList.add('pause');
    bar.style.animationPlayState = "running"
    audio.play();
  } else {
    audio.pause();
    playBtn.classList.remove('pause');
    bar.style.animationPlayState = "paused";
  }
}

function setTime() {
  var time = Math.round(audio.duration);
  var minutes = Math.floor(time / 60);
  var seconds = time - minutes * 60;
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  duration.innerText = `${minutes}:${seconds}`;
  countdown.innerHTML = `0:00`;
}

function dataLoaded() {
  if (audio.readyState > 1) {
    isLoading(false);
    setTime();
    animateProgress();
    console.log(audio.readyState);
  } else {
    console.error("Audio failed to load")
  }
  toggleAudio();
}

function reset() {
  // animation reset
  bar.style.animation = '';
  bar.classList.remove('playing');
  // chapter reset
  nextId = '';
  prevId = '';
}

function init() {
  reset();
  let selectionValue = categoryDropdown.value;
  if (selectionValue === 'Choose A Category') {
    getRandom();
  } else {
    getRandomCategorized(selectionValue);
  }
}

audio.addEventListener("loadeddata", dataLoaded);
playBtn.addEventListener('click', toggleAudio);
prevBtn.addEventListener('click', getAdjacent);
nextBtn.addEventListener('click', getAdjacent);
randomBtn.addEventListener('click', init);
setCategories();
init();