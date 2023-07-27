export function validateForField({ form, value, pattern, fieldSelector }) {  
  const reg = new RegExp(pattern, 'g')
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

  const field = form.querySelector(fieldSelector)
  let isValid = reg.test(value)

  const classValid = isValid ? 'is-valid' : 'is-invalid';

  field.classList.remove('is-valid', 'is-invalid')
  field.classList.add(classValid)

  return isValid
}
