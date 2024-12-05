export interface Message {
  content: string;
  sender: 'user' | 'bot';
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

export interface User {
  username: string;
  iconUrl: string;
}