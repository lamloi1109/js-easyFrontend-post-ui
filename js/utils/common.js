export function setTextContent(parent, selector, textContent) {
  if (!parent) return

  const element = parent.querySelector(selector)
  if (!element) return

  element.textContent = textContent
}
export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text

  // ellipsis character
  return `${text.slice(0, maxLength - 1)}…`
}
