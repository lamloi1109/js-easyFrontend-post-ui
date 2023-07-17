import debounce from 'lodash.debounce'

export function initSearchPost({ elementId, defaultParams, onChange }) {
  const searchPostInput = document.getElementById(elementId)
  if (!searchPostInput) return
  if (defaultParams.get('title_like')) {
    searchPostInput.value = defaultParams.get('title_like')
  }

  const debounceSearch = debounce((event) => {
    onChange?.(event.target.value)
  }, 500)
  searchPostInput.addEventListener('input', debounceSearch)
}
