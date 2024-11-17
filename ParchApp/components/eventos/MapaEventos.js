import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { obtenerEventos } from '../../services/api';

const MapaEventos = () => {
  const [eventos, setEventos] = useState([]);
  const [ubicacion, setUbicacion] = useState(null);

  useEffect(() => {
    const fetchEventos = async () => {
      const data = await obtenerEventos();
      setEventos(data);
    };

    const obtenerUbicacion = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permisos de ubicación denegados');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setUbicacion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    };

    fetchEventos();
    obtenerUbicacion();
  }, []);

  if (!ubicacion) {
    return <Text>Cargando ubicación...</Text>;
  }

  return (
    <MapView style={styles.map} initialRegion={ubicacion}>
      {eventos.map((evento) => (
        <Marker
          key={evento.id}
          coordinate={{ latitude: evento.latitud, longitude: evento.longitud }}
          title={evento.nombre}
          description={evento.descripcion}
        />
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default MapaEventos;