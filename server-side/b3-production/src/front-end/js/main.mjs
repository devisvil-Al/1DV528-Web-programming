

import divsCreater from "./divsCreater.mjs"
import fetching from "./fetchFunctions.mjs"

const mainFunctions = {}

export default mainFunctions

mainFunctions.logedinUser = (user) => {

  const log = document.getElementById("logout")

  if (!log) {

    const loginBtn = document.getElementById("login")
    const registerBtn = document.getElementById("register")

    const logoutBtn = document.createElement("a")
    logoutBtn.id = "logout"
    logoutBtn.className = "logout"
    logoutBtn.innerHTML = "Logout"
    loginBtn.replaceWith(logoutBtn)

    const logedinUser = document.createElement("a")
    logedinUser.id = "logedinUser"
    logedinUser.className = "logedinUser"
    logedinUser.innerHTML = user

    

    registerBtn.replaceWith(logedinUser)

    logoutBtn.onclick = () => {
      sessionStorage.removeItem("token")
      document.body.innerHTML = '<main id="main" class="main"></main>'
      mainFunctions.createHome(true)
      
      const flash = document.getElementById("flashMessage")
      flash.innerHTML = "You have been logged out"

      flash.style.display = "flex"

      setTimeout(() => {
        flash.style.display = "none"
      }
      , 5000)
    }
  }
}

mainFunctions.createHome = async (first = false) => {

  mainFunctions.clearBody();
  if (first) {
    mainFunctions.createHeader()
  }
  
  if (sessionStorage.getItem('token')) {
    
    const s = await fetching.getUserInfo()
    
    console.log(s)

    if (s) {
      mainFunctions.logedinUser(s)
    }
  }


  const div = document.createElement('div');
  div.className = 'weclomeDiv'

  const h1 = document.createElement('h1');
  h1.innerHTML = 'Welcome to My gitlab issue tracker';
  div.appendChild(h1);

  const p = document.createElement('p');

  p.innerHTML = 'This is a simple issue tracker that I made for my gitlab projects';

  div.appendChild(p);

  document.getElementById('main').appendChild(div);

}

mainFunctions.clearBody = () => {
  document.getElementById('main').innerHTML = '';
}

mainFunctions.createHeader = () => {
  // insert the header as first child of the body
  document.body.insertBefore(divsCreater.createHeader(), document.body.firstChild);

}

mainFunctions.createRegisterDiv = () => {
  mainFunctions.clearBody();
  document.getElementById('main').appendChild(divsCreater.createRegisterDiv());
}

mainFunctions.createLoginDiv = () => {
  mainFunctions.clearBody();
  document.getElementById('main').appendChild(divsCreater.createLoginDiv());
}

mainFunctions.createProjectsDiv = async () => {
  mainFunctions.clearBody();
  const projects = await fetching.getProjects();

  // rearange the projects array so that the newest project is first or the last updated is first
  projects.sort((a, b) => {
    return new Date(b.last_activity_at) - new Date(a.last_activity_at);
  });
  
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
  }
  document.getElementById('main').appendChild(divsCreater.createProjectsDiv(projects));

}

mainFunctions.createProjectDiv = async (id) => {
  mainFunctions.clearBody();
  const project = await fetching.getProject(id);
  const issues = await fetching.getIssues(id);
  // rearrange the issues array sorted on last updated
  issues.sort((a, b) => {
    return new Date(b.updated_at) - new Date(a.updated_at);
  });
  document.getElementById('main').appendChild(divsCreater.createIssuesDiv(project, issues));
}
