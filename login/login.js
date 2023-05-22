const USERS_KEY = 'users';
const API_ENDPOINT = 'http://localhost:4000';

const form = document.querySelector('form');
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');
const button = document.querySelector('button[type="submit"]');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  button.innerHTML = `
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
  button.classList.add('bg-red-500/50');
  button.disabled = true;

  const loginRes = await login(usernameInput.value, passwordInput.value);

  if (loginRes && loginRes.error) {
    alert(loginRes.message);
    button.innerText = 'Login';
    button.classList.remove('bg-red-500/50');
    button.disabled = false;
  } else {
    window.location.pathname = '/';
  }
});

async function login(username, password) {
  try {
    const res = await fetch(`${API_ENDPOINT}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password,
      }),
      credentials: 'include',
    });

    return await res.json();
  } catch (err) {
    console.log(err);
  }
}
