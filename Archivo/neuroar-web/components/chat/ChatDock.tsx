'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { ChatPanel } from './ChatPanel';
import { CHAT_ASK_EVENT, CHAT_REPORT_KEY } from '@/lib/chatBus';

export function ChatDock() {
  const [open, setOpen] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);

  useEffect(() => {
    const read = () => setReportId(localStorage.getItem(CHAT_REPORT_KEY));
    read();
    const onStorage = (e: StorageEvent) => {
      if (e.key === CHAT_REPORT_KEY) read();
    };
    const onAsk = () => {
      setOpen(true);
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener(CHAT_ASK_EVENT, onAsk);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(CHAT_ASK_EVENT, onAsk);
    };
  }, []);

  if (!reportId) return null;

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-40 h-14 pl-5 pr-6 rounded-full bg-cyan text-bg ring-glow flex items-center gap-2.5 font-medium hover:scale-[1.03] transition-transform"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-sm">Pregunta al asistente</span>
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>{open && <ChatPanel reportId={reportId} onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}
