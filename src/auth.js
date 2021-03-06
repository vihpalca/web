/* globals localStorage */
import axios from 'axios';
import router from './router';

/* eslint-disable no-undef */
const API_URL = API;

export default {

  user: {
    authenticated: false,
    name: '',
  },

  login(context, model, redirect) {
    axios.post(`${API_URL}/auth`, model).then((response) => {
      localStorage.setItem('gruff_token', JSON.stringify(response.data));

      this.user.authenticated = true;
      this.user.name = response.data.user.name;
      this.loggedIn(JSON.stringify(response.data));

      if (redirect !== undefined) {
        router.push(redirect);
      }
    }, (err) => {
      const ctx = context;
      ctx.error = err.message;
    });
  },

  signup(context, model, redirect) {
    axios.post(`${API_URL}/users`, model).then((response) => {
      localStorage.setItem('gruff_token', JSON.stringify(response.data));

      this.user.authenticated = true;
      this.user.name = response.data.user.name;
      this.loggedIn(JSON.stringify(response.data));

      if (redirect !== undefined) {
        router.push(redirect);
        window.location.reload();
      }
    }, (err) => {
      const ctx = context;
      ctx.error = err.message;
    });
  },

  logout() {
    localStorage.removeItem('gruff_token');
    this.user.authenticated = false;
    this.user.name = '';
    // router.push('/');
    window.location = '/';
  },

  loggedIn(data) {
    const auth = localStorage.getItem('gruff_token') || data;
    const token = JSON.parse(localStorage.getItem('gruff_token') || data);
    if (auth !== null) {
      this.user.authenticated = true;
      this.user.name = token.user.name;
    } else {
      this.user.authenticated = false;
    }

    axios.defaults.headers.common.Authorization = `Bearer ${token.token}`;

    return this.user.authenticated;
  },

  getLoggedId() {
    const auth = localStorage.getItem('gruff_token');
    let id = 0;
    if (auth !== null) {
      id = JSON.parse(localStorage.getItem('gruff_token')).user.id;
    }
    return id;
  },

  getAuthHeader() {
    const token = JSON.parse(localStorage.getItem('gruff_token')).token;
    return {
      Authorization: `Bearer ${token}`,
    };
  },
};
