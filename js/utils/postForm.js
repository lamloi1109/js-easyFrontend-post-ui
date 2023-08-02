import postAPI from '../api/postAPI.js'
import { setBackgroundImage, setInputValue, setTextContent } from './common.js'
import { validateForField } from './validation.js'

function setFormValue(form, selector, formValue) {
  setInputValue({
    parent: form,
    selector,
    value: formValue,
  })
}

function setFormValues(form, formValues) {
  if (!form) return
  setFormValue(form, `input[name='title']`, formValues?.title)
  // author
  setFormValue(form, `input[name='author']`, formValues?.author)
  // desc
  setFormValue(form, `textarea[name='description']`, formValues?.description)
  // imageURL
  setFormValue(form, `input[name='imageUrl']`, formValues?.imageUrl)
}

function getTitleError(form) {
  const titleElement = form.querySelector(`[name='title']`)
  if (!titleElement) return
  // required
  if (titleElement.validity.valueMissing) {
    return 'Please enter title!'
  }
  // at least two word
  if (titleElement.validity.tooLong) {
    return 'Too Long!'
  }
  if (titleElement.validity.tooShort) {
    return 'Too Short!'
  }
  return ''
}

function getAuthorError(form) {
  const authorElement = form.querySelector(`[name='author']`)
  if (!authorElement) return
  // required
  if (authorElement.validity.valueMissing) {
    return 'Please enter author!'
  }
  // at least two word
  if (authorElement.validity.tooLong) {
    return 'Too Long!'
  }
  if (authorElement.validity.tooShort) {
    return 'Too Short!'
  }
  return ''
}

function getDescriptionError(form) {
  return ''
}

function getImageUrlError(form) {
  return ''
}

function validateFormValues(form, formValues) {
  // get errors
  const errors = {
    title: getTitleError(form),
    author: getAuthorError(form),
    description: getDescriptionError(form),
    imageUrl: getImageUrlError(form),
  }
  // set errors
  for (const key in errors) {
    const element = form.querySelector(`[name='${key}']`)
    if (element) {
      // set custom error message
      element.setCustomValidity(errors[key])
      // set text message
      setTextContent(element.parentElement, '.invalid-feedback', errors[key])
    }
  }
  // add was-validated class to form element after set error message for fields
  // checkValidity trigger invalid event to validate form
  const isValid = form.checkValidity()
  if (!isValid) form.classList.add('was-validated')

  return isValid
}

function getFormValues(form) {
  const formValues = {}
  // type formData to type json Data
  // formData can't not accept input unchecked or disabled
  const data = new FormData(form)
  for (const [key, value] of data) {
    formValues[key] = value
  }
  return formValues
}

export function initFormValue({ defaultValues, formName, onSubmit }) {
  if (!defaultValues) return
  const postForm = document.forms[formName]
  if (!postForm) return

  setFormValues(postForm, defaultValues)
  // set background for heroImage
  const postHeroImage = document.getElementById('postHeroImage')
  if (postHeroImage) setBackgroundImage(postHeroImage, defaultValues?.imageUrl)

  postForm.addEventListener('submit', (event) => {
    event.preventDefault()
    // get form values
    const formValues = getFormValues(postForm)
    // validation
    let isValid = false
    // let isValid = validateFormValues(postForm, formValues)
    // ? how set params for validation fnc?

    // if validation is invalid then set class invalid field
    // else set class valid for field

    // if trigger submit CallBack
    // otherwise

    if (!validateFormValues(postForm, formValues)) return

    onSubmit?.(event, defaultValues)
  })
}
