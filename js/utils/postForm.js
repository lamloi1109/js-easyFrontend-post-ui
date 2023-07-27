import postAPI from '../api/postAPI.js'
import { setBackgroundImage, setInputValue } from './common.js'

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
    console.log(formValues)
    // validation
    // using vanilla js
    // String value
    // check empty value
    // check length
    // check special character

    // Image
    // Check type image
    // number of file
    // Check width and height

    // imageUrl -> Check url valid

    // using yup

    // if trigger submit CallBack
    // otherwise
    onSubmit?.(event, defaultValues)
  })
}
