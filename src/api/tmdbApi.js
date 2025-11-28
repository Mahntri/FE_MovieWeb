import axios from 'axios';

const API_KEY = '2ae6b8c15749d0c1d6c08479709405d0'; 
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbApi = {
  getTrendingMovies: async () => {
    const response = await axios.get(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
    return response.data.results; 
  },

  getTopRatedMovies: async (page = 1) => {
    const res = await axios.get(`${BASE_URL}/movie/top_rated?page=${page}&api_key=${API_KEY}`);
    return res.data;
  },

  getTrendingTV: async (page = 1) => {
    const res = await axios.get(`${BASE_URL}/trending/tv/week?page=${page}&api_key=${API_KEY}`);
    return res.data;
  },

  getTopRatedTV: async () => {
    const response = await axios.get(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}`);
    return response.data.results;
  },
  
  getMovieVideos: async (movieId) => {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
    return response.data.results;
  },
  getDetail: async (type, id) => {
    const res = await axios.get(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}`);
    return res.data;
  },
  getCredits: async (type, id) => {
    const res = await axios.get(`${BASE_URL}/${type}/${id}/credits?api_key=${API_KEY}`);
    return res.data;
  },
  getVideos: async (type, id) => {
    const res = await axios.get(`${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}`);
    return res.data.results;
  },
  getSimilar: async (type, id) => {
    const res = await axios.get(`${BASE_URL}/${type}/${id}/similar?api_key=${API_KEY}`);
    return res.data.results;
  },

  searchMovie: async (keyword, page = 1) => {
    const res = await axios.get(`${BASE_URL}/search/movie?query=${keyword}&page=${page}&api_key=${API_KEY}`);
    return res.data;
  },
  searchTV: async (keyword, page = 1) => {
    const res = await axios.get(`${BASE_URL}/search/tv?query=${keyword}&page=${page}&api_key=${API_KEY}`);
    return res.data;
  },

  getGenres: async (type) => {
    const res = await axios.get(`${BASE_URL}/genre/${type}/list?api_key=${API_KEY}`);
    return res.data.genres;
  },

  getMoviesByGenre: async (genreId, page = 1) => {
    const res = await axios.get(`${BASE_URL}/discover/movie?with_genres=${genreId}&page=${page}&api_key=${API_KEY}`);
    return res.data;
  },
  getImages: async (type, id) => {
    const res = await axios.get(`${BASE_URL}/${type}/${id}/images?api_key=${API_KEY}`);
    return res.data;
  },
  getPersonDetail: async (id) => {
    const res = await axios.get(`${BASE_URL}/person/${id}?api_key=${API_KEY}`);
    return res.data;
  },

  getPersonCredits: async (id) => {
    const res = await axios.get(`${BASE_URL}/person/${id}/combined_credits?api_key=${API_KEY}`);
    return res.data;
  },
  searchMulti: async (keyword, page = 1) => {
    const res = await axios.get(`${BASE_URL}/search/multi?query=${keyword}&page=${page}&api_key=${API_KEY}`);
    return res.data; 
  },
  getTVsByGenre: async (genreId, page = 1) => {
    const res = await axios.get(`${BASE_URL}/discover/tv?with_genres=${genreId}&page=${page}&api_key=${API_KEY}`);
    return res.data;
  },
  getMoviesByYear: async (year, page = 1) => {
    const res = await axios.get(`${BASE_URL}/discover/movie?primary_release_year=${year}&page=${page}&api_key=${API_KEY}&sort_by=popularity.desc`);
    return res.data;
  },
  getMoviesByCountry: async (countryCode, page = 1) => {
    const res = await axios.get(`${BASE_URL}/discover/movie?with_origin_country=${countryCode}&page=${page}&api_key=${API_KEY}&sort_by=popularity.desc`);
    return res.data;
  }
};

export default tmdbApi;