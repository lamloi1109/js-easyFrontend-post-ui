import instanceAxios from './axiosClient.js';

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
