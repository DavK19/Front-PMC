import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { obtenerEventos } from '../../services/api';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';

const MapaEventos = () => {
  const [eventos, setEventos] = useState([]);
  const [ubicacion, setUbicacion] = useState(null);
  const [eventosEnUbicacion, setEventosEnUbicacion] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const bottomSheetRef = useRef();

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

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const [eventosData, locationData] = await Promise.all([
            obtenerEventos(),
            Location.requestForegroundPermissionsAsync().then(async ({ status }) => {
              if (status !== 'granted') {
                alert('Permisos de ubicación denegados');
                return null;
              }
              return Location.getCurrentPositionAsync({});
            })
          ]);

          if (locationData) {
            setUbicacion({
              latitude: locationData.coords.latitude,
              longitude: locationData.coords.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            });
          }

          setEventos(eventosData);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }, [])
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando eventos...</Text>
      </View>
    );
  }

  if (!ubicacion) {
    return <Text>Cargando ubicación...</Text>;
  }

  const eventosAgrupados = agruparEventosPorUbicacion(eventos);

  const handleMarkerPress = (eventosEnEstaUbicacion) => {
    setEventosEnUbicacion(eventosEnEstaUbicacion);
    bottomSheetRef.current.open();
  };

  return (
    <View style={styles.container}>
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
              onPress={() => handleMarkerPress(eventosEnUbicacion)}
            />
          );
        })}
      </MapView>

      <RBSheet
        ref={bottomSheetRef}
        height={400}
        openDuration={250}
        closeDuration={200}
        customStyles={{
          container: {
            padding: 10,
            backgroundColor: 'white',
          },
        }}
      >
        <Text style={styles.panelTitle}>Eventos en esta ubicación</Text>
        <FlatList
          data={eventosEnUbicacion}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.eventDetails}>
              <Text style={styles.title}>{item.nombre}</Text>
              <Text style={styles.description}>{item.descripcion}</Text>
              <Text style={styles.date}>Fecha: {new Date(item.fecha).toLocaleString()}</Text>
              <Text style={styles.rating}>Calificación: {item.calificacion}</Text>
              <Text style={styles.users}>Cantidad de usuarios: {item.usuarios.length}</Text>
            </View>
          )}
        />
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventDetails: {
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
  },
  date: {
    fontSize: 14,
  },
  rating: {
    fontSize: 14,
  },
  users: {
    fontSize: 14,
  },
});

export default MapaEventos;