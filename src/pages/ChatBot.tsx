import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Send, Bot, User, Loader2, Trash2, MoreVertical, RefreshCw, Info } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Layout/Navbar';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [menuOpen, setMenuOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate or get user ID for session
  useEffect(() => {
    let storedUserId = localStorage.getItem('chatbot_user_id');
    if (!storedUserId) {
      storedUserId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('chatbot_user_id', storedUserId);
    }
    setUserId(storedUserId);
    loadChatHistory(storedUserId);
    // eslint-disable-next-line
  }, []);

  const loadChatHistory = async (uid: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from('chat_messages')
        .select('id, role, content, created_at')
        .eq('user_id', uid)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading chat history:', error);
        return;
      }

      if (data) {
        const historyMessages: Message[] = data.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          role: msg.role as 'user' | 'assistant',
          timestamp: new Date(msg.created_at),
        }));
        setMessages(historyMessages);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const clearChatHistory = async () => {
    try {
      const { error } = await (supabase as any)
        .from('chat_messages')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error('Error clearing chat history:', error);
        toast.error('ไม่สามารถลบประวัติการสนทนาได้');
        return;
      }

      setMessages([]);
      toast.success('ลบประวัติการสนทนาแล้ว');
    } catch (error) {
      console.error('Error clearing chat history:', error);
      toast.error('เกิดข้อผิดพลาดในการลบประวัติการสนทนา');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !userId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('openai-chat', {
        body: {
          message: inputMessage,
          user_id: userId
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to get response from chatbot');
      }

      if (!data?.reply) {
        throw new Error('No reply received from chatbot');
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.reply,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('เกิดข้อผิดพลาด', {
        description: 'ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-medical-blue mb-2">
            ผู้ช่วยทางการแพทย์ AI
          </h1>
          <p className="text-gray-600">
            ปรึกษาข้อมูลด้านสุขภาพ โรค ยา และการดูแลตัวเองกับ AI ผู้เชี่ยวชาญ
          </p>
        </div>

        <div className="relative">
          {/* ปุ่มเมนูมุมซ้ายบน */}
          <div className="absolute top-2 left-2 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <MoreVertical />
            </Button>
            {menuOpen && (
              <div className="absolute mt-2 w-48 bg-white border rounded shadow-lg z-20">
                <button
                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => {
                    clearChatHistory();
                    setMenuOpen(false);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2 text-red-600" />
                  ลบประวัติการสนทนา
                </button>
                <button
                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => {
                    setMessages([]);
                    setMenuOpen(false);
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2 text-medical-blue" />
                  เริ่มแชทใหม่
                </button>
                <button
                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => {
                    setMenuOpen(false);
                    toast.info('AI ผู้ช่วยทางการแพทย์: ตอบข้อมูลสุขภาพเบื้องต้น ไม่แทนที่แพทย์');
                  }}
                >
                  <Info className="h-4 w-4 mr-2 text-gray-500" />
                  เกี่ยวกับแชทบอท
                </button>
              </div>
            )}
          </div>

          <Card className="max-h-[90vh] flex flex-col">
            <CardContent className="flex-1 flex flex-col p-6 overflow-y-auto">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 mt-20">
                    <Bot className="mx-auto h-12 w-12 mb-4 text-medical-blue" />
                    <p className="text-lg">เริ่มปรึกษาผู้ช่วยทางการแพทย์ AI</p>
                    <p className="text-sm">พิมพ์คำถามเกี่ยวกับสุขภาพของคุณด้านล่าง</p>
                    <div className="mt-4 text-xs text-gray-400 max-w-md mx-auto">
                      <p>สามารถถามเรื่อง: อาการโรค, การรักษา, ยา, การดูแลสุขภาพ, โภชนาการ, การออกกำลังกาย</p>
                    </div>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === 'user'
                          ? 'bg-medical-blue text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {message.role === 'assistant' && (
                          <Bot className="h-5 w-5 mt-0.5 text-medical-blue" />
                        )}
                        {message.role === 'user' && (
                          <User className="h-5 w-5 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <p className={`text-xs mt-2 ${
                            message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString('th-TH')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg p-4 bg-gray-100 text-gray-800">
                      <div className="flex items-center gap-2">
                        <Bot className="h-5 w-5 text-medical-blue" />
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>กำลังวิเคราะห์และตอบคำถาม...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="flex gap-2">
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="พิมพ์คำถามเกี่ยวกับสุขภาพที่นี่... เช่น 'ฉันมีอาการปวดหัด มีวิธีดูแลอย่างไร?'"
                  className="flex-1 min-h-[50px] max-h-[120px] resize-none"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-medical-blue hover:bg-medical-blue/90 self-end"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;