import postAPI from '../api/postAPI.js'
import { setBackgroundImage, setInputValue } from './common.js'
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

function validateFormValues(form, formValues) {
  if (!form) return false
  let isValid = false

  // title
  isValid = validateForField({
    form,
    value: formValues?.title,
    pattern: '[A-Z][a-z]+',
    fieldSelector: `input[name='title']`,
  })

  // author
  isValid = validateForField({
    form,
    value: formValues?.author,
    pattern: '',
    fieldSelector: `input[name='author']`,
  })
  // desc
  isValid = validateForField({
    form,
    value: formValues?.description,
    pattern: '',
    fieldSelector: `textarea[name='description']`,
  })
  // imageUrl
  isValid = validateForField({
    form,
    value: formValues?.imageUrl,
    pattern: '',
    fieldSelector: `input[name='imageUrl']`,
  })
  console.log(isValid)
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
    let isValid = validateFormValues(postForm, formValues)
    // ? how set params for validation fnc?

    // if validation is invalid then set class invalid field
    // else set class valid for field

    // if trigger submit CallBack
    // otherwise

    // postForm.classList.remove('was-validated')
    postForm.classList.add('was-validated')

    if (isValid) onSubmit?.(event, defaultValues)
  })
}
