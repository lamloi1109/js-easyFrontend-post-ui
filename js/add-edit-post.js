// determine flow
// edit or add
//  - edit
//  - fetch old data from api
//  - render data into form
//  - submit to server -> update post

import axios, { Axios } from 'axios'
import postAPI from './api/postAPI.js'
import { initFormValue, setBackgroundImage } from './utils/index.js'


async function handleChangePostButton(event, defaultValues) {
  const postImageHeroElement = document.getElementById('postHeroImage')
  if (!postImageHeroElement) return

  const { url } = await fetch('https://picsum.photos/1378/400')
  defaultValues.imageUrl = url
  setBackgroundImage(postImageHeroElement, url)
}

async function handleFormSubmit(event, defaultValues) {
  // console.log(defaultValues);
}

function initElement({
  defaultValues,
  elementName,
  elementType,
  elementSelector,
  elementEvent,
  onChange,
}) {
  const selector = `${elementName}${
    elementName === 'input' ? `[type='${elementType}']` : ''
  }${elementSelector}`

  const element = document.querySelector(selector)
  if (!element) return
  element.addEventListener(`${elementEvent}`, (event) => {
    onChange(event.target.value, defaultValues)
  })
}

function showElement(id) {
  const imgFormData = document.getElementById('imgFormData')
  const imgJson = document.getElementById('imgJson')

  if (!id || !imgFormData || !imgJson) return
  imgFormData.hidden = true
  imgJson.hidden = true
  const element = document.getElementById(id)
  element.hidden = false
}

;(() => {
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const urlSearchParams = new URLSearchParams(window.location.search)
      const postId = urlSearchParams.get('id')
      // default params
      // add Boolean to implicit
      const defaultValues = Boolean(postId)
        ? (await postAPI.getById(postId))[0]
        : {
            title: '',
            author: '',
            description: '',
            imageUrl: '',
          }

      // edit or update
      // init value form
      // post form
      // handle form submit
      // handle all button
      initFormValue({
        defaultValues,
        formName: 'postForm',
        onSubmit: (event, defaultValues) => handleFormSubmit(event, defaultValues),
      })

      initElement({
        defaultValues,
        elementName: 'Button',
        elementType: 'Button',
        elementSelector: `#postChangeImage`,
        elementEvent: 'click',
        onChange: (event, defaultValues) => handleChangePostButton(event, defaultValues),
      })
    } catch (error) {
      console.log('add edit error', error)
    }
  })
})()
