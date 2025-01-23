/* eslint-disable*/
import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './maptiler';
import { updateUser } from './updateSettings';
import { bookTrip } from './stripe';

const maptiler = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutButton = document.querySelector('.nav__el--logout');
const updateUserForm = document.querySelector('.form-user-data');
const updatePasswordForm = document.querySelector('.form-user-password');
const bookButton = document.getElementById('book-trip');

if (maptiler) {
  const locations = JSON.parse(maptiler.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logoutButton) {
  logoutButton.addEventListener('click', (e) => logout());
}

if (updateUserForm)
  updateUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('image', document.getElementById('image').files[0]);

    updateUser(form, 'data');
  });

if (updatePasswordForm) {
  updatePasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.getElementById('btn-save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateUser(
      { passwordCurrent, password, passwordConfirm },
      'password',
    );
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
    document.getElementById('btn-save-password').textContent = 'Save password';
  });
}

if (bookButton) {
  bookButton.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tripId } = e.target.dataset;
    bookTrip(tripId);
  });
}
