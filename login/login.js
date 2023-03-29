const USERS_KEY = 'users';

const form = document.querySelector('form');
const username = document.querySelector('#username');
const password = document.querySelector('#password');
const button = document.querySelector('button[type="submit"]');

form.addEventListener('submit', event => {
  event.preventDefault();

  const users = getUsersData(USERS_KEY);
  const isValid = users.find(
    user => user.username === username.value && user.password === password.value
  );

  button.innerText = 'Loggin In...';
  button.classList.add('bg-red-500/50');
  button.disabled = true;

  if (!isValid) {
    setTimeout(() => {
      alert('Username or password is wrong');
      button.innerText = 'Login';
      button.classList.remove('bg-red-500/50');
      button.disabled = false;
    }, 1000);
  } else {
    setTimeout(() => {
      localStorage.setItem('loggedInUser', username.value);
      window.location.pathname = '/';
    }, 1000);
  }
});

function getUsersData(key) {
  const users = localStorage.getItem(key);

  return users === null ? [] : JSON.parse(users);
}
