import postAPI from '../api/postAPI.js'

function setFormValue(formData, datasetName, inputType) {
  // title
  const input = postForm.querySelector(`${inputType}[name='${datasetName}']`)
  if (!input) return
  input.value = formData ? formData[datasetName] : ''
}

export function initFormValue(formData, formName) {
  if (!formData) return
  const postForm = document.forms[formName]
  if (!postForm) return

  // title
  setFormValue(formData, 'title', 'input')
  // author
  setFormValue(formData, 'author', 'input')
  // desc
  setFormValue(formData, 'description', 'textarea')

  postForm.addEventListener('submit', (event) => {
    handleFormSubmit(event, formData)
  })
}

async function handleFormSubmit(event, formData) {
  event.preventDefault()
  // validation

  // edit or update
  if (formData.id) {
    console.log(formData)
    // const res = await postAPI.update(formData)
    // console.log(res)
  }
}
