import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

// Imagen genérica para eventos
const defaultImage = 'https://th.bing.com/th/id/R.bae01f61b1db58c36b51cd85c6e2d941?rik=TaUKK1GhA7eoZA&riu=http%3a%2f%2fwww.eventaris.es%2fimages%2fslide-4.jpg&ehk=pbsePoNHobQDSerNyVzsX60Qi1dlSpuRxSaK85i81KE%3d&risl=&pid=ImgRaw&r=0';

const DetalleEvento = ({ route }) => {
  const { evento } = route.params; // Obtener datos del evento pasados por la navegación

  return (
    <View style={styles.container}>
      <Image source={{ uri: defaultImage }} style={styles.image} />
      <Text style={styles.title}>{evento.nombre}</Text>
      <Text style={styles.description}>{evento.descripcion}</Text>
      <Text style={styles.details}>Fecha: {new Date(evento.fecha).toLocaleString()}</Text>
      <Text style={styles.details}>Calificación: {evento.calificacion}</Text>
      <Text style={styles.details}>Usuarios Confirmados: {evento.usuarios.length}</Text>
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 12,
  },
  details: {
    fontSize: 14,
    marginBottom: 6,
  },
});

export default DetalleEvento;
