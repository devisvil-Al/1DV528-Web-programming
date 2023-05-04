
import fetching from './fetchFunctions.mjs'

import mainFunctions from './main.mjs'

const divsCreater = {}
export default divsCreater


/**
 * creates a header element.
 * @returns {HTMLElement} header
 */
divsCreater.createHeader = () => {
  const header = document.createElement('header')
  header.id = 'header'
  header.className = 'header'

  const logo = document.createElement('span')
  logo.id = 'logo'
  logo.className = 'logo'
  // set the absolute path to the logo
  // logo.src = "/logo.png" 
  logo.alt = 'logo'
  header.appendChild(logo)

  header.appendChild(divsCreater.createNavbar())

  const flashMessage = document.createElement('div')
  flashMessage.id = 'flashMessage'
  flashMessage.className = 'flashMessage'
  flashMessage.innerHTML = "xxxxxxxxxxxxxxxx"
  flashMessage.style.display = 'none'


  const div = document.createElement('div')
  div.id = 'topDiv'
  div.className = 'topDiv'
  div.appendChild(header)
  div.appendChild(flashMessage)
  
  return div
}

/**
 * creates a navbar element.
 * @returns {HTMLElement} navbar
 */
divsCreater.createNavbar = () => {
  const navbar = document.createElement('nav')
  navbar.id = 'navbar'
  navbar.className = 'navbar'

  const home = document.createElement('a')
  home.id = 'home'
  home.className = 'home'
  home.innerHTML = 'Home'
  home.onclick = () => {
    mainFunctions.createHome()
    window.history.pushState({}, '', '/home');

  }
  navbar.appendChild(home)

  const projects = document.createElement('a')
  projects.id = 'projects'
  projects.className = 'projects'
  projects.innerHTML = 'Projects'

  projects.onclick = () => {
    window.history.pushState({}, '', '/projects');
    mainFunctions.createProjectsDiv()
  }

  navbar.appendChild(projects)

  // const login = document.createElement('a')
  // login.id = 'login'
  // login.className = 'login'
  // login.innerHTML = 'Login'

  // login.onclick = () => {
  //   window.history.pushState({}, '', '/login');
  //   mainFunctions.createLoginDiv()
  // }

  // navbar.appendChild(login)

  // const register = document.createElement('a')
  // register.id = 'register'
  // register.className = 'register'
  // register.innerHTML = 'Register'

  // register.onclick = () => {
  //   window.history.pushState({}, '', '/login');
  //   mainFunctions.createRegisterDiv()
  // }

  // navbar.appendChild(register)

  return navbar
}



/**
 * creates a div for the projects.
 * @param {Array} projects
 * @returns {HTMLElement} projectsDiv
 */
