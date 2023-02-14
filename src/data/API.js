import axios from 'axios';

axios.defaults.baseURL = 'https://be-financing-project.herokuapp.com/';
axios.defaults.headers.common = { Accept: 'application/json' };

export default axios;
