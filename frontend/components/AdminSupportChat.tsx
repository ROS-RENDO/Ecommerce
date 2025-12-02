"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreHorizontal, Send, Paperclip, Phone, Mail, User, X } from 'lucide-react';
import { Socket, io } from 'socket.io-client';

interface Conversation {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastMessage: string;
  time: string;
  unread: number;
  status: 'online' | 'offline';
  orderId: string;
  roomId: string;
  customerId: string;
}

interface ChatMessage {
  roomId: string;
  senderId: string;
  receiverId: string;
  message: string;
  senderRole?: string;
  timestamp: string | Date;
}

interface AdminSupportChatProps {
  adminId?: string;
}

export default function AdminSupportChat({ adminId = 'support_main' }: AdminSupportChatProps) {
  const [selectedChat, setSelectedChat] = useState(0);
  const [chatMessage, setChatMessage] = useState('');
  const [showCustomerInfo, setShowCustomerInfo] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Initialize Socket.IO and load conversations
  useEffect(() => {
    loadConversations();

    const newSocket: Socket = io(API_URL, {
      withCredentials: true,
    });

    newSocket.on('connect', () => {
      console.log('Admin connected to support chat:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('chatMessage', (msg: ChatMessage) => {
      console.log('Received message:', msg);
      
      // Update messages if it's for the current chat
      if (conversations.length > 0) {
        const currentConv = conversations[selectedChat];
        if (currentConv && msg.roomId === currentConv.roomId) {
          setMessages(prev => {
            const exists = prev.some(m => 
              m.message === msg.message && 
              m.senderId === msg.senderId && 
              Math.abs(new Date(m.timestamp).getTime() - new Date(msg.timestamp).getTime()) < 1000
            );
            if (exists) return prev;
            return [...prev, msg];
          });
        }
      }

      // Update conversation list with new message
      setConversations(prev => prev.map(conv => 
        conv.roomId === msg.roomId 
          ? { 
              ...conv, 
              lastMessage: msg.message.substring(0, 50) + (msg.message.length > 50 ? '...' : ''),
              time: 'Just now',
              unread: conv.roomId === conversations[selectedChat]?.roomId ? 0 : conv.unread + 1
            }
          : conv
      ));
    });

    newSocket.on('userJoined', (data: any) => {
      console.log('User joined support:', data);
      setConversations(prev => prev.map(conv =>
        conv.customerId === data.userId
          ? { ...conv, status: 'online' as const }
          : conv
      ));
    });

    newSocket.on('userLeft', (data: any) => {
      console.log('User left support:', data);
      setConversations(prev => prev.map(conv =>
        conv.customerId === data.userId
          ? { ...conv, status: 'offline' as const }
          : conv
      ));
    });

    newSocket.on('disconnect', () => {
      console.log('Admin disconnected from support chat');
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load chat history when selecting a conversation
  useEffect(() => {
    if (conversations.length > 0 && socket) {
      const currentConv = conversations[selectedChat];
      loadChatHistory(currentConv.roomId);
      
      // Join the room
      socket.emit('joinRoom', {
        roomId: currentConv.roomId,
        userId: adminId,
        userRole: 'support'
      });

      // Mark as read
      setConversations(prev => prev.map((conv, idx) =>
        idx === selectedChat ? { ...conv, unread: 0 } : conv
      ));
    }
  }, [selectedChat, socket, conversations.length]);

  const loadConversations = async () => {
    try {
      // TODO: Replace with actual API call to get all support conversations
      // const response = await fetch(`${API_URL}/api/chat/conversations`, { credentials: 'include' });
      // const data = await response.json();
      
      // For now, using sample data that matches your original design
      const sampleConversations: Conversation[] = [
        {
          id: '1',
          customerId: 'customer_001',
          name: 'Sarah Johnson',
          email: 'sarah.j@email.com',
          phone: '+1 234-567-8900',
          lastMessage: 'When will my order arrive?',
          time: '2 min ago',
          unread: 2,
          status: 'online',
          orderId: '#12345',
          roomId: 'support_customer_001'
        },
        {
          id: '2',
          customerId: 'customer_002',
          name: 'Mike Chen',
          email: 'mike.chen@email.com',
          phone: '+1 234-567-8901',
          lastMessage: 'Thank you for your help!',
          time: '15 min ago',
          unread: 0,
          status: 'offline',
          orderId: '#12340',
          roomId: 'support_customer_002'
        },
        {
          id: '3',
          customerId: 'customer_003',
          name: 'Emma Wilson',
          email: 'emma.w@email.com',
          phone: '+1 234-567-8902',
          lastMessage: 'I need to return my item',
          time: '1 hour ago',
          unread: 1,
          status: 'online',
          orderId: '#12338',
          roomId: 'support_customer_003'
        }
      ];
      setConversations(sampleConversations);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const loadChatHistory = async (roomId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/chat/${roomId}`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data: ChatMessage[] = await response.json();
        setMessages(data);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
      setMessages([]);
    }
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || !socket || conversations.length === 0) return;

    const currentConv = conversations[selectedChat];
    const messageData: ChatMessage = {
      roomId: currentConv.roomId,
      senderId: adminId,
      receiverId: currentConv.customerId,
      message: chatMessage.trim(),
      senderRole: 'support',
      timestamp: new Date().toISOString()
    };

    // Emit via Socket.IO
    socket.emit('chatMessage', messageData);

    // Save to database
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

    setChatMessage('');
  };

  const formatTime = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-180px)] bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="text-center">
          <p className="text-gray-500 mb-2">No support conversations yet</p>
          <p className="text-sm text-gray-400">New customer chats will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-0 bg-white rounded-xl shadow-sm border border-gray-100 h-[calc(100vh-180px)]">
      {/* Chat List */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-gray-500">
              {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </span>
            <span className="text-gray-500">
              {filteredConversations.filter(c => c.unread > 0).length} unread
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv, index) => (
            <button
              key={conv.id}
              onClick={() => setSelectedChat(conversations.indexOf(conv))}
              className={`w-full p-4 border-b border-gray-200 hover:bg-gray-50 text-left transition-colors ${
                selectedChat === conversations.indexOf(conv) ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {conv.name.charAt(0)}
                  </div>
                  {conv.status === 'online' && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{conv.name}</h3>
                    <span className="text-xs text-gray-500">{conv.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                    {conv.unread}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
              {conversations[selectedChat].name.charAt(0)}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{conversations[selectedChat].name}</h2>
              <p className={`text-sm ${conversations[selectedChat].status === 'online' ? 'text-green-600' : 'text-gray-500'}`}>
                {conversations[selectedChat].status}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowCustomerInfo(!showCustomerInfo)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <User size={20} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreHorizontal size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p className="text-sm">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isAdmin = msg.senderId === adminId || msg.senderRole === 'support';
              return (
                <div key={index} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-md">
                    <div className={`px-4 py-2 rounded-lg ${
                      isAdmin 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}>
                      {msg.message}
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block">{formatTime(msg.timestamp)}</span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-end gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
              <Paperclip size={20} />
            </button>
            <div className="flex-1">
              <textarea
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={isConnected ? "Type your message..." : "Connecting..."}
                disabled={!isConnected}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-100"
                rows={1}
              />
            </div>
            <button 
              onClick={handleSendMessage}
              disabled={!chatMessage.trim() || !isConnected}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              <Send size={18} />
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Customer Info Sidebar */}
      {showCustomerInfo && (
        <div className="w-80 border-l border-gray-200 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Customer Info</h3>
              <button onClick={() => setShowCustomerInfo(false)} className="p-1 hover:bg-gray-100 rounded transition-colors">
                <X size={18} className="text-gray-600" />
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-semibold mx-auto mb-3">
                {conversations[selectedChat].name.charAt(0)}
              </div>
              <h4 className="font-semibold text-gray-900">{conversations[selectedChat].name}</h4>
              <p className="text-sm text-gray-500">Customer since Jan 2024</p>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-xs font-medium text-gray-500 uppercase block mb-1">Email</label>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-900">{conversations[selectedChat].email}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-xs font-medium text-gray-500 uppercase block mb-1">Phone</label>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-900">{conversations[selectedChat].phone}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-xs font-medium text-gray-500 uppercase block mb-1">Current Order</label>
                <span className="text-sm text-gray-900 font-medium">{conversations[selectedChat].orderId}</span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-xs font-medium text-gray-500 uppercase block mb-2">Recent Orders</label>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-900">#12345</span>
                    <span className="text-green-600">Delivered</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-900">#12340</span>
                    <span className="text-blue-600">In Transit</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-xs font-medium text-gray-500 uppercase block mb-1">Total Orders</label>
                <span className="text-2xl font-bold text-gray-900">8</span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-xs font-medium text-gray-500 uppercase block mb-1">Total Spent</label>
                <span className="text-2xl font-bold text-gray-900">$1,240</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}