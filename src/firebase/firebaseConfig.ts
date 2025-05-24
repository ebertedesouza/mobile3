import 'dotenv/config';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import * as Notifications from 'expo-notifications';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY!,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.FIREBASE_PROJECT_ID!,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.FIREBASE_APP_ID!,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID!
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const configureFirebase = () => {
  useEffect(() => {
    const requestPermission = async () => {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status === 'granted') {
          console.log('Permissão concedida para notificações');
        } else {
          console.log('Permissão negada para notificações');
        }
      } catch (error) {
        console.error('Erro ao solicitar permissão:', error);
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
      await Notifications.scheduleNotificationAsync({
        content: {
          title: remoteMessage.notification?.title ?? 'Notificação',
          body: remoteMessage.notification?.body ?? '',
          data: remoteMessage.data ?? {},
        },
        trigger: null,
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
