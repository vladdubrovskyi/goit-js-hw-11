import axios from 'axios';
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const BASE_URL = 'https://pixabay.com/api/';
const searchParams = new URLSearchParams({
  key: '29821254-cc8d55b85aa42c363f8211fb8',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  per_page: 40,
});

export default class ImgApiSrv {
  constructor() {
    this.SearchQuery = '';
    this.page = 1;
  }

  async getImages() {
    try {
      const response = await axios.get(
        `${BASE_URL}?${searchParams}&q=${this.SearchQuery}&page=${this.page}`
      );
      this.page += 1;
      return response;
    } catch (error) {
      console.log(error);
    }
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
