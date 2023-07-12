import postAPI from './api/postAPI.js'
import { getPostListElement, getPostTemplateElement } from './selectors/selectors.js'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

function updateTextContent(liElement, selector, textContent) {
  const element = liElement.querySelector(selector)
  if (!element) {
    return
  }
  element.textContent = textContent
}

function createLiElement(post) {
  if (!post) {
    return
  }
  const postTemplateElement = getPostTemplateElement()
  if (!postTemplateElement) {
    return
  }
  const liElement = postTemplateElement.content.cloneNode(true)
  // title  - Card Title
  // description - Card Text
  // timeSpan - Text Muted
  // author
  const cardImg = liElement.querySelector(`[data-id=thumbnail]`)
  if (!cardImg) {
    return
  }
  cardImg.src = post.imageUrl

  updateTextContent(liElement, `[data-id=title]`, post.title)

  updateTextContent(liElement, `[data-id=description]`, post.description)

  updateTextContent(liElement, `[data-id=author]`, post.author)

  const timeSpanElement = liElement.querySelector(`[data-id=timeSpan]`)
  // relative time from now
  // https://day.js.org/docs/en/plugin/relative-time
  timeSpanElement.textContent = dayjs().from(dayjs(post.updatedAt))

  return liElement
}

function renderPostList(postList) {
  if (!Array.isArray(postList) || postList.length === 0) return
  const postListElement = getPostListElement()
  if (!postListElement) {
    return
  }
  // loop through postList
  postList.forEach((post) => {
    // console.log(post)
    const liElement = createLiElement(post)
    postListElement.appendChild(liElement)
  })
}

;(async () => {
  try {
    const queryParams = {
      _limit: 10,
      _page: 1,
    }
    // fetch data
    const { data, pagination } = await postAPI.getAll(queryParams)
    // render list
    // - loop through list
    // - create li element from template
    // - append child li element
    renderPostList(data)
  } catch (error) {
    console.log('get all failed', error)
  }
})()
