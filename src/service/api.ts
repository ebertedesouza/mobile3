import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backpizza-seven.vercel.app/',
});

interface Credentials {
  email: string;
  password: string;
}

const login = async (credentials: Credentials) => {
  try {
    const response = await api.post('/session', {
      email: credentials.email,
      password: credentials.password,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert('Erro na requisição. Tente novamente.');
      }
    } else {
      alert('Erro inesperado. Tente novamente.');
    }
  }
};

export { api, login };
