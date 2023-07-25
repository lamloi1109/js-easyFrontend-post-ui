// determine flow
// edit or add
//  - edit
//  - fetch old data from api
//  - render data into form
//  - submit to server -> update post

import axios, { Axios } from 'axios'
import postAPI from './api/postAPI.js'
import { initFormValue } from './utils/index.js'

function setBackgroundImage(element, url) {
  if (!element || !url) return
  element.style.backgroundImage = `url(${url})`
}

async function handleChangePostButton(event, formData) {
  const postImageHeroElement = document.getElementById('postHeroImage')
  if (!postImageHeroElement) return

  const { url } = await fetch('https://picsum.photos/1378/400')
  formData.imageUrl = url
  setBackgroundImage(postImageHeroElement, url)
  console.log(formData)
}

function initElement({
  formData,
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
    onChange(event.target.value, formData)
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
      const post = Boolean(postId)
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
      initFormValue(post, 'postForm')
      initElement({
        formData: post,
        elementName: 'input',
        elementType: 'text',
        elementSelector: `[name='title']`,
        elementEvent: 'input',
        onChange: (title, formData) => (formData.title = title),
      })
      initElement({
        formData: post,
        elementName: 'input',
        elementType: 'text',
        elementSelector: `[name='author']`,
        elementEvent: 'input',
        onChange: (author, formData) => {
          formData.author = author
        },
      })
      initElement({
        formData: post,
        elementName: 'textarea',
        elementType: 'textarea',
        elementSelector: `[name='description']`,
        elementEvent: 'input',
        onChange: (description, formData) => (formData.description = description),
      })
      initElement({
        formData: post,
        elementName: 'input',
        elementType: 'radio',
        elementSelector: `[data-radioId='imgJson']`,
        elementEvent: 'change',
        onChange: (id, formData) => {
          showElement(id)
        },
      })
      initElement({
        formData: post,
        elementName: 'input',
        elementType: 'radio',
        elementSelector: `[data-radioId='imgFormData']`,
        elementEvent: 'change',
        onChange: (id, formData) => {
          showElement(id)
        },
      })

      initElement({
        formData: post,
        elementName: 'Button',
        elementType: 'Button',
        elementSelector: `#postChangeImage`,
        elementEvent: 'click',
        onChange: (event, formData) => handleChangePostButton(event, formData),
      })
    } catch (error) {
      console.log('add edit error', error)
    }
  })
})()
