import Constants from 'expo-constants';
const base = Constants?.expoConfig?.extra?.apiBaseUrl || 'https://galaxyx.lk/devps/pp/backend/backend';

async function req(path, payload){
  try{
    const res = await fetch(`${base}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload || {})
    });
    return await res.json();
  }catch(e){
    console.log('API error', e);
    return null;
  }
}

// Each function now only passes the specific file path, not the full URL.
export const getChats = ({ userId }) => req('/chats/list.php', { userId });
export const createChat = ({ title, creatorId }) => req('/chats/create.php', { title, creatorId });
export const getMessages = ({ chatId }) => req('/messages/list.php', { chatId });
export const sendMessage = ({ chatId, senderId, content }) => req('/messages/send.php', { chatId, senderId, content });
export const registerPushToken = ({ userId, expoToken }) => req('/devices/register.php', { userId, expoToken });