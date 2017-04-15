const db = new PouchDB('PCDCT2');
const words = document.getElementById('words');

let wordInput = document.getElementById('word');
let translationInput = document.getElementById('translation');

const loadDictionary = () => {
  db.allDocs({
    include_docs: true,
    attachments: true
  }).then(result => {
    words.innerHTML = ''
    const dictionary = result.rows.sort((a, b) => {
      let aDate = new Date(a.doc.date), bDate = new Date(b.doc.date);
      return aDate > bDate;
    })
    dictionary.map((elem) => {
      const { word, translation } = elem.doc;

      let section = document.createElement('div');
      section.className = 'section';
      section.innerHTML = `<h2>${word}</h2><h2>${translation}</h2>`;

      words.appendChild(section);
    })
  }).catch(err => {
    console.log(err);
  });
}
document.getElementById('add').onclick = () => {
  const note = {
    word: wordInput.value,
    translation: translationInput.value,
    date: new Date()
  }
  if (!note.word || !note.translation) {
    return;
  }
  db.post(note).then(res => {
    wordInput.value = '';
    translationInput.value = '';
    loadDictionary();
  }).catch(err => {
    console.error(err);
  });
}
document.addEventListener("DOMContentLoaded", loadDictionary);
