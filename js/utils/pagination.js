import { getPostPagination } from './selectors.js'

export function createPaginationItem({ parent, liItem, content, onChange }) {
  if (!parent || !liItem) return null
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
    onChange?.(Number.parseInt(content))
  })
  const needToActive = content === Number.parseInt(parent.dataset.page)
  if (needToActive) {
    paginationItem.classList.add('active')
  }
  return paginationItem
}

export function renderPagination({ elementId, paginationItemId, pagination, onChange }) {
  const ulPagination = document.getElementById(elementId)
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

  const paginationItemTemplate = document.getElementById(paginationItemId)
  if (!paginationItemTemplate) return

  const liItem = paginationItemTemplate.content.firstElementChild.cloneNode(true)

  if (!liItem) return

  // clear list
  const prevLink = ulPagination?.firstElementChild
  const nextLink = ulPagination?.lastElementChild
  ulPagination.textContent = ''
  ulPagination.appendChild(prevLink)
  ulPagination.appendChild(nextLink)

  // handle first item
  if (_page > 5) {
    const ellipsisItem = createPaginationItem({
      parent: ulPagination,
      liItem,
      content: '…',
      onChange,
    })
    const firstItem = createPaginationItem({
      parent: ulPagination,
      liItem,
      content: 1,
      onChange,
    })
    ulPagination.insertBefore(firstItem, ulPagination.lastElementChild)
    ulPagination.insertBefore(ellipsisItem, ulPagination.lastElementChild)
  }

  // handle middle list item
  let index = _page > 5 ? _page - 2 : 1
  for (; index <= (_page > 5 ? _page + 2 : 7); index++) {
    if (index > totalPages) break

    const paginationItem = createPaginationItem({
      parent: ulPagination,
      liItem,
      content: index,
      onChange,
    })
    ulPagination.insertBefore(paginationItem, ulPagination.lastElementChild)
  }

  // handle last item
  if (ulPagination.querySelector(`[data-page='${totalPages}']`) != null) return

  const lastItem = createPaginationItem({
    parent: ulPagination,
    liItem,
    content: totalPages,
    onChange,
  })
  ulPagination.insertBefore(lastItem, ulPagination.lastElementChild)
  const ellipsisItem = createPaginationItem({
    parent: ulPagination,
    liItem,
    content: '…',
    onChange,
  })
  ulPagination.insertBefore(ellipsisItem, lastItem)
}

export function initPagination({ elementId, defaultParams, onChange }) {
  // get postsPagination
  const postPagination = document.getElementById(elementId)
  if (!postPagination) return
  // add Event for prev
  const prevLink = postPagination.firstElementChild
  if (!prevLink) return
  // add Event for next
  const nextLink = postPagination.lastElementChild
  if (!nextLink) return
  prevLink.addEventListener('click', (event) => {
    event.preventDefault()
    const page = Number.parseInt(postPagination.dataset.page)
    if (page >= 2) onChange?.(page - 1)
  })
  nextLink.addEventListener('click', (event) => {
    event.preventDefault()
    const page = Number.parseInt(postPagination.dataset.page)
    const totalPage = postPagination.dataset.totalPages
    if (page < totalPage) {
      onChange?.(page + 1)
    }
  })
}
