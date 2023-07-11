import axios from 'axios';

// Nơi nào gọi api thì luôn phải try catch ở đó
// Đối với các lỗi chung thì handle error ở axiosClient

const instanceAxios = axios.create({
  baseURL: 'https://js-post-api.herokuapp.com/api',
  headers: { 'Content-Type': 'application/json' },
});

// Add a request interceptor
instanceAxios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
instanceAxios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // Handle các common error
    // Promise.reject(error) để đẩy các lỗi đã catch lên trên parent
    // Nếu không có Promise.reject(error) thì nó sẽ coi như đã accept
    // Promise.reject(error) tương đương với throw new Error('...')
    console.log('instanceAxios - Response Error', error.response);
    if (!error.response) throw new Error('Network error. Please try again later.');
    return Promise.reject(error);
  },
);

export default instanceAxios;
