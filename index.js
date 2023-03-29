if (!localStorage.getItem('loggedInUser')) {
  const main = document.querySelector('main');
  const logoutBtn = document.querySelector('#logout');

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
}
