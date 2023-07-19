import { setBackgroundImage, setTextContent } from './common.js'

function closeLightBox(lightBoxElement) {
  if (!lightBoxElement) return
  lightBoxElement.classList.add('hide')

  const body = document.querySelector('body')
  if (!body) return
  // fix overflow hidden and child absolute
  body.style.overflow = 'visible'
  body.style.overflowX = 'hidden'
}

function showLightBox({ lightBoxElement, currentImageIndex, totalImage, imageUrl, imageName }) {
  if (!lightBoxElement) return

  lightBoxElement.classList.remove('hide')
  // show image
  const lightBoxMainElement = lightBoxElement.querySelector('.light-box-main')
  if (!lightBoxMainElement) return

  // fix overflow hidden and child absolute
  const body = document.querySelector('body')
  if (body) body.style.overflow = 'hidden'

  setBackgroundImage(lightBoxMainElement, imageUrl)

  // name img
  //   'Picsum photos'
  setTextContent(lightBoxElement, '#lightBoxImageName', imageName)

  // number img
  const imageText = `Images ${currentImageIndex} / ${totalImage}`
  setTextContent(lightBoxElement, '#lightBoxImageNumber', imageText)
}

export function registerLightBox({
  lightBoxElementSelector,
  previousButtonSelector,
  nextButtonSelector,
  closeButtonSelector,
}) {
  if (
    !lightBoxElementSelector ||
    !previousButtonSelector ||
    !nextButtonSelector ||
    !closeButtonSelector
  )
    return

  const lightBoxElement = document.querySelector(lightBoxElementSelector)
  if (!lightBoxElement) return

  let imageList = []
  let currentImageIndex = 0

  // delegation
  document.addEventListener('click', (event) => {
    const { target } = event
    if (target.tagName !== 'IMG' || !target.dataset.album) return
    // img click -> find all imgs with the same album / gallery
    const images = document.querySelectorAll(`img[data-album='${target.dataset.album}']`)
    imageList = [...images]
    // determine index of selected img
    const index = imageList.findIndex((img) => img === target)
    currentImageIndex = index
    showLightBox({
      lightBoxElement: lightBoxElement,
      currentImageIndex: currentImageIndex + 1,
      totalImage: imageList.length,
      imageUrl: target.src,
      imageName: 'Picsum photos',
    })
  })

  // handle button click
  // prev
  const previousButton = lightBoxElement.querySelector(previousButtonSelector)
  if (!previousButton) return

  previousButton.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1) % imageList.length
    if (currentImageIndex < 0) {
      currentImageIndex = (currentImageIndex + imageList.length) % imageList.length
    }

    // show image
    const lightBoxMainElement = lightBoxElement.querySelector('.light-box-main')
    if (!lightBoxMainElement) return

    // fix overflow hidden and child absolute
    const body = document.querySelector('body')
    if (body) body.style.overflow = 'hidden'

    const url = imageList[currentImageIndex]?.src

    showLightBox({
      lightBoxElement: lightBoxElement,
      currentImageIndex: currentImageIndex + 1,
      totalImage: imageList.length,
      imageUrl: url,
      imageName: 'Picsum photos',
    })
  })

  // next
  const nextButton = lightBoxElement.querySelector(nextButtonSelector)
  if (!nextButton) return

  nextButton.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % imageList.length

    if (currentImageIndex < 0) {
      currentImageIndex = (currentImageIndex + imageList.length) % imageList.length
    }

    // show image
    const lightBoxMainElement = lightBoxElement.querySelector('.light-box-main')
    if (!lightBoxMainElement) return

    // fix overflow hidden and child absolute
    const body = document.querySelector('body')
    if (body) body.style.overflow = 'hidden'

    const url = imageList[currentImageIndex]?.src
    showLightBox({
      lightBoxElement: lightBoxElement,
      currentImageIndex: currentImageIndex + 1,
      totalImage: imageList.length,
      imageUrl: url,
      imageName: 'Picsum photos',
    })
  })

  // close
  const closeButton = lightBoxElement.querySelector(closeButtonSelector)
  if (!closeButton) return

  closeButton.addEventListener('click', () => {
    closeLightBox(lightBoxElement)
  })

  // handle blur click
  lightBoxElement.addEventListener('click', (event) => {
    if (event.target.tagName == 'SECTION') closeLightBox(lightBoxElement)
  })
}
