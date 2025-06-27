import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackPramsList } from '../../routes/app.routes';
import { api } from '../../service/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RouteDetailParams = {
  FinishOrder: {
    number: string | number;
    order_id: string;
  };
};

type FinishOrderRouteProp = RouteProp<RouteDetailParams, 'FinishOrder'>;

export default function FinishOrder() {
  const [loading, setLoading] = useState(false);
  const route = useRoute<FinishOrderRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<StackPramsList>>();

  async function handleFinish() {
    setLoading(true);
    try {
      const userData = await AsyncStorage.getItem('@santanapizzaria');
      const user = userData ? JSON.parse(userData) : null;

      if (!user?.token) return;

      await api.put(
        '/order/enviar',
        {
          order_id: route.params?.order_id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
      });
    } catch (err) {
      console.log('ERRO AO FINALIZAR, tente mais tarde', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.alert}>Você deseja finalizar esse pedido?</Text>
      <Text style={styles.title}>Mesa {route.params?.number}</Text>
      <TouchableOpacity style={styles.button} onPress={handleFinish} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#1d1d2e" />
        ) : (
          <>
            <Text style={styles.textButton}>Finalizar pedido</Text>
            <Feather name="shopping-cart" size={20} color="#1d1d2e" />
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d1d2e',
    paddingVertical: '5%',
    paddingHorizontal: '4%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alert: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#3fffa3',
    flexDirection: 'row',
    width: '65%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  textButton: {
    fontSize: 18,
    marginRight: 8,
    fontWeight: 'bold',
    color: '#1d1d2e',
  },
});
