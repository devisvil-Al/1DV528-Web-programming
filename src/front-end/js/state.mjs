// изменение состояния страницы
export const state = {
  projects: [],
  issues: [],
  creator : null,
  project: null,
  issuesDiv : null,
  replaceIssues: function () {
    this.issuesDiv.innerHTML = ''
    this.issues.forEach((issue) => {
      this.issuesDiv.appendChild(this.creator(issue, this.project))
    })
  }
}

// функция создания элемента
export const createElement = (tag, id, className, innerHTML) => {
  const element = document.createElement(tag)
  element.id = id
  element.className = className
  element.innerHTML = innerHTML
  return element
}

// функция создания даты
export const createLocalDate = (date) => {
  const lastActivityDate = new Date(date)
  const lastActivityDateStr = lastActivityDate.toDateString()
  const lastActivityTimeStr = lastActivityDate.toLocaleTimeString()
  return `${lastActivityDateStr} ${lastActivityTimeStr}`
}
