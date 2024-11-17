import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { obtenerEventos } from '../../services/api';

const MapaEventos = () => {
  const [eventos, setEventos] = useState([]);
  const [ubicacion, setUbicacion] = useState(null);

  // Agrupar los eventos por ubicación
  const agruparEventosPorUbicacion = (eventos) => {
    const agrupados = {};

    eventos.forEach((evento) => {
      const claveUbicacion = `${evento.latitud.toFixed(5)},${evento.longitud.toFixed(5)}`;

      if (!agrupados[claveUbicacion]) {
        agrupados[claveUbicacion] = [];
      }

      agrupados[claveUbicacion].push(evento);
    });

    return agrupados;
  };

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

  // Agrupamos los eventos por ubicación
  const eventosAgrupados = agruparEventosPorUbicacion(eventos);

  return (
    <MapView style={styles.map} initialRegion={ubicacion}>
      {Object.keys(eventosAgrupados).map((claveUbicacion) => {
        const eventosEnUbicacion = eventosAgrupados[claveUbicacion];
        const latitudLongitud = claveUbicacion.split(',');
        const latitud = parseFloat(latitudLongitud[0]);
        const longitud = parseFloat(latitudLongitud[1]);

        return (
          <Marker
            key={claveUbicacion}
            coordinate={{ latitude: latitud, longitude: longitud }}
            title={`Eventos en esta ubicación`}
            description={`Hay ${eventosEnUbicacion.length} eventos aquí`}
          />
        );
      })}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default MapaEventos;
