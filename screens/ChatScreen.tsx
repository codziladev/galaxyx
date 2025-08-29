import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { theme } from '../theme';
import { getMessages, sendMessage } from '../services/api';
import { useRoute } from '@react-navigation/native';

export default function ChatScreen(){
  const route = useRoute<any>();
  const { chatId } = route.params as any;
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');

  const load = async () => {
    const data = await getMessages({ chatId });
    setMessages(data || []);
  };

  useEffect(() => { load(); }, [chatId]);

  const onSend = async () => {
    if(!text.trim()) return;
    await sendMessage({ chatId, senderId: 1, content: text });
    setText('');
    await load();
  };

  const renderItem = ({ item }) => {
    const mine = item.sender_id === 1;
    return (
      <View style={{ paddingVertical: 4, alignItems: mine ? 'flex-end' : 'flex-start' }}>
        <View style={{
          backgroundColor: mine ? theme.colors.accent : theme.colors.card,
          padding: 10,
          borderRadius: theme.radius,
          maxWidth: '80%'
        }}>
          <Text style={{ color: mine ? '#fff' : theme.colors.text }}>{item.content}</Text>
          <Text style={{ color: mine ? '#EDE9FE' : theme.colors.subtext, fontSize: 10, marginTop: 4 }}>{new Date(item.created_at).toLocaleTimeString()}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex:1, backgroundColor: theme.colors.bg }}>
      <FlatList
        contentContainerStyle={{ padding: 12 }}
        data={messages}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        inverted
      />
      <View style={{ flexDirection:'row', padding: 10, backgroundColor: theme.colors.card, gap: 8 }}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Message..."
          placeholderTextColor={theme.colors.subtext}
          style={{ flex:1, backgroundColor: theme.colors.input, color: theme.colors.text, padding: 12, borderRadius: theme.radius }}
        />
        <TouchableOpacity onPress={onSend} style={{ backgroundColor: theme.colors.accent, paddingHorizontal: 16, justifyContent:'center', borderRadius: theme.radius }}>
          <Text style={{ color:'#fff', fontWeight:'700' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
