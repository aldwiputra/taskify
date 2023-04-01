const USERS_KEY = 'users';

const form = document.querySelector('form');
const username = document.querySelector('#username');
const password = document.querySelector('#password');
const button = document.querySelector('button[type="submit"]');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  // const users = getUsersData(USERS_KEY);
  try {
    const user = await findUser(username.value);
    // const usernameAvailability = isUsernameAvailable(username.value, users);

    button.innerHTML = ` <svg class="w-[1.5em] mx-auto" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
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
          </svg>`;
    button.classList.add('bg-red-500/50');
    button.disabled = true;

    if (user.length > 0) {
      setTimeout(() => {
        alert('username already used');
        button.innerText = `Register`;
        button.classList.remove('bg-red-500/50');
        button.disabled = false;
      }, 1000);
    } else {
      const res = await createUser(username.value, password.value);

      setTimeout(() => {
        window.location.pathname = '/login';
      }, 1000);

      // users.push({
      //   username: username.value,
      //   password: password.value,
      // });
      // localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  } catch (err) {
    console.error(err);
  }
});

// function getUsersData(key) {
//   const users = localStorage.getItem(key);

//   return users === null ? [] : JSON.parse(users);
// }

async function findUser(username) {
  const res = await fetch(`http://localhost:3000/users?username=${username}`);

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return await res.json();
}

async function createUser(username, password) {
  const res = await fetch('http://localhost:3000/users', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return await res.json();
}

// async function isUsernameAvailable(username, users) {
//   const isEmailUsed = users.find((user) => user.username === username);

//   return !Boolean(isEmailUsed);
// }
