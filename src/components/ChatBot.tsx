
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Key, Trash2, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { chatService, ChatMessage } from '../services/chatService';
import { generateNutritionAdvice } from '@/services/nutritionAdviceService';
import { useAuth } from '@/hooks/useAuth';
import ReactMarkdown from 'react-markdown';

const ChatBot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Charger l'historique et vérifier la clé API
    const savedMessages = chatService.loadConversation();
    setMessages(savedMessages);
    
    const savedApiKey = chatService.getApiKey();
    if (savedApiKey) {
      setApiKey(savedApiKey);
    } else {
      setShowApiKeyInput(true);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      chatService.setApiKey(apiKey.trim());
      setShowApiKeyInput(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(userMessage.content, messages);
      
      if (response.error) {
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Erreur: ${response.error}`,
          timestamp: new Date()
        };
        const finalMessages = [...newMessages, errorMessage];
        setMessages(finalMessages);
        chatService.saveConversation(finalMessages);
      } else {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.message,
          timestamp: new Date()
        };
        const finalMessages = [...newMessages, assistantMessage];
        setMessages(finalMessages);
        chatService.saveConversation(finalMessages);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    chatService.clearConversation();
  };

  const handleGenerateAdvice = async () => {
    if (isLoading) return;

    if (!user) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Veuillez vous connecter pour obtenir des conseils personnalisés.",
        timestamp: new Date()
      };
      const finalMessages = [...messages, errorMessage];
      setMessages(finalMessages);
      chatService.saveConversation(finalMessages);
      return;
    }

    setIsLoading(true);
    try {
      const advice = await generateNutritionAdvice(user.id);
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: advice,
        timestamp: new Date()
      };
      const finalMessages = [...messages, assistantMessage];
      setMessages(finalMessages);
      chatService.saveConversation(finalMessages);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Erreur: ${error instanceof Error ? error.message : 'inconnue'}`,
        timestamp: new Date()
      };
      const finalMessages = [...messages, errorMessage];
      setMessages(finalMessages);
      chatService.saveConversation(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    "Quels aliments sont riches en protéines ?",
    "Comment calculer mes besoins caloriques ?",
    "Que manger avant un entraînement ?",
    "Comment améliorer ma digestion ?"
  ];

  if (showApiKeyInput) {
    return (
      <div className="flex flex-col h-full justify-center items-center p-8">
        <div className="bg-card rounded-lg shadow-lg p-6 max-w-md w-full">
          <div className="flex items-center space-x-3 mb-4">
            <Key className="text-green-500" size={24} />
            <h2 className="text-xl font-bold">Configuration OpenRouter</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Pour utiliser l'assistant IA, veuillez entrer votre clé API OpenRouter.
          </p>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Votre clé API OpenRouter"
            className="w-full p-3 border border-input rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Button onClick={handleSaveApiKey} className="w-full">
            Sauvegarder la clé API
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Votre clé API est stockée localement et sécurisée.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            <Bot className="text-white" size={20} />
          </div>
          <div>
            <h2 className="font-semibold">Assistant Nutritionnel IA</h2>
            <p className="text-sm text-muted-foreground">Posez vos questions nutrition</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => setShowApiKeyInput(true)}>
            <Key size={16} />
          </Button>
          <Button variant="outline" size="sm" onClick={handleGenerateAdvice}>
            <Sparkles size={16} />
          </Button>
          <Button variant="outline" size="sm" onClick={handleClearChat}>
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <Bot size={48} className="mx-auto mb-4 text-green-500" />
            <h3 className="text-lg font-semibold mb-2">Bienvenue dans votre assistant IA !</h3>
            <p className="mb-6">Posez-moi vos questions sur la nutrition et l'alimentation.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-2xl mx-auto">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputValue(question)}
                  className="p-3 text-left bg-card hover:bg-accent rounded-lg transition text-sm"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="text-white" size={16} />
              </div>
            )}
            <div
              className={`max-w-[70%] p-4 rounded-lg ${
                message.role === 'user'
                  ? 'bg-green-500 text-white ml-auto'
                  : 'bg-card border border-border'
              }`}
            >
              {message.role === 'assistant' ? (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => <h1 className="text-xl font-bold mb-3 text-foreground">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-lg font-semibold mb-2 text-foreground">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-base font-semibold mb-2 text-foreground">{children}</h3>,
                      p: ({ children }) => <p className="mb-2 text-foreground">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="text-foreground">{children}</li>,
                      strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
                      em: ({ children }) => <em className="italic text-foreground">{children}</em>,
                      table: ({ children }) => (
                        <div className="overflow-x-auto mb-4">
                          <table className="min-w-full border border-border rounded-lg">{children}</table>
                        </div>
                      ),
                      thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
                      tbody: ({ children }) => <tbody>{children}</tbody>,
                      tr: ({ children }) => <tr className="border-b border-border">{children}</tr>,
                      th: ({ children }) => <th className="px-3 py-2 text-left font-semibold text-foreground">{children}</th>,
                      td: ({ children }) => <td className="px-3 py-2 text-foreground">{children}</td>,
                      code: ({ children }) => (
                        <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono text-foreground">{children}</code>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-green-500 pl-4 italic text-muted-foreground mb-2">
                          {children}
                        </blockquote>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}
              <span className="text-xs opacity-70 mt-2 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="text-white" size={16} />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <Bot className="text-white" size={16} />
            </div>
            <div className="bg-card border border-border p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Loader2 className="animate-spin" size={16} />
                <span>L'assistant réfléchit...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Tapez votre question..."
            className="flex-1 p-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={isLoading}
          />
          <Button onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()}>
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
