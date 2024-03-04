import divsCreater from "./divsCreater.mjs"
import fetching from "./fetchFunctions.mjs"
import { createElement } from "./state.mjs"

const mainFunctions = {}
const wrapper = document.querySelector('.wrapper')

// стартовая страница
mainFunctions.createHome = async (first = false) => {

  mainFunctions.clearBody();
  if (first) {
    mainFunctions.createHeader()
  }
  
  const div = createElement('div', 'weclomeDiv', '', '');
  const h1 = createElement('h1', 'h1', '', 'Hello! it is a simple issue tracker');
  const p = createElement('p', 'p', '', 'From Katerina with love');

  div.appendChild(h1);
  div.appendChild(p);
  document.getElementById('main').appendChild(div);
}
// очистка страницы
mainFunctions.clearBody = () => {
  document.getElementById('main').innerHTML = '';
}
// создание хедера
mainFunctions.createHeader = () => {
  wrapper.prepend(divsCreater.createHeader(), document.body.firstChild);
}

// создание контейнера проектов
mainFunctions.createProjectsDiv = async () => {
  mainFunctions.clearBody();
  const projects = await fetching.getProjects();
  projects.sort((a, b) => {
    return new Date(b.last_activity_at) - new Date(a.last_activity_at);
  });
  
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
  }
  document.getElementById('main').appendChild(divsCreater.createProjectsDiv(projects));

}
// создание проекта
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

export default mainFunctions
