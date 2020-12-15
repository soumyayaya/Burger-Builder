import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-94752.firebaseio.com/'
});

export default instance;