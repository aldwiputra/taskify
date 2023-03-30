const USERS_KEY = 'users';

const form = document.querySelector('form');
const username = document.querySelector('#username');
const password = document.querySelector('#password');
const button = document.querySelector('button[type="submit"]');

form.addEventListener('submit', event => {
  event.preventDefault();

  const users = getUsersData(USERS_KEY);
  const usernameAvailability = isUsernameAvailable(username.value, users);

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

  if (!usernameAvailability) {
    setTimeout(() => {
      alert('username already used');
      button.innerText = `Register`;
      button.classList.remove('bg-red-500/50');
      button.disabled = false;
    }, 1000);
  } else {
    users.push({
      username: username.value,
      password: password.value,
    });

    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    setTimeout(() => {
      window.location.pathname = '/login';
    }, 1000);
  }
});

function getUsersData(key) {
  const users = localStorage.getItem(key);

  return users === null ? [] : JSON.parse(users);
}

function isUsernameAvailable(username, users) {
  const isEmailUsed = users.find(user => user.username === username);

  return !Boolean(isEmailUsed);
}
