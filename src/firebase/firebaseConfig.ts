import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import * as Notifications from 'expo-notifications';

const firebaseConfig = {
  apiKey: 'SUA_API_KEY',
  authDomain: 'SEU_AUTH_DOMAIN',
  projectId: 'SEU_PROJECT_ID',
  storageBucket: 'SEU_STORAGE_BUCKET',
  messagingSenderId: 'SEU_MESSAGING_SENDER_ID',
  appId: 'SEU_APP_ID',
  measurementId: 'SEU_MEASUREMENT_ID'
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const configureFirebase = () => {
  useEffect(() => {
    const requestPermission = async () => {
      try {
        await Notifications.requestPermissionsAsync();
        console.log('Permissão concedida para notificações');
      } catch (error) {
        console.error('Permissão para notificações negada:', error);
      }
    };

    const getTokenAsync = async () => {
      try {
        const token = await getToken(messaging);
        console.log('Token do dispositivo:', token);
      } catch (error) {
        console.error('Erro ao obter o token:', error);
      }
    };

    onMessage(messaging, async (remoteMessage: any) => {
      console.log('Mensagem recebida em primeiro plano:', remoteMessage);
      await Notifications.presentNotificationAsync({
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        data: remoteMessage.data,
      });
    });

    Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificação recebida em segundo plano:', notification);
    });

    Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Resposta da notificação:', response);
    });

    requestPermission();
    getTokenAsync();
  }, []);
};
