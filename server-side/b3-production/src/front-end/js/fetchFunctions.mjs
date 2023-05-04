
// const SERVERURL = "";
const SERVERURL = "http://localhost:3000";

import mainFunctions from "./main.mjs";

const fetching = {}

export default fetching

fetching.SERVERURL = SERVERURL

fetching.getProjects = async () => {
  try {
    const projects = await fetch(`${SERVERURL}/get/projects`)
    const projectsJson = await projects.json()
    return projectsJson
  } catch (error) {
    console.error("Error on fetching the project", error)
  }
}

fetching.getProject = async (projectId) => {
  const project = await fetch(`${SERVERURL}/get/projects/${projectId}`);
  const projectJson = await project.json();
  console.log("here")
  return projectJson;
}

fetching.getIssues = async (projectId) => {
  const issues = await fetch(`${SERVERURL}/get/issues/${projectId}`);
  const issuesJson = await issues.json();
  
  return issuesJson;
}

fetching.getIssue = async (issueId) => {
  const issue = await fetch(`${SERVERURL}/get/issue/${issueId}`);
  const issueJson = await issue.json();
  console.log(issueJson);
  return issueJson;
}

fetching.getIssueComments = async (issueId) => {
  const comments = await fetch(`${SERVERURL}/get/comments/${issueId}`);
  const commentsJson = await comments.json();
  console.log(commentsJson);
  return commentsJson;
}

fetching.getIssueLabels = async (issueId) => {
  const labels = await fetch(`${SERVERURL}/get/issue/labels/${issueId}`);
  const labelsJson = await labels.json();
  console.log(labelsJson);
  return labelsJson;
}

fetching.getIssueAssignees = async (issueId) => {
  const assignees = await fetch(`${ServerUrl}/get/issue/assignees/${issueId}`);
  const assigneesJson = await assignees.json();
  console.log(assigneesJson);
  return assigneesJson;
}

fetching.getIssueMilestones = async (issueId) => {
  const milestones = await fetch(`${SERVERURL}/get/issue/milestones/${issueId}`);
  const milestonesJson = await milestones.json();
  console.log(milestonesJson);
  return milestonesJson;
}

fetching.getIssueTimeStats = async (issueId) => {
  const timeStats = await fetch(`${SERVERURL}/get/issue/timeStats/${issueId}`);
  const timeStatsJson = await timeStats.json();
  console.log(timeStatsJson);
  return timeStatsJson;
}

fetching.getIssueNotes = async (issueId) => {
  const notes = await fetch(`${SERVERURL}/get/issue/notes/${issueId}`);
  const notesJson = await notes.json();
  console.log(notesJson);
  return notesJson;
}


fetching.registerUser = async (user) => {
  const response = await fetch(`/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });

  if (response.status !== 200) {
    const flash = document.getElementById("flashMessage")
    flash.innerHTML = await response.json().message
    flash.style.display = "flex"

    setTimeout(() => {
      flash.style.display = "none"
    }
    , 10000)
  }
  else {
    const flash = document.getElementById("flashMessage")
    flash.innerHTML = await response.json().message
    flash.style.display = "flex"

    setTimeout(() => {
      flash.style.display = "none"
    }
    , 10000)

    mainFunctions.createLoginDiv();

  }

}

fetching.loginUser = async (user) => {
  const response = await fetch(`/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });

  if (response.status !== 200) {
    const flash = document.getElementById("flashMessage")
    flash.innerHTML = await response.json()
    flash.style.display = "flex"

    setTimeout(() => {
      flash.style.display = "none"
    }
    , 10000)
  }
  else {
    const flash = document.getElementById("flashMessage")
    const resJson = await response.json()
    flash.innerHTML = resJson.message

    sessionStorage.setItem("token", resJson.token)
    flash.style.display = "flex"

    setTimeout(() => {
      flash.style.display = "none"
    }
    , 10000)

    mainFunctions.createHome()
  }

}


fetching.getUserInfo = async () => {
  const res = await fetch(`${SERVERURL}/get/user-info`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    
    body: JSON.stringify({token: sessionStorage.getItem("token")}),
  })

  const resJson = await res.json()
  console.log(resJson)
  if (resJson.status !== 200) {
    if (resJson.message) {
      const flash = document.getElementById("flashMessage")
      flash.innerHTML = resJson.message
      flash.style.display = "flex"

      setTimeout(() => {
        flash.style.display = "none"
      }
      , 5000)
      
    }
    return resJson.user

  }
  else {
    return resJson.user
  }

}




fetching.subscribedProjects = async () => {
  const res = await fetch(`${SERVERURL}/get/subscribed-projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({token: sessionStorage.getItem("token")}),
  })

  const status = await res.status
  if (status !== 200) {
    const resJson = await res.json()
    const flash = document.getElementById("flashMessage")
    flash.innerHTML = resJson.message
    flash.style.display = "flex"

    setTimeout(() => {
      flash.style.display = "none"
    }
    , 10000)
  }
  else {
    
    const resJson = await res.json()
    console.log(resJson)
    return resJson.projects
  }

  
}


fetching.subscribe = async (projectId) => {
  const res = await fetch(`${SERVERURL}/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({token: sessionStorage.getItem("token"), projectId: projectId}),
  })

  const resJson = await res.json()
  console.log(resJson)
  return resJson
  
}

fetching.unsubscribe = async (projectId) => {
  const res = await fetch(`${SERVERURL}/unsubscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({token: sessionStorage.getItem("token"), projectId: projectId}),
  })

  const resJson = await res.json()
  console.log(resJson)
  return resJson
  
}


fetching.googleAuth = async () => {
  const res = await fetch(`/auth/google`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })

  const resJson = await res.json()
  if (resJson.status !== 200) {


    const flash = document.getElementById("flashMessage")
    flash.innerHTML = resJson.message
    flash.style.display = "flex"

    setTimeout(() => {
      flash.style.display = "none"
    }
    , 10000)


  }
  else {

    console.log("google auth success")

    // const flash = document.getElementById("flashMessage")
    // flash.innerHTML = resJson.message
    // flash.style.display = "flex"
    // setTimeout(() => {
    //   flash.style.display = "none"
    // }

    // , 10000)
    
  }

  
}

fetching.gitlabAuth = async () => {

  const res = await fetch(`/auth/gitlab`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })

  const resJson = await res.json()


  if (res.status !== 200) {
  
    const flash = document.getElementById("flashMessage")
    flash.innerHTML = resJson
    flash.style.display = "flex"

    setTimeout(() => {
      flash.style.display = "none"
    }
    , 10000)

    window.location.href = "/"

  }
  else {

    const flash = document.getElementById("flashMessage")
    const resJson = resJson
    flash.innerHTML = resJson.message

    sessionStorage.setItem("token", resJson.token)
    flash.style.display = "flex"

    setTimeout(() => {
      flash.style.display = "none"
    }
    , 10000)
    window.location.href = "/"

    // mainFunctions.createHome()
  }


}
