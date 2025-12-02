"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Socket, io } from "socket.io-client";

interface Message {
  id?: number;
  roomId: string;
  senderId: string;
  receiverId: string;
  message: string;
  senderRole?: string;
  timestamp: string | Date;
}

interface ChatSupportButtonProps {
  userId?: string;
  userRole?: 'customer' | 'support';
}

export default function ChatSupportButton({ 
  userId = 'customer_' + Math.random().toString(36).substr(2, 9),
  userRole = 'customer'
}: ChatSupportButtonProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const SUPPORT_ID = 'support_main'; // Main support team ID
  const ROOM_ID = `support_${userId}`; // Unique room for each customer

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Initialize Socket.IO connection when chat opens
  useEffect(() => {
    if (open && !socket) {
      const newSocket: Socket = io(API_URL, {
        withCredentials: true,
      });

      newSocket.on('connect', () => {
        console.log('Connected to support chat:', newSocket.id);
        setIsConnected(true);
        
        // Join the support room
        newSocket.emit('joinRoom', { 
          roomId: ROOM_ID, 
          userId: userId,
          userRole: userRole 
        });

        // Load chat history
        loadChatHistory();
      });

      newSocket.on('chatMessage', (msg: Message) => {
        console.log('Received message:', msg);
        if (msg.roomId === ROOM_ID) {
          setMessages(prev => {
            // Avoid duplicates
            const exists = prev.some(m => 
              m.message === msg.message && 
              m.senderId === msg.senderId && 
              Math.abs(new Date(m.timestamp).getTime() - new Date(msg.timestamp).getTime()) < 1000
            );
            if (exists) return prev;
            return [...prev, msg];
          });
        }
      });

      newSocket.on('userJoined', (data: any) => {
        console.log('User joined:', data);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from support chat');
        setIsConnected(false);
      });

      newSocket.on('messageError', (error: any) => {
        console.error('Message error:', error);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [open]);

  const loadChatHistory = async (): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/api/chat/${ROOM_ID}`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data: Message[] = await response.json();
        setMessages(data);
      } else {
        // No chat history, start with welcome message
        setMessages([{
          roomId: ROOM_ID,
          senderId: SUPPORT_ID,
          receiverId: userId,
          message: "👋 Hi there! How can we help you today?",
          senderRole: "support",
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
      // Show welcome message on error
      setMessages([{
        roomId: ROOM_ID,
        senderId: SUPPORT_ID,
        receiverId: userId,
        message: "👋 Hi there! How can we help you today?",
        senderRole: "support",
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const handleSend = async (): Promise<void> => {
    if (!message.trim() || !socket) return;

    const messageData: Message = {
      roomId: ROOM_ID,
      senderId: userId,
      receiverId: SUPPORT_ID,
      message: message.trim(),
      senderRole: userRole,
      timestamp: new Date().toISOString()
    };

    // Emit via Socket.IO for real-time delivery
    socket.emit('chatMessage', messageData);

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

    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating chat button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="
            fixed bottom-6 right-6 
            bg-[#3C215F] text-white 
            px-5 py-3 rounded-full shadow-lg 
            hover:bg-[#2b1647] hover:scale-105 transition-all duration-300
            flex items-center gap-2
            z-50 animate-bounce
          "
          aria-label="Open chat support"
        >
          <MessageCircle size={22} className="text-white" />
          <span className="text-sm font-medium">Support</span>
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div
          className="
            fixed bottom-6 right-6 
            w-96 h-[32rem] bg-white 
            rounded-2xl shadow-2xl border border-gray-200
            flex flex-col
            z-50
            animate-in slide-in-from-bottom-4 duration-300
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-[#3C215F] text-white px-5 py-4 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
              <div>
                <h3 className="font-semibold text-base">Chat Support</h3>
                <p className="text-xs text-purple-200">
                  {isConnected ? "We're online" : "Connecting..."}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setOpen(false)}
              className="hover:bg-white/20 rounded-full p-1 transition-colors"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p className="text-sm">Loading messages...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg, idx) => {
                  const isUser = msg.senderId === userId;
                  return (
                    <div
                      key={idx}
                      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`
                          max-w-[75%] rounded-2xl px-4 py-2.5
                          ${isUser
                            ? "bg-[#3C215F] text-white rounded-br-sm" 
                            : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm"
                          }
                        `}
                      >
                        <p className="text-sm leading-relaxed">{msg.message}</p>
                        <p className={`text-xs mt-1 ${isUser ? "text-purple-200" : "text-gray-400"}`}>
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="border-t border-gray-200 p-4 bg-white rounded-b-2xl">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isConnected ? "Type your message..." : "Connecting..."}
                disabled={!isConnected}
                className="
                  flex-1 border border-gray-300 rounded-full 
                  px-4 py-2.5 text-sm 
                  outline-none focus:ring-2 focus:ring-[#3C215F]/30 focus:border-[#3C215F]
                  transition-all
                  disabled:bg-gray-100 disabled:cursor-not-allowed
                "
              />
              <button
                onClick={handleSend}
                disabled={!message.trim() || !isConnected}
                className="
                  bg-[#3C215F] text-white 
                  p-2.5 rounded-full goo
                  hover:bg-[#2b1647] 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all hover:scale-105
                "
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}