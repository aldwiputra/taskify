const TASKS_URL = 'http://localhost:4000';

const logoutBtn = document.querySelector('#logout');
const main = document.querySelector('main');
const totalText = document.querySelector('#total-text > span');

const loadingSpinner = document.querySelector('#loading-spinner');

async function isUserLoggedIn() {
  try {
    const response = await fetch(`${TASKS_URL}/users/me`, { credentials: 'include' });
    const result = await response.json();

    return result;
  } catch (err) {
    console.log(err);
  }
}

isUserLoggedIn().then((res) => {
  if (res.error) {
    logoutBtn.classList.add('opacity-0');

    main.innerHTML = `
    <div class="w-fit mx-auto text-center flex flex-col items-center">
    <h1 class="text-3xl text-center font-semibold mt-24 text-zinc-400">You're not logged in. Redirecting now...</h1>
    <img src="/assets/illustration-lock.png" alt="unlock illustration" class="text-center mt-12 -translate-x-8"/>
    </div>
    `;

    setTimeout(() => {
      window.location.pathname = '/login';
    }, 2000);

    return;
  }

  logoutBtn.addEventListener('click', async ({ target }) => {
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

    const logoutResponse = await logoutUser();

    if (!logoutResponse.success) {
      alert('Logout failed');
      target.disabled = false;
    }

    setTimeout(() => {
      window.location.pathname = '/login';
    }, 2000);
  });

  logoutBtn.classList.remove('invisible');
  loadingSpinner.classList.add('invisible');

  const title = document.querySelector('#title');
  title.innerText = `Hello, ${
    res.username[0].toUpperCase() + res.username.slice(1).toLowerCase()
  }!`;
});

