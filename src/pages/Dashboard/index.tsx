import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackPramsList } from '../../routes/app.routes';
import { api } from '../../service/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Dashboard() {
  const navigation = useNavigation<NativeStackNavigationProp<StackPramsList>>();
  const [number, setNumber] = useState('');

  async function openOrder() {
    if (!number || isNaN(Number(number)) || Number(number) <= 0) {
      Alert.alert('Aviso', 'Digite um número de mesa válido.');
      return;
    }

    try {
      const userData = await AsyncStorage.getItem('@santanapizzaria');
      const user = userData ? JSON.parse(userData) : null;

      if (!user?.token) {
        Alert.alert('Erro', 'Você precisa estar logado.');
        return;
      }

      const response = await api.post(
        '/order',
        { table: Number(number) },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      navigation.navigate('Order', { number, order_id: response.data.id });
      setNumber('');
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível abrir o pedido.');
    }
  }

  async function handleLogout() {
    await AsyncStorage.removeItem('@santanapizzaria');
    navigation.navigate('SignIn');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Novo pedido</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Número da mesa"
        placeholderTextColor="#F0F0F0"
        style={styles.input}
        keyboardType="numeric"
        value={number}
        onChangeText={setNumber}
      />

      <TouchableOpacity
        style={[styles.button, { opacity: number ? 1 : 0.5 }]}
        onPress={openOrder}
        disabled={!number}
      >
        <Text style={styles.buttonText}>Abrir mesa</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('OpenOrders')}>
        <Text style={styles.buttonText}>Pedidos em Aberto</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 15, backgroundColor: '#1d1d2e' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '90%', marginBottom: 20 },
  title: { fontSize: 30, fontWeight: 'bold', color: '#FFF' },
  logoutButton: { backgroundColor: '#ff4d4d', padding: 8, borderRadius: 5 },
  logoutText: { color: '#FFF', fontWeight: 'bold' },
  input: { width: '90%', height: 60, backgroundColor: '#101026', borderRadius: 4, paddingHorizontal: 8, textAlign: 'center', fontSize: 22, color: '#FFF' },
  button: { width: '90%', height: 40, backgroundColor: '#3fffa3', borderRadius: 4, marginVertical: 12, justifyContent: 'center', alignItems: 'center' },
  buttonText: { fontSize: 18, color: '#101026', fontWeight: 'bold' },
});
