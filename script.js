const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

// Show Modal

function showModal() {
  modal.classList.add('show-modal');
  websiteNameEl.focus();    
}

modalShow.addEventListener('click', showModal);

modalClose.addEventListener('click', () => {
  modal.classList.remove('show-modal');
})

window.addEventListener('click', (e) => {
  e.target === modal && modal.classList.remove('show-modal');
})

// Validate Form
function validate(nameValue, urlValue) {
  
  if (!nameValue || !urlValue) {
    alert('Informe o nome e a URL do site');
    return false;
  }
  
  const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  
  var regex = new RegExp(expression);

  if (!urlValue.match(regex)) {
    alert("Informe um endereço web válido");
    return false;
  }
  return true;
}

function fetchBookmarks() {
  if (localStorage.getItem('book-keeper')) {
    bookmarks = JSON.parse(localStorage.getItem('book-keeper'));

  } else {
    bookmarks = [
      {
        name: 'Udemy',
        url: 'https://udemy.com'
      }
    ];
    localStorage.setItem('book-keeper', JSON.stringify(bookmarks));
  }

  buildBookmarks();
}

function buildBookmarks() {
  bookmarksContainer.textContent = '';
  
  bookmarks.forEach((bookmark) => {
    const { name, url } = bookmark;

    const item = document.createElement('div');
    item.classList.add('item');

    const closeIcon = document.createElement('i');
    closeIcon.classList.add('fas', 'fa-times');
    closeIcon.id = 'delete-bookmark';
    closeIcon.title = "Excluir";
    closeIcon.setAttribute('onclick', `deleteBookmark('${ url }')`);

    const linkInfo = document.createElement('div');
    linkInfo.classList.add('name');

    const favicon = document.createElement('img');
    favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
    favicon.setAttribute('alt', name);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('target', '_blank');
    link.textContent = name;

    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);    
    bookmarksContainer.appendChild(item);
  })
}

function buildBookmarks_V2() {
  
  bookmarks.forEach((bookmark) => {
    const { name, url } = bookmark;
    const item = document.createElement('div');

    item.innerHTML = `
      <div class="item">
        <i class="fas fa-times" id="delete-bookmark" title="Excluir"></i>
        <div class="name">
            <img src="https://s2.googleusercontent.com/s2/favicons?domain=${url}" alt=${name}>
            <a href=${ url } target="_blank">
                ${ name }
            </a>
        </div>
      </div> 
    `;

    bookmarksContainer.appendChild(item);
  })
}

function deleteBookmark(url) {
  bookmarks = bookmarks.filter((bookmark) => bookmark.url !== url);
  localStorage.setItem('book-keeper', JSON.stringify(bookmarks));
  fetchBookmarks();
}

function storeBookmark(e) {
  e.preventDefault();
  
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;

  if (!urlValue.includes('https://', 'http://')) {
     urlValue = `https://${urlValue}`; 
  }

  if (!validate(nameValue, urlValue)) return false;

  const bookmark = {
    name: nameValue,
    url: urlValue,
  }

  bookmarks.push(bookmark);  
  localStorage.setItem('book-keeper', JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameEl.focus();
}

// Event Listeners

bookmarkForm.addEventListener('submit', storeBookmark);

// On Load

fetchBookmarks();