async function logoutUser() {
  try {
    const res = await fetch(`${TASKS_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    return await res.json();
  } catch (err) {
    console.log(err);
  }
}

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

    result.forEach((element) => {
      taskElements += taskComponent(element);
    });

    taskContainer.innerHTML = taskElements;
  } catch (err) {
    taskContainer.innerHTML = `
      <div class="rounded-xl pt-12 pb-8 bg-zinc-800/30 mt-4">
        <span class="block text-center text-sm font-medium text-zinc-500">Something wrong while fetching the data </span>
        <h4 class="text-center font-medium text-zinc-400 text-2xl mt-2">Failed fetching the data</h4>
        <img src="/assets/illustration-empty.png" class="mt-4 mx-auto grayscale aspect-square"/>
      </div>
      `;

    return;
  }
}

function taskComponent(taskData) {
  console.log(taskData);
  return `
    <li class="task-item py-6 pl-8 pr-6 bg-zinc-800/30 rounded-2xl mt-4 flex justify-between items-center">
      <label
      for="done-${taskData.id}"
      class="inline-block flex-1 relative pl-[3em] leading-none cursor-pointer py-1 text-zinc-400 rounded-md bg-transparent focus:outline-0">
        <input
        id="done-${taskData.id}"
        onchange="onChangeHandler(event, ${taskData.id})"
        type="checkbox" ${taskData.done ? 'checked' : ''}
        class="absolute cursor-pointer top-1/2 left-0 h-[120%] aspect-square -translate-y-1/2 appearance-none border-[3px] border-red-500 rounded-[0.85rem]"
        />
        <span class="inline-block align-middle leading-none">${taskData.title}</span>
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

      <div class="flex gap-[.75rem]">
        <button
          title="Delete"
          class="group w-9 h-9 rounded-xl bg-red-500/10 hover:bg-red-500/20 p-[7px]"
          onclick="deleteTaskHandler(${taskData.id})"
          >
          <span class="sr-only">Delete</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full stroke-red-500">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>

        <button
          title="Show Details"
          class="group w-9 h-9 rounded-xl bg-teal-700/10 hover:bg-teal-700/20 p-[7px]"
          onclick="showDetailsHandler(${taskData.id})"
        >
          <span class="sr-only">Delete</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="stroke-teal-700 w-full h-full">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
        </button>
      </div>
    </li>
  `;
}

async function getAllTasks() {
  try {
    const res = await fetch(`${TASKS_URL}/tasks`, { credentials: 'include' });

    return await res.json();
  } catch (err) {
    console.log(err);
  }
}

/* ------------------------------------------------------------------------------------------------- */
/* ------------------------------- EDIT TASK BY ID ----------------------------------------------- */
/* ------------------------------------------------------------------------------------------------- */

async function editTaskById(id, isDone, taskName = '') {
  const labelValue = document.querySelector(`label[for="done-${id}"] > span`).textContent;

  const res = await fetch(`${TASKS_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: taskName ? taskName : labelValue,
      done: isDone,
    }),
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return await res.json();
}

async function onChangeHandler(event, id) {
  try {
    const res = await editTaskById(id, event.target.checked);
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
    credentials: 'include',
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

addNewTaskForm.addEventListener('submit', async (event) => {
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

/* ------------------------------------------------------------------------------------------------- */
/* ------------------------------------ SHOW DETAILS ----------------------------------------------- */
/* ------------------------------------------------------------------------------------------------- */

async function showDetailsHandler(id) {
  try {
    const res = await fetch(`${TASKS_URL}/${id}`);
    const data = await res.json();

    const detailOverlayElement = document.querySelector('#detail-overlay');

    detailOverlayElement.innerHTML = `
      <div class="w-[28rem] h-fit mx-auto p-6 bg-zinc-900 rounded-xl overflow-x-hidden">
        <div class="flex justify-between items-center gap-16">
          <pre class="italic bg-zinc-800/50 py-1 px-2 rounded-md text-sm text-zinc-400 font-medium">Task Id: ${
            data.id
          }</pre>
          <span class="text-sm text-zinc-400">Status: <span class="px-3 py-1 ml-1 rounded-full text-sm ${
            data.done ? 'bg-green-700/20 text-green-700' : 'bg-amber-700/20 text-amber-600'
          }">${data.done ? 'Completed' : 'In Progress'}</span></span>
        </div>

        <div class="h-[2px] mt-6 w-full bg-zinc-800/50 scale-x-[1.2]"></div>

        <div class="rounded-full p-3 w-14 h-14 bg-zinc-800/20 mx-auto mt-8 ring-2 ring-zinc-800/50">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="stroke-zinc-500/50 w-full h-full">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
          </svg>
        </div>

        <div class="relative mt-8">
          <input class="w-full py-3 pl-3 pr-24 rounded-md font-medium bg-transparent text-zinc-400 border-2 border-dashed border-zinc-400/10 focus:outline-none" value="${
            data.name
          }"/>
          <button
            onclick="saveNameChange(event, ${data.id}, ${data.done})"
            class="absolute z-10 right-3 top-1/2 -translate-y-1/2 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400/50  px-2 py-1 rounded-md text-sm font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="pointer-events-none w-5 h-5 inline mr-1 stroke-zinc-400/50">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9" />
            </svg>

            Save
          </button>
        </div>
        <button
          class="w-full mt-8 bg-red-500/20 text-red-500 rounded-md py-2 hover:bg-red-500/30"
          onclick="closeDetailsOverlay()">Close</button>
      </div>
    `;

    detailOverlayElement.classList.remove('invisible');
  } catch (err) {
    console.error(err);
  }
}

async function saveNameChange(e, id, done) {
  const taskName = e.target.parentElement.children[0].value;

  try {
    const data = await editTaskById(id, done, taskName);
    closeDetailsOverlay();
    renderTasks();
  } catch (err) {
    console.error(err);
  }
}

function closeDetailsOverlay() {
  const detailOverlayElement = document.querySelector('#detail-overlay');
  detailOverlayElement.classList.add('invisible');
}
