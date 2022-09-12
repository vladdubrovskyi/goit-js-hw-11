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

formEl.addEventListener('submit', onSubmit);
loadBtnEl.addEventListener('click', onLoadBtn);

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
  ApiSrv.getResponseData().then(res => {
    if (res.data.totalHits > 0) {
      Notiflix.Notify.success(`Hooray! We found ${res.data.totalHits} images.`);
    }
    if (res.data.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  });
}

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
    ApiSrv.getResponseData().then(res => {
      if (res.data.totalHits < (ImgApiSrv.page - 1) * 40) {
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }
    });
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
</div></a>`;
      }
    )
    .join('');
  return galleryContainer.insertAdjacentHTML('beforeend', markup);
}

function clearContainer() {
  galleryContainer.innerHTML = '';
}
