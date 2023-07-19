import { getPostListElement, getPostTemplateElement } from './selectors.js'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
import { setTextContent, truncateText } from './common.js'
export function createLiElement(post) {
  if (!post) return

  const postTemplateElement = getPostTemplateElement()
  if (!postTemplateElement) return

  const liElement = postTemplateElement.content.cloneNode(true)
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

  const postItemElement = liElement.querySelector('.post-item')
  console.log(postItemElement)
  // handle post click
  postItemElement.addEventListener('click', () => {
    console.log('click')
    const url = `${window.location.origin}/post-detail.html?id=${post.id}`
    // history.pushState({}, '', url)
    window.location.assign(url)
    return
  })

  return liElement
}

export function renderPostList(postList) {
  if (!Array.isArray(postList)) return
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
