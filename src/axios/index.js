import * as axios from 'axios';

const instance = axios.create();

axios.defaults.withCredentials = true;
instance.defaults.baseURL = 'https://cash-envelope.herokuapp.com/';
instance.defaults.timeout = 50000;

export default instance;
