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
function handleChangePostButton(formData, elementId) {
  const changePostButton = document.getElementById(elementId)
  if (!elementId || !changePostButton) return
  const postImageHeroElement = document.getElementById('postHeroImage')
  if (!postImageHeroElement) return
  changePostButton.addEventListener('click', async () => {
    const { url } = await fetch('https://picsum.photos/1378/400')
    formData.imageUrl = url
    setBackgroundImage(postImageHeroElement, url)
  })
}

function initInput({ formData, inputType, inputSelector, inputEvent, onChange }) {
  const input = document.querySelector(`input[type='${inputType}']${inputSelector}`)
  if (!input) return
  input.addEventListener(`${inputEvent}`, (event) => {
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
    const urlSearchParams = new URLSearchParams(window.location.search)
    // default params
    let post = {
      title: '',
      author: '',
      description: '',
      imageUrl: '',
    }
    if (urlSearchParams.get('id')) {
      const postId = urlSearchParams.get('id')
      const data = await postAPI.getById(postId)
      post = data[0]
    }
    // edit or update
    // init value form
    // post form
    // handle form submit
    // handle all button
    initInput({
      formData: post,
      inputType: 'input',
      inputSelector: `[name='title']`,
      inputEvent: 'input',
      onChange: (title, formData) => (formData.title = title),
    })
    initInput({
      formData: post,
      inputType: 'input',
      inputSelector: `[name='author']`,
      inputEvent: 'input',
      onChange: (author, formData) => (formData.author = author),
    })
    initInput({
      formData: post,
      inputType: 'textarea',
      inputSelector: `[name='description']`,
      inputEvent: 'input',
      onChange: (description, formData) => (formData.description = description),
    })
    initInput({
      formData: post,
      inputType: 'radio',
      inputSelector: `[data-radioId='imgJson']`,
      inputEvent: 'change',
      onChange: (id, formData) => {
        showElement(id)
      },
    })
    initInput({
      formData: post,
      inputType: 'radio',
      inputSelector: `[data-radioId='imgFormData']`,
      inputEvent: 'change',
      onChange: (id, formData) => {
        showElement(id)
      },
    })
    handleChangePostButton(post, 'postChangeImage')
    initFormValue(post, 'postForm')
  })
})()
