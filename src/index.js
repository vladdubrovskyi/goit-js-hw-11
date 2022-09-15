import axios from 'axios';
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ImgApiSrv from './imgapi';

const ApiSrv = new ImgApiSrv();

const formEl = document.querySelector('#search-form');
const galleryContainer = document.querySelector('.gallery');
const loadBtnEl = document.querySelector('.load-btn');

const lightBox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  captionsData: 'alt',
  overlay: true,
});

formEl.addEventListener('submit', onSubmit);
loadBtnEl.addEventListener('click', onLoadBtn);

function onSubmit(e) {
  e.preventDefault();
  ApiSrv.query = e.currentTarget.elements.searchQuery.value;
  if (ApiSrv.query === '') {
    return;
  }
  ApiSrv.resetPage();
  ApiSrv.getImages().then(res => {
    if (res.data.totalHits > 0) {
      renderPage(res.data.hits);
      loadBtnEl.classList.remove('is-hidden');
      lightBox.refresh();
      Notiflix.Notify.success(`Hooray! We found ${res.data.totalHits} images.`);
    }
    if (res.data.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadBtnEl.classList.add('is-hidden');
      formEl.reset();
    }
  });
  clearContainer();
}

function onLoadBtn(e) {
  ApiSrv.getImages().then(res => {
    if (res.data.totalHits > 0) {
      renderPage(res.data.hits);
      loadBtnEl.classList.remove('is-hidden');
      lightBox.refresh();
    }
    if (res.data.totalHits < (ApiSrv.page - 1) * 40) {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      loadBtnEl.classList.add('is-hidden');
    }
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
        return ` <a href="${largeImageURL}" class="gallery__item link"><div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" class="gallery__image" />
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
  loadBtnEl.classList.add('is-hidden');

  return galleryContainer.insertAdjacentHTML('beforeend', markup);
}

function clearContainer() {
  galleryContainer.innerHTML = '';
}
