/* eslint-disable */

import { login } from './login.js';
import { displayMap } from './leaflet.js';
import { logout } from './login.js';
import { updateSettings } from './updateSettings.js';

// DOM Elements
const map = document.getElementById('map');
const form = document.getElementById('login-form');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.getElementById('data-form');
const userPasswordForm = document.getElementById('password-form');

// Displaying map
if (map) {
  const locations = JSON.parse(map.dataset.locations);
  displayMap(locations);
}

// Login functionality
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

// logging out users
if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}

// Updating User data
if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings(form, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    // chainging password button value
    document.getElementById('btn-save-password').textContent = 'Updating...';

    // Getting values of the fields from form
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    // updating
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password',
    );

    // Setting button value to default
    document.getElementById('btn-save-password').textContent = 'Save password';

    // Setting valued to null after updating
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}
