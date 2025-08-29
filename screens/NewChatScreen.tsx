import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { createChat } from '../services/api';
import { useNavigation } from '@react-navigation/native';

export default function NewChatScreen(){
  const [title, setTitle] = useState('');
  const navigation = useNavigation<any>();

  const submit = async () => {
    if(!title.trim()) return;
    const res = await createChat({ title, creatorId: 1 });
    if(res && res.id){
      navigation.replace('Chat', { chatId: res.id, title: res.title });
    }else{
      navigation.goBack();
    }
  };

  return (
    <View style={{ flex:1, backgroundColor: theme.colors.bg, padding: 16 }}>
      <Text style={{ color: theme.colors.text, fontSize: 16, marginBottom: 12 }}>Chat title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="e.g., GalaxyX Core Devs"
        placeholderTextColor={theme.colors.subtext}
        style={{ backgroundColor: theme.colors.input, color: theme.colors.text, padding: 12, borderRadius: theme.radius }}
      />
      <TouchableOpacity onPress={submit} style={{ marginTop: 16, backgroundColor: theme.colors.accent, padding: 12, borderRadius: theme.radius }}>
        <Text style={{ color:'#fff', textAlign:'center', fontWeight:'700' }}>Create</Text>
      </TouchableOpacity>
    </View>
  );
}
