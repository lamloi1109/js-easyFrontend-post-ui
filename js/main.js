import postAPI from './api/postAPI.js';

async function main() {
  try {
    const queryParams = {
      _limit: 10,
      _page: 1,
    };
    const data = await postAPI.getAll(queryParams);
    console.log(data);
  } catch (error) {
    console.log('get all failed', error);
  }
}
main();
