const bible = {
  nt: [
    "matthew", "mark", "luke", "john"
  ],
  chapters: [
    28, 16, 24, 21
  ],
  get randomize() {
    const number = Math.floor(Math.random() * Math.floor(this.nt.length))
    let chapterNumber
    const book = this.nt[number]
    const chapter = Math.floor(Math.random() * Math.floor(this.chapters[number]))
    return [book, chapter]
  }
}

const audio = document.querySelector('[data-audio-root]')
const randomBtn = document.querySelector('[data-audio-randomize]')
const title = document.getElementById('bookName')

function capitalize(string) {
  return string
    .charAt(0)
    .toUpperCase() + string.slice(1);
}

function setTitle(book, chapter) {
  title.textContent = `${capitalize(book)} ${chapter}`
}

function setAudio(book, chapter) {
  audio.src = `/audio/nt/${book}/${chapter}.mp3`
}

function dataLoaded() {
  if (audio.readyState > 1) {
    audio.play()
  } else {
    alert("Audio can't play")
  }
}

function init() {
  const selection = bible.randomize
  setTitle(selection[0], selection[1])
  setAudio(selection[0], selection[1])
}

randomBtn.addEventListener('click', init)
init()
