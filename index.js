const TASKS_URL = 'http://localhost:3000/tasks';

const logoutBtn = document.querySelector('#logout');
const main = document.querySelector('main');
const user = localStorage.getItem('loggedInUser');
const totalText = document.querySelector('#total-text > span');

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

/* ------------------------------------------------------------------------------------------------- */
/* ---------------------------------- LOAD TASKS DATA ---------------------------------------------- */
/* ------------------------------------------------------------------------------------------------- */

const taskContainer = document.querySelector('#task-container');

renderTasks();

async function renderTasks() {
  try {
    const result = await getAllTasks();

    totalText.innerText = result.length;

    if (result.length === 0) {
      taskContainer.innerHTML = `
        <div class="rounded-xl pt-12 pb-8 bg-zinc-800/30 mt-4">
          <span class="block text-center text-sm font-medium text-zinc-500">Start conquering your day </span>
          <h4 class="text-center font-medium text-zinc-400 text-2xl mt-2">No tasks yet. Go create one!</h4>
          <img src="/assets/illustration-empty.png" class="mt-4 mx-auto grayscale aspect-square"/>
        </div>
        `;

      return;
    }

    let taskElements = '';

    result.forEach(element => {
      taskElements += taskComponent(element);
    });

    taskContainer.innerHTML = taskElements;
  } catch (err) {
    console.log(err);
  }
}

function taskComponent(taskData) {
  return `
    <div class="task-item py-6 px-8 bg-zinc-800/30 rounded-2xl mt-4 flex justify-between items-center">
      <label
      for="done-${taskData.id}"
      class="inline-block flex-1 relative pl-[3em] leading-none cursor-pointer py-1 text-zinc-400 rounded-md bg-transparent focus:outline-0">
        <input
        id="done-${taskData.id}"
        onchange="onChangeHandler(event, ${taskData.id})"
        type="checkbox" ${taskData.done ? 'checked' : ''}
        class="absolute cursor-pointer top-1/2 left-0 h-[120%] aspect-square -translate-y-1/2 appearance-none border-[3px] border-red-500 rounded-[0.85rem]"
        />
        <span class="inline-block align-middle leading-none">${taskData.name}</span>
        <div class="transition-opacity pointer-events-none h-[120%] absolute opacity-0 -translate-y-1/2 top-1/2 left-0 aspect-square rounded-[0.85rem] bg-gradient-to-r from-red-500 to-red-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            class="origin-center scale-[0.65] stroke-zinc-900"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
      </label>

      <button 
        class="group w-10 h-10 rounded-lg hover:bg-red-500/20 p-2"
        onclick="deleteTaskHandler(${taskData.id})"
        >
        <span class="sr-only">Delete</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#a1a1aa" class="w-full h-full group-hover:stroke-red-500">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      </button>
    </div>
  `;
}

async function getAllTasks() {
  const res = await fetch(TASKS_URL);

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return await res.json();
}

/* ------------------------------------------------------------------------------------------------- */
/* ------------------------------- CHANGE TASK BY ID ----------------------------------------------- */
/* ------------------------------------------------------------------------------------------------- */

async function changeTaskById(id, isDone) {
  const labelValue = document.querySelector(`label[for="done-${id}"] > span`).textContent;

  const res = await fetch(`${TASKS_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: labelValue,
      done: isDone,
    }),
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return await res.json();
}

async function onChangeHandler(event, id) {
  try {
    const res = await changeTaskById(id, event.target.checked);
    renderTasks();
  } catch (err) {
    console.log(err);
  }
}

/* ------------------------------------------------------------------------------------------------- */
/* ---------------------------------- DELETE TASK BY ID -------------------------------------------- */
/* ------------------------------------------------------------------------------------------------- */

async function deleteTaskById(id) {
  const res = await fetch(`${TASKS_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return await res.json();
}

async function deleteTaskHandler(id) {
  try {
    const res = await deleteTaskById(id);
    renderTasks();
  } catch (err) {
    console.log(err);
  }
}

/* ------------------------------------------------------------------------------------------------- */
/* ------------------------------ ADD NEW TASK FUNCTIONALITY -------------------------------------- */
/* ------------------------------------------------------------------------------------------------- */

const addNewTaskForm = document.querySelector('#add-new-task');

addNewTaskForm.addEventListener('submit', async event => {
  event.preventDefault();

  let input = event.target.querySelector('input');
  if (input.value === '') {
    console.log('cannot be empty la');
    return;
  }

  try {
    const res = await createNewTask(input.value);
    input.value = '';
    renderTasks();
  } catch (err) {
    console.log(err);
  }
});

async function createNewTask(inputValue) {
  const res = await fetch(TASKS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: inputValue,
      done: false,
    }),
  });

  if (!res.ok) {
    throw new Error(res.status);
  }

  return await res.json();
}
