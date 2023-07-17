import postAPI from './api/postAPI.js'

import { initSearchPost, renderPostList, setTextContent, truncateText } from './utils/index.js'
import { initPagination, renderPagination } from './utils/pagination.js'

async function handleFilterChange(filterName, filterValue) {
  // update queryParams
  const url = new URL(window.location)
  url.searchParams.set(filterName, filterValue)

  if (filterName === 'title_like') url.searchParams.set('_page', 1)

  history.pushState({}, '', url)
  // fetch API
  const { data, pagination } = await postAPI.getAll(url.searchParams)
  // re-render postList
  renderPostList(data)
  renderPagination({
    elementId: 'postsPagination',
    paginationItemId: 'paginationItem',
    pagination: pagination,
    onChange: (page) => handleFilterChange('_page', page),
  })
}

;(async () => {
  try {
    // Cần phải viết code rõ ràng dễ hiểu
    // Khi nhìn vào ta hiểu dc flow code chạy 
    // Những gì chi tiết ta chia thành các file khác
    // Tạo fnc mới đồng nghĩa với đánh đổi giữa việc code khó hơn và code ít dòng hơn
    const url = new URL(window.location)
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)

    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)

    history.pushState({}, '', url)
    const queryParams = new URLSearchParams(url.searchParams)

    initPagination({
      elementId: 'postsPagination',
      defaultParams: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    })
    initSearchPost({
      elementId: 'searchPostInput',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('title_like', value),
    })

    const { data, pagination } = await postAPI.getAll(queryParams)

    // render
    renderPostList(data)
    renderPagination({
      elementId: 'postsPagination',
      paginationItemId: 'paginationItem',
      pagination,
      onChange: (page) => handleFilterChange('_page', page),
    })
  } catch (error) {
    console.log('get all failed', error)
  }
})()
