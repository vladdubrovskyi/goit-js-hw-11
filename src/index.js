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

formEl.addEventListener('submit', onSubmit);

function onSubmit(e) {
  e.preventDefault();
  ApiSrv.query = e.currentTarget.elements.searchQuery.value;
  if (ApiSrv.query === '') {
    return;
  }
  ApiSrv.resetPage();
  ApiSrv.getImages().then(value => {
    if (value.length > 0) {
      renderPage(value);
      loadBtnEl.classList.remove('is-hidden');
    }
  });
  clearContainer();
}

loadBtnEl.addEventListener('click', onLoadBtn);

function onLoadBtn(e) {
  ApiSrv.loadMore().then(value => {
    if (value.length > 0) {
      renderPage(value);
      return;
    }
    loadBtnEl.classList.add('is-hidden');
    // Notiflix.Notify.failure(
    //   "We're sorry, but you've reached the end of search results."
    // );
  });
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
        return ` <a href="${largeImageURL}" class="gallery__item"><div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width=440 height = 400 "gallery__image" />
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
</div></a>`;
      }
    )
    .join('');
  return galleryContainer.insertAdjacentHTML('beforeend', markup);
}

function clearContainer() {
  galleryContainer.innerHTML = '';
}
