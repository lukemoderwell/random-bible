const audio = document.querySelector('[data-audio-root]')
const randomBtn = document.querySelector('[data-audio-randomize]')
const title = document.getElementById('bookName')

// Probably want to replace this object due to manual updating
const bible = {
  nt: [
    "Matthew"
  ],
  chapters: [
    28
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

function setTitle(book, chapter) {
  title.textContent = `${book} ${chapter}`
}

function setAudio(source) {
  audio.src = source
}

function fetchData(book, chapter) {
  fetch(`http://localhost:5000/bible/${book}/${chapter}`)
  .then((res) => {
    return res.json();
  })
  .then((json) => {
    let data = json[0]
    setTitle(data.fields.Book, data.fields.Chapter)
    setAudio(data.fields.Audio[0].url)
  })
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
  fetchData(selection[0], selection[1])
}

randomBtn.addEventListener('click', init)
init()
