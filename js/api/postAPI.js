import instanceAxios from './axiosClient.js';

// Có 2 dạng import và export gọi là
// default
// named
// export default thì phải import default
// export named thì phải import named

// Tree Shaking: Kỹ thuật loại bỏ các code không sử dụng

// Với export/import named có hiệu quả với tree shaking

// export/ import default thì các hàm không sử dụng vẫn được import do dạng này export cả module thay vì từng function riêng lẻ như named

// Trong api module này sử dụng default export để tường minh hơn trong việc đọc hiểu code
// Do việc sử dụng named khó phần biết giữa nó là một hàm bình thường hay hàm thuộc api module

// Đa phần sử dụng named
// Nhưng khi muốn đánh đổi để lấy sự tường minh hay mục đích cụ thể nào đó ta mới sử dụng
// default

const postAPI = {
  getAll(params) {
    return instanceAxios.get('/posts', { params });
  },

  getById(postId) {
    return instanceAxios.get('/posts', {
      params: {
        id: postId,
      },
    });
  },
  add(data) {
    return instanceAxios.post('/posts', {
      data,
    });
  },
  update(data) {
    return instanceAxios.patch(`/posts/${data.id}`, {
      params,
    });
  },
  remove(postId) {
    return instanceAxios.delete(`/posts/${postId}`);
  },
};

export default postAPI;
