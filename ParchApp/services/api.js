import axios from 'axios';

// Cambia la URL base según tu IP o dominio del servidor
const API_URL = 'http://34.30.71.210:8080/events'; // Ejemplo: http://192.168.1.100:8000

// Obtener lista de eventos
export const obtenerEventos = async () => {
  try {
    const response = await axios.get(`${API_URL}/eventos/`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    return [];
  }
};

// Obtener lista de usuarios
export const obtenerUsuarios = async () => {
  try {
    const response = await axios.get(`${API_URL}/usuarios/`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return [];
  }
};

export const crearEvento = async (evento) => {
    try {
        const response = await axios.post(`${API_URL}/eventos/`, evento);
        return response.data;
    } catch (error) {
        console.error('Error al crear evento:', error);
        return null;
    }
}
