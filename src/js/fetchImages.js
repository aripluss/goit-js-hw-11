'use strict';
import axios from 'axios';

// ---------- As class with async/await and axios (with baseURL) ---------- //

export class PixabayAPI {
  static BASE_URL = 'https://pixabay.com/api/';
  static API_KEY = '32850247-834ccb9697f220487d271dcee';

  constructor() {
    this.page = 1;
    this.query = null;
    this.per_page = 40;
    axios.defaults.baseURL = PixabayAPI.BASE_URL;
  }

  async fetchImagesByQuery() {
    try {
      const response = await axios.get('/', {
        params: {
          key: PixabayAPI.API_KEY,
          q: this.query,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          page: this.page,
          per_page: this.per_page,
        },
      });

      const { data } = response;
      console.log(data);

      return data;
    } catch (err) {
      console.log(err);
    }
  }
}

// ---------- As class with async/await and axios ---------- //

// export class PixabayAPI {
//   static BASE_URL = 'https://pixabay.com';
//   static API_KEY = '32850247-834ccb9697f220487d271dcee';

//   constructor() {
//     this.page = 1;
//     this.query = null;
//     this.per_page = 40;
//   }

//   async fetchImagesByQuery() {
//     const searchParams = new URLSearchParams({
//       key: PixabayAPI.API_KEY,
//       q: this.query,
//       image_type: 'photo',
//       orientation: 'horizontal',
//       safesearch: true,
//       page: this.page,
//       per_page: this.per_page,
//     });

//     try {
//       const response = await axios.get(
//         `${PixabayAPI.BASE_URL}/api/?${searchParams}`
//       );

//       const { data } = response;
//       console.log(data);

//       return data;
//     } catch (err) {
//       console.log(err);
//     }
//   }
// }

// ---------- As class ---------- //

// export class PixabayAPI {
//   static BASE_URL = 'https://pixabay.com';
//   static API_KEY = '32850247-834ccb9697f220487d271dcee';

//   constructor() {
//     this.page = 1;
//     this.query = null;
//     // this.per_page = 40;
//   }

//   fetchImagesByQuery() {
//     const searchParams = new URLSearchParams({
//       key: PixabayAPI.API_KEY,
//       q: this.query,
//       image_type: 'photo',
//       orientation: 'horizontal',
//       safesearch: true,
//       page: this.page,
//       per_page: 40,
//     });

//     return fetch(`${PixabayAPI.BASE_URL}/api/?${searchParams}`).then(
//       response => {
//         if (!response.ok) {
//           throw new Error(response.status);
//         }

//         return response.json();
//       }
//     );
//   }
// }

// ---------- As function ---------- //

// export function fetchImagesByQuery(query) {
//   const BASE_URL = 'https://pixabay.com/api/';

//   const searchParams = new URLSearchParams({
//     key: '32850247-834ccb9697f220487d271dcee',
//     q: query,
//     image_type: 'photo',
//     orientation: 'horizontal',
//     safesearch: true,
//   });

//   return fetch(`${BASE_URL}?${searchParams}`).then(response => {
//     if (!response.ok) {
//       throw new Error(response.status);
//     }

//     return response.json();
//   });
// }
