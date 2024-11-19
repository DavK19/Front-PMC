import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import DateTimePicker from '@react-native-community/datetimepicker';
import { crearEvento } from '../../services/api';

const CrearEvento = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState(new Date());
  const [calificacion, setCalificacion] = useState('');
  const [location, setLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const obtenerUbicacion = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permisos de ubicación denegados');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    };

    obtenerUbicacion();
  }, []);

  const handleMapPress = (e) => {
    setLocation(e.nativeEvent.coordinate);
  };

  const handleSubmit = () => {
    const evento = {
      nombre,
      descripcion,
      fecha,
      calificacion,
      "latitud": location.latitude,
      "longitud": location.longitude,
      "usuarios": [1]
    };
    console.log(evento);
    crearEvento(evento);
    navigation.goBack();
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || fecha;
    setShowDatePicker(Platform.OS === 'ios');
    setFecha(currentDate);
  };

  if (!initialRegion) {
    return <Text>Cargando ubicación...</Text>;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        onPress={handleMapPress}
      >
        {location && <Marker coordinate={location} />}
      </MapView>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nombre del evento"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Descripción"
          value={descripcion}
          onChangeText={setDescripcion}
        />
        <View>
          <Button onPress={() => setShowDatePicker(true)} title="Seleccionar Fecha" />
          {showDatePicker && (
            <DateTimePicker
              value={fecha}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}
          <Text>Fecha seleccionada: {fecha.toLocaleDateString()}</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Calificación"
          value={calificacion}
          onChangeText={setCalificacion}
        />
        <Button title="Crear Evento" onPress={handleSubmit} />
      </View>
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
  form: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default CrearEvento;