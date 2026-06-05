// Tiny window-event bus so any component can pop the chat with a pre-filled prompt
// without needing a shared React context across server/client boundaries.

export const CHAT_ASK_EVENT = 'neuroar:askChat';
export const CHAT_REPORT_KEY = 'neuroar:activeReport';

export function askChat(prompt: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(CHAT_ASK_EVENT, { detail: { prompt } }));
}

export function setActiveReport(id: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CHAT_REPORT_KEY, id);
  window.dispatchEvent(new StorageEvent('storage', { key: CHAT_REPORT_KEY, newValue: id }));
}

export function getActiveReport(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CHAT_REPORT_KEY);
}
