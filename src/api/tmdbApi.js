import axios from 'axios';

const API_KEY = '2ae6b8c15749d0c1d6c08479709405d0'; 
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbApi = {
  getTrendingMovies: async () => {
    // ⚠️ Giữ nguyên hàm này trả về results để không lỗi HeroBanner
    const response = await axios.get(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
    return response.data.results; 
  },

  // 👇 SỬA CÁC HÀM DƯỚI ĐÂY ĐỂ TRẢ VỀ FULL DATA (gồm page, total_pages, results) 👇
  getTopRatedMovies: async (page = 1) => {
    const res = await axios.get(`${BASE_URL}/movie/top_rated?page=${page}&api_key=${API_KEY}`);
    return res.data; // Đã sửa
  },

  getTrendingTV: async (page = 1) => {
    const res = await axios.get(`${BASE_URL}/trending/tv/week?page=${page}&api_key=${API_KEY}`);
    return res.data; // Đã sửa
  },

  getTopRatedTV: async () => {
    const response = await axios.get(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}`);
    return response.data.results; // Giữ nguyên vì dùng ở Home
  },
  
  // Các hàm chi tiết giữ nguyên
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

  // 👇 SỬA 2 HÀM SEARCH 👇
  searchMovie: async (keyword, page = 1) => {
    const res = await axios.get(`${BASE_URL}/search/movie?query=${keyword}&page=${page}&api_key=${API_KEY}`);
    return res.data; // Đã sửa
  },
  searchTV: async (keyword, page = 1) => {
    const res = await axios.get(`${BASE_URL}/search/tv?query=${keyword}&page=${page}&api_key=${API_KEY}`);
    return res.data; // Đã sửa
  },

  getGenres: async (type) => {
    const res = await axios.get(`${BASE_URL}/genre/${type}/list?api_key=${API_KEY}`);
    return res.data.genres;
  },

  // 👇 SỬA HÀM GENRE 👇
  getMoviesByGenre: async (genreId, page = 1) => {
    const res = await axios.get(`${BASE_URL}/discover/movie?with_genres=${genreId}&page=${page}&api_key=${API_KEY}`);
    return res.data; // Đã sửa
  },
  getImages: async (type, id) => {
    const res = await axios.get(`${BASE_URL}/${type}/${id}/images?api_key=${API_KEY}`);
    return res.data;
  }
};

export default tmdbApi;