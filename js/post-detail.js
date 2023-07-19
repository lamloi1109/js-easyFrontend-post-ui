// Work flow for post detail page
// Clicked into post -> set url to `...?id=...`
// based id to get post detail
import dayjs from 'dayjs'
import postAPI from './api/postAPI.js'
import { setTextContent, registerLightBox } from './utils/index.js'

// show information to detail page
function renderPostDetail(post) {
  if (!post) return
  // postHeroImage
  const postHeroImage = document.getElementById('postHeroImage')
  if (postHeroImage) {
    postHeroImage.style.background = `url('${post.imageUrl}')`
    postHeroImage.addEventListener('error', () => {
      postHeroImage.style.background = `url('https://placehold.co/600x400/white/black?text=HeroImage')`
    })
  }
  // title
  setTextContent(document, '#postDetailTitle', post.title)
  // author
  setTextContent(document, '#postDetailAuthor', 'by ' + post.author)
  // time
  setTextContent(
    document,
    '#postDetailTimeSpan',
    dayjs(post.updatedAt).format(' - DD/MMMM/YYYY HH:mm'),
  )
  // description
  setTextContent(document, '#postDetailDescription', post.description)
  // pageLink
  const pageEditLink = document.getElementById('goToEditPageLink')
  if (!pageEditLink) return
  pageEditLink.href = `./add-edit-post.html?id=${post.id}`
}

;(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search)
    const postId = searchParams.get('id')
    if (!postId) {
      console.log('Post not found')
      return
    }
    // fetch data
    const post = await postAPI.getById(postId)
    renderPostDetail(post[0])
    registerLightBox({
      lightBoxElementSelector: '.light-box',
      previousButtonSelector: '.light-box-main .previous',
      nextButtonSelector: '.light-box-main .next',
      closeButtonSelector: '.light-box-main .close',
    })
  } catch (error) {
    console.log('post detail error', error)
  }
})()
