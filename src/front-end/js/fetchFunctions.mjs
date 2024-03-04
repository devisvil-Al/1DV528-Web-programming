
// const SERVERURL = "";
const SERVERURL = "http://localhost:3000";
const fetching = {}
fetching.SERVERURL = SERVERURL

// получение проектов
fetching.getProjects = async () => {
  try {
    const projects = await fetch(`${SERVERURL}/get/projects`)
    console.log(projects);
    const projectsJson = await projects.json()
    return projectsJson
  } catch (error) {
    console.error("Error on fetching the project", error)
  }
}

// получение проекта
fetching.getProject = async (projectId) => {
  const project = await fetch(`${SERVERURL}/get/projects/${projectId}`);
  const projectJson = await project.json();
  return projectJson;
}

// получение задач
fetching.getIssues = async (projectId) => {
  const issues = await fetch(`${SERVERURL}/get/issues/${projectId}`);
  const issuesJson = await issues.json();
  return issuesJson;
}

// получение задачи
fetching.getIssue = async (issueId) => {
  const issue = await fetch(`${SERVERURL}/get/issue/${issueId}`);
  const issueJson = await issue.json();
  console.log(issueJson);
  return issueJson;
}

// изменение задачи
fetching.editIssue = async (issueId, data, issueDiv) => {
    const res = await fetch(`${SERVERURL}/get/issue/edit`, {
      method: 'POST',
      headers: {
        'PRIVATE-TOKEN' : 'glpat-o8fHy5GcypfagLzb4t8g',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    })
   console.log(res)
}

export default fetching

// fetching.deleteIssue = async (data) => {
//   const res = await fetch(`${SERVERURL}/get/issue/delete`, {
//     method: 'POST',
//     headers: {
//       'PRIVATE-TOKEN' : 'glpat-o8fHy5GcypfagLzb4t8g',
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(data),
//   })
//   console.log(res)
// }

// fetching.editIssue = async (issueId, data, issueDiv) => {
//   const res = await fetch(`https://gitlab.lnu.se/api/v4/projects/40169/issues/${data.issue_iid}`, {
//     method: 'PUT',
//     headers: {
//       'PRIVATE-TOKEN' : 'glpat-o8fHy5GcypfagLzb4t8g',
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(data),
//   })



