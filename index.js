const logoutBtn = document.querySelector('#logout');
const main = document.querySelector('main');

if (!localStorage.getItem('loggedInUser')) {
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
  target.innerHTML = `<img src="assets/spinner.svg" class="w-[1.5em] mx-auto"/>`;
  target.disabled = true;
  target.classList.add('w-20', 'text-center');
  localStorage.removeItem('loggedInUser');

  setTimeout(() => {
    window.location.pathname = '/login';
  }, 1000);
});

logoutBtn.classList.remove('invisible');
main.classList.remove('invisible');
