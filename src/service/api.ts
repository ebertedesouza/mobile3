import axios from 'axios';

const api = axios.create({

  baseURL: 'https://backpizza-seven.vercel.app/'
  
})

export { api };