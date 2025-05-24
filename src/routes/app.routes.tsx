import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignIn from '../pages/SignIn';
import Dashboard from '../pages/Dashboard';
import Order from '../pages/Order';
import FinishOrder from '../pages/FinishOrders'; 
import OpenOrders from '../pages/OpenOrders/OpenOrders'; 

export type StackPramsList = {
  SignIn: undefined;
  Dashboard: undefined;
  Order: {
    number: number | string;
    order_id: string;
  };
  FinishOrder: {
    number: number | string;
    order_id: string;
  };
  OpenOrders: undefined; 
};

const Stack = createNativeStackNavigator<StackPramsList>();

function AppRoutes() {
  return (
    <Stack.Navigator initialRouteName="SignIn">
      <Stack.Screen 
        name="SignIn"
        component={SignIn} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Dashboard" 
        component={Dashboard} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen
        name="Order"
        component={Order}
        options={{ headerShown: false }} 
      />
      <Stack.Screen
        name="FinishOrder"
        component={FinishOrder}
        options={{
          title: 'Finalizando',
          headerStyle: {
            backgroundColor: '#1d1d2e',
          },
          headerTintColor: '#FFF',
        }} 
      />
      <Stack.Screen
        name="OpenOrders" 
        component={OpenOrders}
        options={{
          title: 'Pedidos em Aberto',
          headerStyle: {
            backgroundColor: '#1d1d2e',
          },
          headerTintColor: '#FFF',
        }} 
      />
    </Stack.Navigator>
  );
}

export default AppRoutes;
