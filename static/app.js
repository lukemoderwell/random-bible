const bible = {
    nt: [
      "matthew"
    ],
    chapters: [
      28
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
  const title = document.getElementById('bookName')

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  function setTitle(book, chapter) {
    title.textContent = `${capitalize(book)} ${chapter}`
  }
  
  function setAudio(book, chapter) {
    audio.src = `/audio/nt/${book}/${chapter}.mp3`
  }

  function setMeta() {
    const meta = bible.randomize
    setTitle(meta[0], meta[1])
    setAudio(meta[0], meta[1])
  }

  function dataLoaded() {
    if (audio.readyState > 1) {
      audio.play()
    }
  }

  function init() {
    setMeta()
  }

  init()
