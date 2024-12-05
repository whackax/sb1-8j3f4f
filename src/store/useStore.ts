import create from 'zustand';
import { Message, Conversation, User } from '../types';

interface State {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  addMessage: (message: Message) => void;
  createNewConversation: () => void;
  setActiveConversation: (conversation: Conversation) => void;
}

export const useStore = create<State>((set) => ({
  conversations: [],
  activeConversation: null,
  user: null,
  isAuthenticated: false,

  setUser: (user) => set({ user }),
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),

  addMessage: (message) =>
    set((state) => {
      if (!state.activeConversation) return state;

      const updatedConversation = {
        ...state.activeConversation,
        messages: [...state.activeConversation.messages, message],
      };

      const updatedConversations = state.conversations.map((conv) =>
        conv.id === updatedConversation.id ? updatedConversation : conv
      );

      return {
        conversations: updatedConversations,
        activeConversation: updatedConversation,
      };
    }),

  createNewConversation: () =>
    set((state) => {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: `Conversation ${state.conversations.length + 1}`,
        messages: [],
      };

      return {
        conversations: [...state.conversations, newConversation],
        activeConversation: newConversation,
      };
    }),

  setActiveConversation: (conversation) =>
    set({ activeConversation: conversation }),
}));