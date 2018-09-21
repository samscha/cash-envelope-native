import * as axios from 'axios';

const instance = axios.create();

axios.defaults.withCredentials = true;
instance.defaults.baseURL = 'https://cash-envelope.herokuapp.com/';
instance.defaults.timeout = 120000;

instance.source = axios.CancelToken.source();

instance.cancelRequests = _ => {
  instance.source.cancel();
};

export default instance;
