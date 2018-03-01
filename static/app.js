const bible = {
  nt: [
    "matthew", "mark", "luke", "john", "acts", "romans", "1corinthians", "2corinthians"
  ],
  chapters: [
    28, 16, 24, 21, 28, 16, 16, 13 
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

const audio = document.querySelector('[data-audio-root]')
const randomBtn = document.querySelector('[data-audio-randomize]')
const title = document.getElementById('bookName')

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function textFormat(word) {
  const firstChar = word.charAt(0);
  if (!isNaN(firstChar)) {
    return `${word.charAt(0)} ${word.charAt(1).toUpperCase() + word.slice(2)}`
  } else {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
}

function setTitle(book, chapter) {
  title.textContent = `${textFormat(book)} ${chapter}`
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
  setAudio(selection[0], selection[1])
  setTitle(selection[0], selection[1])
}

randomBtn.addEventListener('click', init)
init()
