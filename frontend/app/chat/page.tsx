"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, MoreVertical, ShoppingBag, Package, User } from 'lucide-react';
import { Socket, io } from 'socket.io-client';
import AuthWrapper from '@/context/AuthContext';

interface Chat {
  id: number;
  seller: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  product: string;
  online: boolean;
  roomId: string;
  supportId: string;
}

interface Message {
  roomId: string;
  senderId: string;
  receiverId: string;
  message: string;
  senderRole?: string;
  timestamp: string | Date;
}

interface MessageData {
  roomId: string;
  senderId: string;
  receiverId: string;
  message: string;
  senderRole: string;
  timestamp: string;
}

export default function EcommerceChat() {
  const [selectedChat, setSelectedChat] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userId, setUserId] = useState<string>('customer_001'); // Replace with actual user ID from auth
  const [userRole, setUserRole] = useState<'customer' | 'support'>('customer');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chats: Chat[] = [
    {
      id: 1,
      seller: 'TechGear Store',
      avatar: 'TG',
      lastMessage: 'Your order has been shipped!',
      time: '2m ago',
      unread: 2,
      product: 'Wireless Headphones',
      online: true,
      roomId: 'room_techgear_001',
      supportId: 'support_techgear'
    },
    {
      id: 2,
      seller: 'Fashion Hub',
      avatar: 'FH',
      lastMessage: 'Is this available in blue?',
      time: '1h ago',
      unread: 0,
      product: 'Summer Dress',
      online: true,
      roomId: 'room_fashion_001',
      supportId: 'support_fashion'
    },
    {
      id: 3,
      seller: 'Home Essentials',
      avatar: 'HE',
      lastMessage: 'Thank you for your order!',
      time: '3h ago',
      unread: 0,
      product: 'Kitchen Set',
      online: false,
      roomId: 'room_home_001',
      supportId: 'support_home'
    },
    {
      id: 4,
      seller: 'Sports Zone',
      avatar: 'SZ',
      lastMessage: 'We have a sale this weekend',
      time: '1d ago',
      unread: 1,
      product: 'Running Shoes',
      online: false,
      roomId: 'room_sports_001',
      supportId: 'support_sports'
    }
  ];

  const currentChat = chats[selectedChat];
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Initialize Socket.IO connection
  useEffect(() => {
    const newSocket: Socket = io(API_URL, {
      withCredentials: true,
    });

    newSocket.on('connect', () => {
      console.log('Connected to server:', newSocket.id);
      // Join the current room
      if (currentChat?.roomId) {
        newSocket.emit('joinRoom', { 
          roomId: currentChat.roomId, 
          userId: userId,
          userRole: userRole 
        });
      }
    });

    newSocket.on('chatMessage', (msg: Message) => {
      console.log('Received message:', msg);
      if (msg.roomId === currentChat?.roomId) {
        setMessages(prev => [...prev, msg]);
      }
    });

    newSocket.on('userJoined', (data: any) => {
      console.log('User joined:', data);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Load chat history when selecting a chat
  useEffect(() => {
    if (currentChat?.roomId) {
      loadChatHistory(currentChat.roomId);
      
      // Join the new room
      if (socket) {
        socket.emit('joinRoom', { 
          roomId: currentChat.roomId, 
          userId: userId,
          userRole: userRole 
        });
      }
    }
  }, [selectedChat, socket]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadChatHistory = async (roomId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/api/chat/${roomId}`, {
        credentials: 'include',
      });
      const data: Message[] = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Failed to load chat history:', error);
      setMessages([]);
    }
  };

  const handleSend = async (): Promise<void> => {
    if (!message.trim() || !currentChat) return;

    const messageData: MessageData = {
      roomId: currentChat.roomId,
      senderId: userId,
      receiverId: currentChat.supportId,
      message: message.trim(),
      senderRole: userRole,
      timestamp: new Date().toISOString()
    };

    // Emit via Socket.IO for real-time delivery
    if (socket) {
      socket.emit('chatMessage', messageData);
    }

    // Also save to database via HTTP
    try {
      await fetch(`${API_URL}/api/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(messageData),
      });
    } catch (error) {
      console.error('Failed to save message:', error);
    }

    setMessage('');
  };

  const filteredChats = chats.filter(chat =>
    chat.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.product.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timestamp: string | Date): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <AuthWrapper>

    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Chat List */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-gray-800">Messages</h1>
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
              <User size={14} className="text-blue-600" />
              <span className="text-xs font-medium text-blue-600">
                {userRole === 'customer' ? 'Customer' : 'Support'}
              </span>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search sellers or products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat, index) => (
            <div
            key={chat.id}
            onClick={() => setSelectedChat(index)}
            className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
              selectedChat === index ? 'bg-blue-50' : 'hover:bg-gray-50'
            }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {chat.avatar}
                  </div>
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-800 truncate">{chat.seller}</h3>
                    <span className="text-xs text-gray-500">{chat.time}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    <Package size={12} className="text-gray-400" />
                    <p className="text-xs text-gray-500 truncate">{chat.product}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                    {chat.unread > 0 && (
                      <span className="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Messages */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {currentChat?.avatar}
              </div>
              <div>
                <h2 className="font-semibold text-gray-800">{currentChat?.seller}</h2>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${currentChat?.online ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="text-xs text-gray-500">
                    {currentChat?.online ? 'Active now' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MoreVertical size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Product Info Banner */}
        <div className="bg-blue-50 border-b border-blue-100 p-3">
          <div className="flex items-center gap-2 text-sm">
            <ShoppingBag size={16} className="text-blue-600" />
            <span className="text-gray-700">Discussing: <span className="font-semibold">{currentChat?.product}</span></span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isSender = msg.senderId === userId;
              return (
                <div
                key={idx}
                className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-md ${isSender ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        isSender
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                    </div>
                    <span className={`text-xs text-gray-500 mt-1 block ${isSender ? 'text-right' : 'text-left'}`}>
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white p-3 rounded-full transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
    </AuthWrapper>
  );
}