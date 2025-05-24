import axios from 'axios';

const api = axios.create({

  baseURL: '192.168.15.4:3000'
 // baseURL: 'https://backpizza-seven.vercel.app/'
})

export { api };