divsCreater.createProjectsDiv = (projects) => {
  const projectsDiv = document.createElement('div')
  projectsDiv.id = 'projectsDiv'
  projectsDiv.className = 'projectsDiv'

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
  
  const completeProjectDiv = document.createElement('div')
  completeProjectDiv.id = 'completeProjectDiv'
  completeProjectDiv.className = 'completeProjectDiv'

  const projectDiv = document.createElement('div')
  projectDiv.id = project.id
  projectDiv.className = 'projectDiv'

  const projectName = document.createElement('h2')
  projectName.id = 'projectName'
  projectName.className = 'projectName'
  projectName.innerHTML = project.name
  projectDiv.appendChild(projectName)

  const lastActivityAt = document.createElement('p')
  lastActivityAt.id = 'lastActivityAt'
  lastActivityAt.className = 'lastActivityAt'
  const lastActivityDate = new Date(project.last_activity_at)
  const lastActivityDateStr = lastActivityDate.toDateString()
  const lastActivityTimeStr = lastActivityDate.toLocaleTimeString()
  lastActivityAt.innerHTML = `Last activity at: ${lastActivityDateStr} ${lastActivityTimeStr}`
  projectDiv.appendChild(lastActivityAt)

  completeProjectDiv.appendChild(projectDiv)

  const arrowDiv = document.createElement('div')
  arrowDiv.id = 'arrowDiv'
  arrowDiv.className = 'arrowDiv'

  const arrow = document.createElement('span')
  arrow.id = 'arrow'
  arrow.className = 'arrow'
  // arrow.src = location.origin  + './public/arrow.png'
  arrow.alt = 'arrow'

  
    
  if (sessionStorage.getItem('token')) {
    const spann = document.createElement('span')
    spann.id = 'spann'
    spann.className = 'spann'
    spann.innerHTML = 'Subscribe  '

    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.id = 'checkbox'
    checkbox.className = 'checkbox'

    spann.appendChild(checkbox)

    projectDiv.appendChild(spann)
  }


  arrowDiv.appendChild(arrow)

  completeProjectDiv.appendChild(arrowDiv)

  completeProjectDiv.addEventListener('mouseover', () => {
    completeProjectDiv.classList.add('hovered')
  })

  completeProjectDiv.addEventListener('mouseout', () => {
    completeProjectDiv.classList.remove('hovered')
  })


  arrowDiv.addEventListener('mouseover', () => {
    arrowDiv.style.cursor = 'pointer'
    arrowDiv.style.backgroundColor = "#2d76fc"
  })

  arrowDiv.addEventListener('mouseout', () => {
    arrowDiv.style.cursor = 'default'
    arrowDiv.style.backgroundColor = "#a7a5a5"
  })

  arrowDiv.addEventListener('click', () => {
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

  const projectDiv = document.createElement('div')
  projectDiv.id = 'projectDiv' + project.id
  projectDiv.className = 'projectDiv'

  const projectName = document.createElement('h2')
  projectName.id = 'projectName'
  projectName.className = 'projectName'
  projectName.innerHTML = project.name
  projectDiv.appendChild(projectName)


  //  project discripton
  const projectDescription = document.createElement('p')
  projectDescription.id = 'projectDescription'
  projectDescription.className = 'projectDescription'
  if (project.description === null) {
    projectDescription.innerHTML = 'No description was added to this project'
  } else  {
    projectDescription.innerHTML = project.description
    
  }
  projectDiv.appendChild(projectDescription)


  const lastActivityAt = document.createElement('p')
  lastActivityAt.id = 'lastActivityAt'
  lastActivityAt.className = 'lastActivityAt'
  const lastActivityDate = new Date(project.last_activity_at)
  const lastActivityDateStr = lastActivityDate.toDateString()
  const lastActivityTimeStr = lastActivityDate.toLocaleTimeString()
  lastActivityAt.innerHTML = `Last activity at: ${lastActivityDateStr} ${lastActivityTimeStr}`
  projectDiv.appendChild(lastActivityAt)


  
  if (issues.length === 0) {
    const noIssues = document.createElement('p')
    noIssues.id = 'noIssues'
    noIssues.className = 'noIssues'
    noIssues.innerHTML = 'No issues is yet created for this project'
    projectDiv.appendChild(noIssues)
    return projectDiv
  }

  const issuesDiv = document.createElement('div')
  issuesDiv.id = 'issuesDiv'
  issuesDiv.className = 'issuesDiv'

  issues.forEach((issue) => {
    issuesDiv.appendChild(divsCreater.createIssueDiv(issue))
  })

  projectDiv.appendChild(issuesDiv)

  return projectDiv
}

/**
 * Creates a div for an issue
 * @param {JSON} issue 
 * @returns 
 */
divsCreater.createIssueDiv = (issue) => {
  console.log(issue)
  const issueDiv = document.createElement('div')
  issueDiv.id = 'issueDiv'
  issueDiv.classList.add('issueDiv')
  issueDiv.classList.add(issue.id)

  const issueTop = document.createElement('div')
  issueTop.id = 'issueTop'
  issueTop.className = 'issueTop'



  const issueTitle = document.createElement('h3')
  issueTitle.id = 'issueTitle'
  issueTitle.className = 'issueTitle'
  issueTitle.innerHTML = issue.title
  issueTop.appendChild(issueTitle)

  const issueState = document.createElement('p')
  issueState.id = 'issueState'
  issueState.className = 'issueState'
  issueState.innerHTML = issue.state

  const stateIndecator = document.createElement('span')
  stateIndecator.id = 'stateIndecator'
  stateIndecator.className = 'stateIndecator'

  if (issue.state === 'opened') {
    stateIndecator.style.backgroundColor = '#2d76fc'
  } else {
    stateIndecator.style.backgroundColor = '#ff0000'
  }
  issueState.appendChild(stateIndecator)

  issueTop.appendChild(issueState)
  
  issueDiv.appendChild(issueTop)

  const issueDescription = document.createElement('p')
  issueDescription.id = 'issueDescription'
  issueDescription.className = 'issueDescription'
  if (issue.description === '') {
    issueDescription.innerHTML = 'No description was added to this issue'
  } else  {
    issueDescription.innerHTML = 'Description: ' + issue.description
  }
  issueDiv.appendChild(issueDescription)

  const issueCreatedAt = document.createElement('p')
  issueCreatedAt.id = 'issueCreatedAt'
  issueCreatedAt.className = 'issueCreatedAt'
  const issueCreatedAtDate = new Date(issue.created_at)
  const issueCreatedAtDateStr = issueCreatedAtDate.toDateString()
  const issueCreatedAtTimeStr = issueCreatedAtDate.toLocaleTimeString()
  issueCreatedAt.innerHTML = `Created at: ${issueCreatedAtDateStr} ${issueCreatedAtTimeStr}`
  issueDiv.appendChild(issueCreatedAt)

  const issueUpdatedAt = document.createElement('p')
  issueUpdatedAt.id = 'issueUpdatedAt'
  issueUpdatedAt.className = 'issueUpdatedAt'
  const issueUpdatedAtDate = new Date(issue.updated_at)
  const issueUpdatedAtDateStr = issueUpdatedAtDate.toDateString()
  const issueUpdatedAtTimeStr = issueUpdatedAtDate.toLocaleTimeString()
  issueUpdatedAt.innerHTML = `Updated at: ${issueUpdatedAtDateStr} ${issueUpdatedAtTimeStr}`
  issueDiv.appendChild(issueUpdatedAt)

  

  return issueDiv
}

/**
 * create register div
 * @returns {HTMLDivElement} registerDiv
 */
divsCreater.createRegisterDiv = () => {
  const div = document.createElement('div');
  div.classList.add('registerDiv');

  const form = document.createElement('form');
  form.setAttribute('id', 'register-form');
  form.classList.add('register-form');

  const firstNameLabel = document.createElement('label');
  firstNameLabel.setAttribute('for', 'first-name');
  firstNameLabel.innerHTML = 'First Name:';
  form.appendChild(firstNameLabel);

  const firstNameInput = document.createElement('input');
  firstNameInput.setAttribute('type', 'text');
  firstNameInput.setAttribute('id', 'first-name');
  firstNameInput.setAttribute('name', 'firstName');
  firstNameInput.setAttribute('required', '');
  form.appendChild(firstNameInput);

  const lastNameLabel = document.createElement('label');
  lastNameLabel.setAttribute('for', 'last-name');
  lastNameLabel.innerHTML = 'Last Name:';
  form.appendChild(lastNameLabel);

  const lastNameInput = document.createElement('input');
  lastNameInput.setAttribute('type', 'text');
  lastNameInput.setAttribute('id', 'last-name');
  lastNameInput.setAttribute('name', 'lastName');
  lastNameInput.setAttribute('required', '');
  form.appendChild(lastNameInput);

  const emailLabel = document.createElement('label');
  emailLabel.setAttribute('for', 'email');
  emailLabel.innerHTML = 'Email:';
  form.appendChild(emailLabel);

  const emailInput = document.createElement('input');
  emailInput.setAttribute('type', 'email');
  emailInput.setAttribute('id', 'email');
  emailInput.setAttribute('name', 'email');
  emailInput.setAttribute('required', '');
  form.appendChild(emailInput);

  const passwordLabel = document.createElement('label');
  passwordLabel.setAttribute('for', 'password');
  passwordLabel.innerHTML = 'Password:';
  form.appendChild(passwordLabel);

  const passwordInput = document.createElement('input');
  passwordInput.setAttribute('type', 'password');
  passwordInput.setAttribute('id', 'password');
  passwordInput.setAttribute('name', 'password');
  passwordInput.setAttribute('required', '');
  form.appendChild(passwordInput);

  const submitButton = document.createElement('button');
  submitButton.setAttribute('type', 'submit');
  submitButton.classList.add('submit-btn');
  submitButton.innerHTML = 'Register';
  form.appendChild(submitButton);

  submitButton.addEventListener('click', (e) => {
    e.preventDefault();

    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const user = {
      firstName,
      lastName,
      email,
      password,
    };
    fetching.registerUser(user);
  });

  div.appendChild(form);

  // Third-party registration buttons container
  const thirdPartyContainer = document.createElement('div');
  thirdPartyContainer.classList.add('third-party-container');


  const thirdPartyLabel = document.createElement('p');
  thirdPartyLabel.innerHTML = 'Or register with:';
  thirdPartyContainer.appendChild(thirdPartyLabel);

  const thirdPartyBtns = document.createElement('div');

  thirdPartyBtns.classList.add('third-party-btns');
  thirdPartyContainer.appendChild(thirdPartyBtns);

  const googleButton = document.createElement('button');
  googleButton.classList.add('third-party-btn', 'google-btn');
  googleButton.innerHTML = 'Google';
  thirdPartyBtns.appendChild(googleButton);
  googleButton.addEventListener('click', () => {
    window.location.href =  '/auth/google?method=register'
  })


  const gitlabButton = document.createElement('button');
  gitlabButton.classList.add('third-party-btn', 'gitlab-btn');
  gitlabButton.innerHTML = 'GitLab'
  thirdPartyBtns.appendChild(gitlabButton);
  gitlabButton.addEventListener('click', () => {

    window.location.href =  '/auth/gitlab?method=register'

  })

  div.appendChild(form);
  div.appendChild(thirdPartyContainer);


  return div;
}

/**
 * Creates login div
 * @returns {HTMLDivElement} login div
 */
divsCreater.createLoginDiv = () => {
  const div = document.createElement('div');
  div.classList.add('loginDiv');

  const form = document.createElement('form');
  form.setAttribute('id', 'login-form');
  form.classList.add('login-form');

  const emailLabel = document.createElement('label');
  emailLabel.setAttribute('for', 'email');
  emailLabel.innerHTML = 'Email:';
  form.appendChild(emailLabel);

  const emailInput = document.createElement('input');
  emailInput.setAttribute('type', 'email');
  emailInput.setAttribute('id', 'email');
  emailInput.setAttribute('name', 'email');
  emailInput.setAttribute('required', '');
  form.appendChild(emailInput);

  const passwordLabel = document.createElement('label');
  passwordLabel.setAttribute('for', 'password');
  passwordLabel.innerHTML = 'Password:';
  form.appendChild(passwordLabel);

  const passwordInput = document.createElement('input');
  passwordInput.setAttribute('type', 'password');
  passwordInput.setAttribute('id', 'password');
  passwordInput.setAttribute('name', 'password');
  passwordInput.setAttribute('required', '');
  form.appendChild(passwordInput);

  const submitButton = document.createElement('button');
  submitButton.setAttribute('type', 'submit');
  submitButton.classList.add('submit-btn');
  submitButton.innerHTML = 'Login';
  form.appendChild(submitButton);

  submitButton.addEventListener('click', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const user = {
      email,
      password,
    }
    fetching.loginUser(user);
  })



  div.appendChild(form);

  // Third-party login buttons container
  const thirdPartyContainer = document.createElement('div');
  thirdPartyContainer.classList.add('third-party-container');


  const thirdPartyLabel = document.createElement('p');
  thirdPartyLabel.innerHTML = 'Or login with:';
  thirdPartyContainer.appendChild(thirdPartyLabel);

  const thirdPartyBtns = document.createElement('div');

  thirdPartyBtns.classList.add('third-party-btns');
  thirdPartyContainer.appendChild(thirdPartyBtns);

  const googleButton = document.createElement('button');
  googleButton.classList.add('third-party-btn', 'google-btn');
  googleButton.innerHTML = 'Google';
  thirdPartyBtns.appendChild(googleButton);
  googleButton.addEventListener('click', () => {
    window.location.href =  '/auth/google?method=login'
  })

  const gitlabButton = document.createElement('button');
  gitlabButton.classList.add('third-party-btn', 'gitlab-btn');
  gitlabButton.innerHTML = 'GitLab'
  thirdPartyBtns.appendChild(gitlabButton);

  gitlabButton.addEventListener('click', () => {
    fetching.gitlabAuth()
    // window.location.href = '/auth/gitlab?method=login'
  
  
  })

  div.appendChild(form);
  div.appendChild(thirdPartyContainer);

  return div;
}



