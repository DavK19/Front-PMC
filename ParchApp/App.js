import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack'; // Necesario para navegar entre pantallas
import MapaEventos from './components/eventos/MapaEventos';
import ListaEventos from './components/eventos/ListaEventos';
import DetalleEvento from './components/eventos/DetalleEvento';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const EventosStack = () => (
  <Stack.Navigator initialRouteName="Eventos">
    <Stack.Screen
        name="Eventos"
        component={ListaEventos}
        options={{ headerShown: false }}  />
    <Stack.Screen name="DetalleEvento" component={DetalleEvento} />
  </Stack.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Mapa">
        <Drawer.Screen name="Mapa" component={MapaEventos} />
        <Drawer.Screen name="Eventos" component={EventosStack} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
