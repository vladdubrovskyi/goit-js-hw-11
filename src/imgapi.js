import axios from 'axios';
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export default class ImgApiSrv {
  constructor() {
    this.SearchQuery = '';
    this.page = 1;
  }
  getResponseData() {
    const BASE_URL = 'https://pixabay.com/api/';
    const searchParams = new URLSearchParams({
      key: '29821254-cc8d55b85aa42c363f8211fb8',
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: 40,
    });
    return axios(
      `${BASE_URL}?${searchParams}&q=${this.SearchQuery}&page=${this.page}`
    ).then(res => {
      return res;
    });
  }

  getImages() {
    const BASE_URL = 'https://pixabay.com/api/';
    const searchParams = new URLSearchParams({
      key: '29821254-cc8d55b85aa42c363f8211fb8',
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: 40,
    });
    return axios(
      `${BASE_URL}?${searchParams}&q=${this.SearchQuery}&page=${this.page}`
    )
      .then(
        res => {
          this.page += 1;
          // const totalHits = res.data.totalHits;
          // this.totalHits = totalHits;
          // Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
          return res.data.hits;
        }
        // Notiflix.Notify.failure(
        //   'Sorry, there are no images matching your search query. Please try again.'
        // );
        // return [];
      )
      .catch(err => console.log(err));
  }

  loadMore() {
    const BASE_URL = 'https://pixabay.com/api/';
    const searchParams = new URLSearchParams({
      key: '29821254-cc8d55b85aa42c363f8211fb8',
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: 40,
    });
    return axios(
      `${BASE_URL}?${searchParams}&q=${this.SearchQuery}&page=${this.page}`
    )
      .then(res => {
        this.page += 1;
        return res.data.hits;

        // Notiflix.Notify.failure(
        //   "We're sorry, but you've reached the end of search results."
        // );
        // return [];
      })
      .catch(err => console.log(err));
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.SearchQuery;
  }
  set query(newSearchQueary) {
    return (this.SearchQuery = newSearchQueary);
  }
}
