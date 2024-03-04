
import mainFunctions from './main.mjs'
import { openModal, editModal, closeModal, addModal } from './modal.mjs'
import { state, createElement, createLocalDate } from './state.mjs'
const modal = document.querySelector('.overlay')
const modalClose = modal.querySelector('.close')
const divsCreater = {}
export default divsCreater

/**
 * creates a header element.
 * @returns {HTMLElement} header
 */
divsCreater.createHeader = () => {
  const header = createElement('header', 'header', 'header', '')
  const div = createElement('div', 'topDiv', 'topDiv', '')
  const flashMessage = createElement('div', 'flashMessage', 'flashMessage', 'xxxxxxxxxxxxxxxx')
  flashMessage.style.display = 'none'
  
  header.appendChild(divsCreater.createNavbar())
  div.appendChild(header)
  div.appendChild(flashMessage)
  return div
}

/**
 * creates a navbar element.
 * @returns {HTMLElement} navbar
 */
divsCreater.createNavbar = () => {
  const navbar = createElement('nav', 'navbar', 'navbar', '')
  const projects = createElement('a', 'projects', 'projects', 'Projects')
  const home = createElement('a', 'home', 'home', 'Home')

  navbar.appendChild(home)
  navbar.appendChild(projects)

  home.addEventListener('click', () => {
    mainFunctions.createHome()
    window.history.pushState({}, '', '/home');
  })
  projects.addEventListener('click', () => {
    window.history.pushState({}, '', '/projects');
    mainFunctions.createProjectsDiv()
  })
  return navbar
}

/**
 * creates a div for the projects.
 * @param {Array} projects
 * @returns {HTMLElement} projectsDiv
 */
divsCreater.createProjectsDiv = (projects) => {

  const projectsDiv = createElement('div', 'projectsDiv', 'projectsDiv', '')
  projects.forEach((project) => {
    projectsDiv.appendChild(divsCreater.createProjectDiv(project))
  })

  return projectsDiv
}

/**
 * creates a div for the project.
 * @param {Object} project
 * @returns {HTMLElement} projectDiv
 */
divsCreater.createProjectDiv = (project) => {
  const completeProjectDiv = createElement('div', 'completeProjectDiv', 'completeProjectDiv', '')
  const projectDiv = createElement('div', project.id, 'projectDiv', '')
  const projectName = createElement('h2', 'projectName', 'projectName', project.name)
  const str = createLocalDate(project.last_activity_at)
  const lastActivityAt = createElement('p', 'lastActivityAt', 'lastActivityAt', `Last activity at: ${str}`)

  projectDiv.appendChild(projectName)
  projectDiv.appendChild(lastActivityAt)
  completeProjectDiv.appendChild(projectDiv)

  completeProjectDiv.addEventListener('click', () => {
    window.history.pushState({}, '', '/projects/' + project.id + '/issues');
    mainFunctions.createProjectDiv(project.id)
  })
  return completeProjectDiv
}
/**
 * creates a div for the issues.
 * @param {Object} project
 * @param {Object} issues
 * @returns {HTMLElement} issuesDiv
 */
divsCreater.createIssuesDiv = (project, issues) => {
  const str = createLocalDate(project.last_activity_at)

  const projectDiv = createElement('div', 'projectDiv' + project.id, 'projectDiv', '')
  const projectName = createElement('h2', 'projectName', 'projectName', project.name)
  const projectDescription = createElement('p', 'projectDescription', 'projectDescription', project.description === null ? 'No description was added to this project' : project.description)
  const lastActivityAt = createElement('p', 'lastActivityAt', 'lastActivityAt', `Last activity at: ${str}`)
  const issuesDiv = createElement('div', 'issuesDiv', 'issuesDiv', '')
  
  if (issues.length === 0) {
    const noIssues = createElement('p', 'noIssues', 'noIssues', 'No issues is yet created for this project')
    projectDiv.appendChild(noIssues)
    return projectDiv
  }
  
  state.issuesDiv = issuesDiv
  state.creator = divsCreater.createIssueDiv
  state.project = project
  
  issues.forEach((issue) => {
    state.issues.push(issue)
  })

  projectDiv.appendChild(lastActivityAt)
  projectDiv.appendChild(issuesDiv)
  projectDiv.appendChild(projectName)
  projectDiv.appendChild(projectDescription)
  
  state.replaceIssues()
  return projectDiv
}

/**
 * Creates a div for an issue
 * @param {JSON} issue 
 * @returns 
 */
divsCreater.createIssueDiv = (issue, project) => {
  const str = createLocalDate(issue.created_at)
  const strUpdate = createLocalDate(issue.updated_at)

  const issueDiv = createElement('div', 'issueDiv' + issue.id, 'issueDiv', '')
  const issueTop = createElement('div', 'issueTop', 'issueTop', '')
  const issueTitle = createElement('h3', 'issueTitle', 'issueTitle', issue.title)
  const issueState = createElement('p', 'issueState', 'issueState', issue.state)
  const stateIndecator = createElement('span', 'stateIndecator', 'stateIndecator', '')
  const issueDescription = createElement('p', 'issueDescription', 'issueDescription', issue.description === '' ? 'Description: No description was added to this issue' : `Description: ${issue.description}`)
  const issueUpdatedAt = createElement('p', 'issueUpdatedAt', 'issueUpdatedAt', `Updated at: ${strUpdate}`)
  const issueCreatedAt = createElement('p', 'issueCreatedAt', 'issueCreatedAt', `Created at: ${str}`)
  const btnEdit = createElement('button', 'btnEdit', 'btnEdit', 'Edit')

  if (issue.state === 'opened') {
    stateIndecator.style.backgroundColor = '#2d76fc'
  } else {
    stateIndecator.style.backgroundColor = '#ff0000'
  }
  
  // const btnDelete = document.createElement('button')
  // btnDelete.className = 'btnAddIssue'
  // btnDelete.innerHTML = 'Delete issue'
  // btnDelete.addEventListener('click', () => {
  //   openModal(modal, addModal, issue, project.id, issueDiv)
  // })
  // issueDiv.appendChild(btnDelete)

  issueTop.appendChild(issueState)
  issueDiv.appendChild(issueTop)
  issueTop.appendChild(issueTitle)
  issueDiv.appendChild(issueDescription)
  issueDiv.appendChild(issueUpdatedAt)
  issueDiv.appendChild(btnEdit)
  issueDiv.appendChild(issueCreatedAt)
  issueState.appendChild(stateIndecator)

  btnEdit.addEventListener('click', () => {
    openModal(modal, editModal, issue, project.id, issueDiv)
  })
  return issueDiv
}

modalClose.addEventListener('click', () => {
  closeModal(modal)
})



