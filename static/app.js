const audio = document.querySelector('[data-audio-root]')
const randomBtn = document.querySelector('[data-audio-randomize]')
const title = document.querySelector('[data-book-title]')
const categoryText = document.querySelector('[data-book-categories]')

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

function setText(book, chapter, categories) {
  title.textContent = `${book} ${chapter}`
  if (categories !== null) {
    for (let i = 0; i < categories.length; i += 1) {
      var elm = document.createElement('span')
      elm.innerText = categories[i]
      categoryText.appendChild(elm)
    }
  }
}

function setAudio(source) {
  audio.src = source
}

function fetchData(book, chapter) {
  fetch(`http://localhost:5000/bible/${book}/${chapter}`)
  .then((res) => {
    return res.json();
  })
  .catch((error) => {
    console.log(error);
  })
  .then((json) => {
    let data = json[0].fields
    console.log(data)
    setText(data.Book, data.Chapter, data.Categories)
    setAudio(data.Audio[0].url)
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
