import fetching from "./fetchFunctions.mjs"

// открытие модального окна
export function openModal(modal, func, issue, id, issueDiv){
  modal.classList.add('active')
  func(modal, issue, id, issueDiv)
}
// закрытие модального окна
export function closeModal(modal){
  modal.querySelector('.form').remove()
  modal.classList.remove('active')
}
// генерация модального окна для изменения задачи
export function editModal(modal, issue, id, issueDiv){
  const modalBlock = modal.querySelector('.modal')
  const editForm = document.createElement('form')
  editForm.classList.add('form')
  editForm.classList.add('editForm')
  editForm.innerHTML = `
    <h2 class="modal-title">Edit</h2>
      <label for="title">Title</label>
      <input type="text" class="form__input" name="title" placeholder="Title" value="${issueDiv.querySelector(".issueTitle").innerHTML}">
      <label for="state_event">State</label>
      <select class="form__select" name="state_event">
        <option value="reopen">Opened</option>
        <option value="close" >Closed</option>
      </select>
      <label for="description">Description</label>
      <textarea class="form__textarea" name="description" placeholder="Description">${issueDiv.querySelector(".issueDescription").innerHTML.split('Description: ')[1]}</textarea>
      <button class="form__button" type="submit">Edit</button>
  ` 

  console.log(issueDiv.querySelector(".issueDescription").innerHTML)
  if (issueDiv.querySelector(".issueState").textContent === 'opened') {
    editForm.elements.state_event.value = 'reopen'
  } else {
    editForm.elements.state_event.value = 'close'
  }


  editForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const {title, state_event, description} = editForm.elements
    const body = {title: title.value, state_event: state_event.value, description: description.value, id, issue_iid: issue.iid}
    fetching.editIssue(id, body, issueDiv)
    closeModal(modal)
  })

  modalBlock.appendChild(editForm)
  return modal
}

// генерация модального окна для добавления задачи
export function addModal(modal, issue, id) {
  const modalBlock = modal.querySelector('.modal')
  const editForm = document.createElement('form')
  editForm.classList.add('form')
  editForm.classList.add('editForm')
  editForm.innerHTML = `
    <h2 class="modal-title">Do you want to delete?</h2>
    <button class="form__button form__button-delete" type="submit">Delete</button>
    <button class="form__button" type="submit">No</button>
  ` 

  editForm.querySelector('.form__button-delete').addEventListener('click', () => {
    fetching.deleteIssue({issue_iid: issue.iid, id})
    closeModal(modal)
  })
  modalBlock.appendChild(editForm)
  return modal
}

