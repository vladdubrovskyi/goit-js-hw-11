import axios from 'axios';
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ImgApiSrv from './imgapi';

const ApiSrv = new ImgApiSrv();

const formEl = document.querySelector('#search-form');
const inputEl = document.querySelector('[type="text"]');
const galleryContainer = document.querySelector('.gallery');
const loadBtnEl = document.querySelector('.load-btn');
// const BASE_URL = 'https://pixabay.com/api/';
// const searchParams = new URLSearchParams({
//   key: '29821254-cc8d55b85aa42c363f8211fb8',
//   image_type: 'photo',
//   orientation: 'horizontal',
//   safesearch: 'true',
//   per_page: 4,
//   page: 1,
// });
// let searchContext = '';

formEl.addEventListener('submit', onSubmit);

function onSubmit(e) {
  e.preventDefault();
  ApiSrv.query = e.currentTarget.elements.searchQuery.value;
  if (ApiSrv.query === '') {
    return;
  }
  ApiSrv.resetPage();
  ApiSrv.getImages().then(renderPage);
  clearContainer();

  //   searchContext = e.currentTarget.elements.searchQuery.value;
  //     .axios(`${BASE_URL}?${searchParams}&q=${searchContext}`)
  //     .then(res => {
  //       return res.data.hits;
  //     })
  //     .then(renderPage)
  //     .catch(err => console.log(err));
  loadBtnEl.classList.remove('is-hidden');
}

loadBtnEl.addEventListener('click', onLoadBtn);

function onLoadBtn(e) {
  ApiSrv.getImages().then(renderPage);

  //   console.log(searchParams);
  //   axios(`${BASE_URL}?${searchParams}&q=${searchContext}`)
  //     .then(res => {
  //       return res.data.hits;
  //     })
  //     .then(renderPage)
  //     .catch(err => console.log(err));
}

function renderPage(data) {
  const markup = data
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>:${likes}
    </p>
    <p class="info-item">
      <b>Views</b>:${views}
    </p>
    <p class="info-item">
      <b>Comments</b>:${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>:${downloads}
    </p>
  </div>
</div>`;
      }
    )
    .join('');
  return galleryContainer.insertAdjacentHTML('beforeend', markup);
}

function clearContainer() {
  galleryContainer.innerHTML = '';
}
