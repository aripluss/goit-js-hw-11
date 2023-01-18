import './css/styles.css';
import { PixabayAPI } from './js/fetchImages';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('#search-form');
const submitBtnEl = document.querySelector('button[type="submit"]');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

// Switcher popular/latest
const switcherDivEl = document.createElement('div');
switcherDivEl.classList.add('switcher-div');

const switcherLeftTextEl = document.createElement('span');
switcherLeftTextEl.innerHTML = 'Popular';
const switcherRightTextEl = document.createElement('span');
switcherRightTextEl.innerHTML = 'Latest';

const switcherEl = document.createElement('label');
switcherEl.classList.add('switch');

const orderToggleEl = document.createElement('input');
orderToggleEl.type = 'checkbox';

const toggleSliderEl = document.createElement('span');
toggleSliderEl.classList.add('slider');

switcherEl.append(orderToggleEl, toggleSliderEl);
switcherDivEl.append(switcherLeftTextEl, switcherEl, switcherRightTextEl);
formEl.appendChild(switcherDivEl);
//

const pixabayAPI = new PixabayAPI();

Notiflix.Notify.init({ clickToClose: true });

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

loadMoreBtnEl.classList.add('is-hidden');

formEl.addEventListener('submit', onFormSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);

async function onFormSubmit(event) {
  event.preventDefault();

  submitBtnEl.disabled = true;
  pixabayAPI.query = event.currentTarget.elements.searchQuery.value;

  try {
    if (!orderToggleEl.checked) {
      console.log('Popular results');
      pixabayAPI.order = 'popular';
    } else {
      console.log('Latest results');
      pixabayAPI.order = 'latest';
    }

    const data = await pixabayAPI.fetchImagesByQuery();
    const { hits, totalHits } = data;

    if (hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );

      loadMoreBtnEl.classList.add('is-hidden');
      galleryEl.innerHTML = '';
      submitBtnEl.disabled = false;
      return;
    }

    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

    loadMoreBtnEl.classList.remove('is-hidden');
    galleryEl.innerHTML = createPhotoCards(hits);
    submitBtnEl.disabled = false;
    lightbox.refresh();

    if (hits.length < pixabayAPI.per_page) {
      loadMoreBtnEl.classList.add('is-hidden');
    }
  } catch (err) {
    console.log(err);
  }
}

async function onLoadMoreBtnClick(event) {
  event.target.disabled = true;

  pixabayAPI.page += 1;

  try {
    const data = await pixabayAPI.fetchImagesByQuery();
    const { hits } = data;

    // if (hits.length < pixabayAPI.per_page) { // In case the button should disappear before the last array of photos
    if (hits.length === 0) {
      loadMoreBtnEl.classList.add('is-hidden');

      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );

      pixabayAPI.page = 1;
      return;
    }

    galleryEl.insertAdjacentHTML('beforeend', createPhotoCards(hits));
    lightbox.refresh();
  } catch (err) {
    console.log(err);
  } finally {
    event.target.disabled = false;
  }
}

function createPhotoCards(images) {
  return images
    .map(image => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;

      return `
        <a class='gallery__item' href='${largeImageURL}'>
          <div class="photo-card">
            <img class="img" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item"><b>Likes</b><span>${likes}</span></span></p>
              <p class="info-item"><b>Views</b><span>${views}</span></p>
              <p class="info-item"><b>Comments</b><span>${comments}</span></p>
              <p class="info-item"><b>Downloads</b><span>${downloads}</span></p>
            </div>
          </div>
        </a>
      `;
    })
    .join('');
}
