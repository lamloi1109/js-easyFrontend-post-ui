import postAPI from './api/postAPI.js'
import {
  getPostListElement,
  getPostPagination,
  getPostTemplateElement,
} from './selectors/selectors.js'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { setTextContent, truncateText } from './utils/index.js'

dayjs.extend(relativeTime)

function createLiElement(post) {
  if (!post) return

  const postTemplateElement = getPostTemplateElement()
  if (!postTemplateElement) return

  const liElement = postTemplateElement.content.cloneNode(true)
  // title  - Card Title
  // description - Card Text
  // timeSpan - Text Muted
  // author
  const cardImg = liElement.querySelector(`[data-id=thumbnail]`)
  if (cardImg) {
    cardImg.src = post.imageUrl
    cardImg.addEventListener('error', () => {
      cardImg.src = 'https://placehold.co/600x400/white/black?text=Thumbnail'
    })
  }

  // Đôi khi việc sử dụng các function giúp code ít hơn nhưng lại gây khó hiểu cho người đọc
  // Chính vì vậy cần phải cân nhắc việc này
  setTextContent(liElement, `[data-id=title]`, post.title)

  setTextContent(liElement, `[data-id=description]`, truncateText(post.description, 150))

  setTextContent(liElement, `[data-id=author]`, post.author)

  // Các thao tác về thời gian ... thường sử dụng các thư viện hổ trợ thay vì tự code
  // relative time from now
  // https://day.js.org/docs/en/plugin/relative-time
  setTextContent(liElement, `[data-id=timeSpan]`, dayjs().from(dayjs(post.updatedAt)))

  return liElement
}

function renderPostList(postList) {
  if (!Array.isArray(postList) || postList.length === 0) return
  const postListElement = getPostListElement()
  if (!postListElement) {
    return
  }
  postListElement.textContent = ''
  // loop through postList
  postList.forEach((post) => {
    const liElement = createLiElement(post)
    postListElement.appendChild(liElement)
  })
}

function createPaginationItem(ulPagination, liItem, content) {
  if (!ulPagination || !liItem) return null

  const paginationItem = liItem.cloneNode(true)

  paginationItem.dataset.page = content
  const linkElement = paginationItem.querySelector('.page-link')
  linkElement.textContent = content
  if (content === '…') {
    paginationItem.setAttribute('disabled', true)
    linkElement.setAttribute('aria-disabled', true)
    linkElement.addEventListener('click', (event) => {
      event.preventDefault()
    })
    return paginationItem
  }
  const url = new URL(window.location)
  url.searchParams.set('_page', content)
  linkElement.href = url.toString()

  linkElement.addEventListener('click', (event) => {
    event.preventDefault()
    handleFilterChange('_page', Number.parseInt(content))
  })

  if (content === Number.parseInt(ulPagination.dataset.page)) {
    paginationItem.classList.add('active')
  }
  return paginationItem
}

function renderPagination(pagination) {
  const ulPagination = getPostPagination()
  if (!ulPagination || !pagination) {
    return
  }
  const { _page, _limit, _totalRows } = pagination
  // calc pagination
  const totalPages = Math.ceil(_totalRows / _limit)
  // save page and totalPagination to ulElement
  ulPagination.dataset.page = _page
  ulPagination.dataset.totalPages = totalPages
  // check if enable/disable links (prev/next)
  if (_page <= 1) {
    ulPagination.firstElementChild?.classList.add('disabled')
  } else {
    ulPagination.firstElementChild?.classList.remove('disabled')
  }

  if (_page >= totalPages) {
    ulPagination.lastElementChild?.classList.add('disabled')
  } else {
    ulPagination.lastElementChild?.classList.remove('disabled')
  }

  const paginationItemTemplate = document.getElementById('paginationItem')
  if (!paginationItemTemplate) return

  const liItem = paginationItemTemplate.content.firstElementChild.cloneNode(true)

  if (!liItem) return

  // clear list
  const prevLink = ulPagination.firstElementChild
  const nextLink = ulPagination.lastElementChild
  ulPagination.textContent = ''
  ulPagination.appendChild(prevLink)
  ulPagination.appendChild(nextLink)

  // handle first item
  if (_page > 5) {
    const ellipsisItem = createPaginationItem(ulPagination, liItem, '…')
    const firstItem = createPaginationItem(ulPagination, liItem, 1)
    ulPagination.insertBefore(firstItem, ulPagination.lastElementChild)
    ulPagination.insertBefore(ellipsisItem, ulPagination.lastElementChild)
  }

  // handle middle list item
  let index = _page > 5 ? _page - 2 : 1
  for (; index <= (_page > 5 ? _page + 2 : 7); index++) {
    if (index > totalPages) break

    const paginationItem = createPaginationItem(ulPagination, liItem, index)
    ulPagination.insertBefore(paginationItem, ulPagination.lastElementChild)
  }

  // handle last item

  if (ulPagination.querySelector(`[data-page='${totalPages}']`) != null) {
    return
  }

  const endItem = createPaginationItem(ulPagination, liItem, totalPages)
  ulPagination.insertBefore(endItem, ulPagination.lastElementChild)
  const ellipsisItem = createPaginationItem(ulPagination, liItem, '…')

  ulPagination.insertBefore(ellipsisItem, endItem)
}

async function handleFilterChange(filterName, filterValue) {
  // update queryParams
  const url = new URL(window.location)
  url.searchParams.set(filterName, filterValue)
  const queryParams = new URLSearchParams(url.searchParams)

  history.pushState({}, '', url)
  // fetch API
  const { data, pagination } = await postAPI.getAll(queryParams)
  // re-render postList
  renderPostList(data)
  renderPagination(pagination)
}

async function handlePrevClick(event) {
  event.preventDefault()
  const ulPagination = getPostPagination()
  const page = Number.parseInt(ulPagination.dataset.page)
  if (page <= 1) {
    return
  }
  handleFilterChange('_page', page - 1)
}
function handleNextClick(event) {
  event.preventDefault()
  const ulPagination = getPostPagination()
  const page = Number.parseInt(ulPagination.dataset.page)
  const totalPage = ulPagination.dataset.totalPage
  if (page >= totalPage) {
    return
  }
  handleFilterChange('_page', page + 1)
}

function initPagination() {
  // get postsPagination
  const postPagination = getPostPagination()
  if (!postPagination) return
  // add Event for prev
  const prevLink = postPagination.querySelector('[aria-label=Previous]')
  if (!prevLink) return
  // add Event for next
  const nextLink = postPagination.querySelector('[aria-label=Next]')
  if (!nextLink) return
  prevLink.addEventListener('click', handlePrevClick)
  nextLink.addEventListener('click', handleNextClick)
}

function initUrl() {
  const url = new URL(window.location)
  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)

  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)

  history.pushState({}, '', url)
}

;(async () => {
  try {
    // initUrl
    initUrl()
    initPagination()
    const queryParams = new URLSearchParams(window.location.search)
    // fetch data
    const { data, pagination } = await postAPI.getAll(queryParams)

    // render list
    renderPostList(data)
    renderPagination(pagination)
  } catch (error) {
    console.log('get all failed', error)
  }
})()
