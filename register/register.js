const USERS_KEY = 'users';

const form = document.querySelector('form');
const username = document.querySelector('#username');
const password = document.querySelector('#password');
const button = document.querySelector('button[type="submit"]');

form.addEventListener('submit', event => {
  event.preventDefault();

  const users = getUsersData(USERS_KEY);
  const usernameAvailability = isUsernameAvailable(username.value, users);

  button.innerText = 'Registering...';
  button.classList.add('bg-red-500/50');
  button.disabled = true;

  if (!usernameAvailability) {
    setTimeout(() => {
      alert('username already used');
      button.innerText = 'Register';
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
