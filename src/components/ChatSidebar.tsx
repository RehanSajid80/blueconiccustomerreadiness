import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X, Loader2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface MemoryIndicators {
  memories_used: number;
  memories_stored: number;
  memory_sources: string[];
  search_time_ms: number;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  memoryIndicators?: MemoryIndicators;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatSidebar = ({ isOpen, onClose }: ChatSidebarProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm the Customer Readiness Analyst with cross-agent memory. I can analyze assessment patterns, identify industry trends, recommend growth plays, and connect insights from competitive intelligence. How can I help?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [totalMemoriesUsed, setTotalMemoriesUsed] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: input,
          session_id: sessionId,
        },
      });

      if (error) throw error;

      if (data.session_id) {
        setSessionId(data.session_id);
      }

      const memIndicators = data.memory_indicators as MemoryIndicators | undefined;
      if (memIndicators?.memories_used) {
        setTotalMemoriesUsed(prev => prev + memIndicators.memories_used);
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        memoryIndicators: memIndicators,
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`
      }]);
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
    <div
      className={cn(
        "fixed right-0 top-0 h-full bg-card border-l border-border shadow-xl transition-all duration-300 z-50 flex flex-col",
        isOpen ? "w-96 translate-x-0" : "w-0 translate-x-full"
      )}
    >
      {isOpen && (
        <>
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-violet-500/10">
                <Sparkles className="h-5 w-5 text-violet-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Readiness Analyst</h3>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-xs text-emerald-600 font-medium">Memory Active</p>
                  {totalMemoriesUsed > 0 && (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 rounded-full">
                      {totalMemoriesUsed}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index}>
                  <div
                    className={cn(
                      "flex",
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-lg px-4 py-2 text-sm",
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      )}
                    >
                      {message.content || (isLoading && index === messages.length - 1 ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-xs">Searching memories...</span>
                        </div>
                      ) : '')}
                    </div>
                  </div>
                  {message.role === 'assistant' && message.memoryIndicators && message.memoryIndicators.memories_used > 0 && (
                    <div className="flex items-center gap-1 mt-1 ml-1">
                      <Zap className="h-3 w-3 text-amber-500" />
                      <span className="text-[10px] text-muted-foreground">
                        {message.memoryIndicators.memories_used} memories
                        {message.memoryIndicators.memory_sources?.length > 0 && (
                          <> from {message.memoryIndicators.memory_sources.join(', ')}</>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-2 text-sm flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analyzing assessments & memories...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about assessments, growth plays..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button onClick={sendMessage} disabled={isLoading || !input.trim()}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {['Assessment patterns', 'Top growth plays', 'Industry comparison', 'Competitive context'].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  className="text-xs px-2 py-1 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground/60 mt-2 text-center">
              Memory is learning from this conversation
            </p>
          </div>
        </>
      )}
    </div>
  );
};
