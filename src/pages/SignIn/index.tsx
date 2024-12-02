import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackPramsList } from '../../routes/app.routes';
import { api } from '../../service/api';

export default function SignIn() {
  const navigation = useNavigation<NativeStackNavigationProp<StackPramsList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); 

  async function handleLogin() {
    setLoadingAuth(true);
    setErrorMessage('');

    try {
      const response = await api.post('/session', { email, password });
      if (response.data) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Dashboard' }],
        });
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage('Email ou senha incorretos. Tente novamente.');
        } else {
          setErrorMessage('Erro ao tentar fazer login. Tente novamente.');
        }
      } else {
        setErrorMessage('Erro de conexão. Verifique sua internet.');
      }
    } finally {
      setLoadingAuth(false);
    }
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../../assets/logo.png')}
      />

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Digite seu email"
          style={styles.input}
          placeholderTextColor="#F0F0F0"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="Sua senha"
          style={styles.input}
          placeholderTextColor="#F0F0F0"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          {loadingAuth ? (
            <ActivityIndicator size={25} color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Acessar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1d1d2e',
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 40,
  },
  inputContainer: {
    width: '90%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  input: {
    width: '100%',
    height: 45,
    backgroundColor: '#101026',
    marginBottom: 12,
    borderRadius: 4,
    paddingHorizontal: 10,
    color: '#FFF',
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 45,
    backgroundColor: '#3fffa3',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#101026',
  },
  errorText: {
    color: '#ff4d4d',
    marginBottom: 12,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
