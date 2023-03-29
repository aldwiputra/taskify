const logoutBtn = document.querySelector('#logout');
const main = document.querySelector('main');
const user = localStorage.getItem('loggedInUser');

if (!user) {
  logoutBtn.classList.add('opacity-0');

  main.classList.remove('invisible');

  main.innerHTML = `
    <div class="w-fit mx-auto text-center flex flex-col items-center">
      <h1 class="text-3xl text-center font-semibold mt-24 text-zinc-400">You're not logged in. Redirecting now...</h1>
      <img src="/assets/illustration-lock.png" alt="unlock illustration" class="text-center mt-12 -translate-x-8"/>
    </div>
  `;

  setTimeout(() => {
    window.location.pathname = '/login';
  }, 2000);
}

logoutBtn.addEventListener('click', ({ target }) => {
  target.innerHTML = `
  <svg class="w-[1.5em] mx-auto" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
    <circle cx="30" cy="50" fill="#ef4444" r="20">
    <animate attributeName="cx" repeatCount="indefinite" dur="1s" keyTimes="0;0.5;1" values="30;70;30" begin="-0.5s"></animate>
    </circle>
    <circle cx="70" cy="50" fill="#b91c1c" r="20">
    <animate attributeName="cx" repeatCount="indefinite" dur="1s" keyTimes="0;0.5;1" values="30;70;30" begin="0s"></animate>
    </circle>
    <circle cx="30" cy="50" fill="#ef4444" r="20">
    <animate attributeName="cx" repeatCount="indefinite" dur="1s" keyTimes="0;0.5;1" values="30;70;30" begin="-0.5s"></animate>
    <animate attributeName="fill-opacity" values="0;0;1;1" calcMode="discrete" keyTimes="0;0.499;0.5;1" dur="1s" repeatCount="indefinite"></animate>
    </circle>
  </svg>
  `;
  target.disabled = true;
  target.classList.add('w-20', 'text-center');
  localStorage.removeItem('loggedInUser');

  setTimeout(() => {
    window.location.pathname = '/login';
  }, 2000);
});

logoutBtn.classList.remove('invisible');
main.classList.remove('invisible');

const title = document.querySelector('#title');
title.innerText = `Hello, ${user[0].toUpperCase() + user.slice(1).toLowerCase()}!`;

/* ---------------------------------- LOAD TASKS DATA ---------------------------------------------- */

const taskContainer = document.querySelector('#task-container');

renderTasks();

async function renderTasks() {
  try {
    const result = await getAllTasks();

    if (result.length === 0) {
      taskContainer.innerHTML = `
        <div class="rounded-md py-12 bg-zinc-800/30 mt-4">
          <h4 class="text-center font-medium text-zinc-400 text-2xl">No tasks yet. Go create one!</h4>
          <img src="/assets/illustration-empty.png" class="mt-4 mx-auto opacity-75"/>
        </div>
        `;
    }
  } catch (err) {
    console.log(err);
  }
}

async function getAllTasks() {
  const res = await fetch('http://localhost:3000/tasks');

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return await res.json();
}

/* ------------------------------ ADD NEW TASK FUNCTIONALITY -------------------------------------- */

const addNewTaskForm = document.querySelector('#add-new-task');
