import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { View, ActivityIndicator } from 'react-native';
import ChatListScreen from './screens/ChatListScreen';
import ChatScreen from './screens/ChatScreen';
import NewChatScreen from './screens/NewChatScreen';
import { theme } from './theme';
import { registerPushToken } from './services/api';

const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        // TODO: replace with real userId after auth integration
        await registerPushToken({ userId: 1, expoToken: token });
      }
      setReady(true);
    })();
  }, []);

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.colors.bg,
      card: theme.colors.card,
      text: theme.colors.text,
      border: theme.colors.border
    }
  };

  if (!ready) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor: theme.colors.bg }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerStyle:{ backgroundColor: theme.colors.card }, headerTintColor: theme.colors.text }}>
        <Stack.Screen name="Chats" component={ChatListScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} options={{ headerBackTitle: 'Back' }} />
        <Stack.Screen name="NewChat" component={NewChatScreen} options={{ presentation: 'modal', title: 'New Chat' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
