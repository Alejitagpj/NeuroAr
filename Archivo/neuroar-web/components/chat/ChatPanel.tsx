'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, X } from 'lucide-react';
import { useMode } from '@/lib/mode';
import { CHAT_ASK_EVENT } from '@/lib/chatBus';

interface Props {
  reportId: string;
  onClose: () => void;
}

export function ChatPanel({ reportId, onClose }: Props) {
  const { mode } = useMode();
  const { messages, input, handleInputChange, handleSubmit, append, status } = useChat({
    api: '/api/chat',
    body: { reportId, mode },
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, status]);

  useEffect(() => {
    function onAsk(e: Event) {
      const ce = e as CustomEvent<{ prompt: string }>;
      if (!ce.detail?.prompt) return;
      append({ role: 'user', content: ce.detail.prompt });
    }
    window.addEventListener(CHAT_ASK_EVENT, onAsk);
    return () => window.removeEventListener(CHAT_ASK_EVENT, onAsk);
  }, [append]);

  const loading = status === 'submitted' || status === 'streaming';

  return (
    <motion.aside
      initial={{ x: 460, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 460, opacity: 0 }}
      transition={{ type: 'spring', damping: 26, stiffness: 220 }}
      className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[440px] glass-strong rounded-none sm:rounded-l-3xl border-r-0 flex flex-col"
    >
      <header className="flex items-center justify-between px-5 py-4 border-b border-line">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-cyan/15 border border-cyan/30 grid place-items-center">
            <Sparkles className="w-4 h-4 text-cyan" />
          </div>
          <div>
            <p className="text-sm font-medium tracking-tight">Asistente NeuroAR</p>
            <p className="text-[11px] text-ink-faint font-mono">grounded · {reportId}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/[0.06] text-ink-dim">
          <X className="w-4 h-4" />
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-area px-5 py-5 space-y-4">
        {messages.length === 0 && (
          <div className="text-sm text-ink-dim leading-relaxed">
            <p>Pregunta lo que quieras sobre este informe.</p>
            <p className="mt-2 text-xs text-ink-faint">
              Solo responderé con lo que está en el informe validado. Si la pregunta sale del
              alcance, te lo voy a decir.
            </p>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={m.role === 'user' ? 'flex justify-end' : ''}>
            <div
              className={
                m.role === 'user'
                  ? 'max-w-[85%] bg-cyan/10 border border-cyan/20 text-ink rounded-2xl rounded-br-md px-4 py-2.5 text-[15px]'
                  : 'max-w-[92%] text-ink/95 rounded-2xl rounded-bl-md px-1 text-[15px] leading-relaxed whitespace-pre-wrap'
              }
            >
              {m.content}
              {m.role === 'assistant' && loading && m.id === messages[messages.length - 1].id && (
                <span className="inline-block w-2 h-4 bg-cyan ml-1 animate-blink align-middle" />
              )}
            </div>
          </div>
        ))}

        {loading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex gap-1 text-ink-faint text-xs">
            <span className="animate-pulse">●</span>
            <span className="animate-pulse" style={{ animationDelay: '0.15s' }}>●</span>
            <span className="animate-pulse" style={{ animationDelay: '0.3s' }}>●</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-line">
        <div className="flex items-center gap-2 glass rounded-2xl pl-4 pr-1.5 py-1.5 border-line-strong">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Escribe tu pregunta…"
            className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-ink-faint"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-9 h-9 rounded-xl bg-cyan text-bg grid place-items-center disabled:opacity-30 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-ink-faint mt-2 px-1 font-mono uppercase tracking-wide">
          Apoyo · no diagnóstico · validado por profesional
        </p>
      </form>
    </motion.aside>
  );
}
