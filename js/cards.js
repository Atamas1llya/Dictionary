

const loadEvents = () => {
  const cards = document.getElementsByClassName('card');
  const words = document.getElementsByClassName('word');
  const translations = document.getElementsByClassName('translation');
  let state = new Array();
  for (let i = 0; i < cards.length; i++) {
    state[i] = false;
    cards[i].addEventListener('click', () => {
      if (state[i]) {
        words[i].style.display = 'block';
        translations[i].style.display = 'none';
        cards[i].style.background = 'white'
      } else {
        words[i].style.display = 'none';
        translations[i].style.display = 'block';
        cards[i].style.background = '#2962FF'
      }
      state[i] = !state[i]
    })
  }
};


const cards = document.getElementById('cards');
const db = new PouchDB('PCDCT2');

let wordInput = document.getElementById('word');
let translationInput = document.getElementById('translation');

const loadCards = () => {
  db.allDocs({
    include_docs: true,
    attachments: true
  }).then(result => {
    cards.innerHTML = ''
    const dictionary = result.rows.sort((a, b) => {
      let aDate = new Date(a.doc.date), bDate = new Date(b.doc.date);
      return aDate < bDate;
    })
    dictionary.map((elem) => {
      const { word, translation } = elem.doc;

      let card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `<h2 class='word'>${word}</h2><h2 class='translation'>${translation}</h2>`;

      cards.appendChild(card);
    })
  }).then(() => {
    loadEvents()
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
    return false;
  }
  db.post(note).then(res => {
    wordInput.value = '';
    translationInput.value = '';
    loadCards();
  }).catch(err => {
    console.error(err);
  });
}
document.addEventListener("DOMContentLoaded", loadCards);
