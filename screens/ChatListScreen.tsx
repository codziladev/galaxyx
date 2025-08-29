import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { theme } from '../theme';
import { getChats } from '../services/api';
import { useIsFocused } from '@react-navigation/native';

export default function ChatListScreen({ navigation }){
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  const load = async () => {
    setLoading(true);
    const data = await getChats({ userId: 1 });
    setChats(data || []);
    setLoading(false);
  };

  useEffect(() => { if (isFocused) load(); }, [isFocused]);

  return (
    <View style={{ flex:1, backgroundColor: theme.colors.bg, padding: 12 }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('NewChat')}
        style={{ backgroundColor: theme.colors.accent, padding: 12, borderRadius: theme.radius, marginBottom: 12 }}>
        <Text style={{ color:'white', fontWeight:'700', textAlign:'center' }}>Start New Chat</Text>
      </TouchableOpacity>

      <FlatList
        data={chats}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Chat', { chatId: item.id, title: item.title })}
            style={{ backgroundColor: theme.colors.card, padding: 14, borderRadius: theme.radius, marginBottom: 10 }}>
            <Text style={{ color: theme.colors.text, fontSize: 16, fontWeight: '600' }}>{item.title}</Text>
            <Text style={{ color: theme.colors.subtext, marginTop: 4 }} numberOfLines={1}>{item.last_message || 'No messages yet'}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
