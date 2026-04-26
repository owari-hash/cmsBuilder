'use client';

import React, { useMemo, useState } from 'react';
import { LivechatSchema } from '../schemas';
import { bgMap } from '../engine/Tokens';
import { resolveDisplayImageUrl } from '../engine/resolveDisplayImageUrl';

type LocalMessage = {
  sender: 'bot' | 'agent' | 'user';
  text: string;
  timestamp: string;
};

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const Livechat: React.FC<any> = (rawProps) => {
  const parseResult = LivechatSchema.safeParse(rawProps);

  if (!parseResult.success) {
    return (
      <div className="p-4 border border-red-500 bg-red-50 text-red-700">
        <h3>Livechat Component Configuration Error</h3>
        <pre className="text-xs">{JSON.stringify(parseResult.error.format(), null, 2)}</pre>
      </div>
    );
  }

  const props = parseResult.data;
  const bgClass = bgMap[props.theme];
  const [open, setOpen] = useState(Boolean(props.defaultOpen));
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<LocalMessage[]>(() => {
    const seed = (props.initialMessages || []).map((message: any) => ({
      sender: message.sender,
      text: message.text,
      timestamp: nowLabel()
    }));
    if (seed.length > 0) return seed;
    return [{ sender: 'agent', text: props.welcomeMessage, timestamp: nowLabel() }];
  });

  const positionClass = props.position === 'bottom-left' ? 'left-5' : 'right-5';
  const containerClass = useMemo(
    () => `fixed bottom-5 ${positionClass} z-[90] ${props.className || ''}`.trim(),
    [positionClass, props.className]
  );

  const statusColor = props.agentStatus === 'online'
    ? 'bg-emerald-500'
    : props.agentStatus === 'away'
      ? 'bg-amber-500'
      : 'bg-gray-400';

  const submitMessage = (text: string) => {
    const value = String(text || '').trim();
    if (!value) return;
    setMessages((prev) => [...prev, { sender: 'user', text: value, timestamp: nowLabel() }]);
    setDraft('');
    const replyText = props.agentStatus === 'offline'
      ? props.offlineMessage
      : `Thanks! ${props.agentName} received your message.`;
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'agent', text: replyText, timestamp: nowLabel() }]);
    }, 450);
  };

  return (
    <div className={containerClass}>
      {open ? (
        <div className={`w-[360px] max-w-[92vw] rounded-2xl border shadow-2xl overflow-hidden ${bgClass} ${props.panelClassName || ''}`.trim()}>
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              {props.agentAvatarUrl ? (
                <img src={resolveDisplayImageUrl(props.agentAvatarUrl)} alt={props.agentName} className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <div className="h-9 w-9 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center text-xs font-semibold">
                  {props.agentName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <h4 className="font-semibold">{props.title}</h4>
                <p className="text-xs opacity-80">
                  <span className={`inline-block h-2 w-2 rounded-full mr-1.5 ${statusColor}`} />
                  {props.subtitle}
                </p>
              </div>
            </div>
            <button className="text-sm opacity-80 hover:opacity-100" onClick={() => setOpen(false)} type="button">
              Close
            </button>
          </div>

          <div className="p-3 h-72 overflow-auto space-y-2">
            {messages.map((message, index) => (
              <div key={`${message.timestamp}-${index}`} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-black/10 dark:bg-white/10'}`}>
                  <p>{message.text}</p>
                  {props.showTimestamp ? (
                    <p className="mt-1 text-[10px] opacity-75">{message.timestamp}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <form
            className="border-t p-3 flex items-center gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              submitMessage(draft);
            }}
          >
            <input
              className="flex-1 rounded-lg border px-3 py-2 text-sm bg-transparent"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={props.placeholder}
            />
            <button type="submit" className="rounded-lg bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700">
              {props.sendButtonText}
            </button>
          </form>
        </div>
      ) : null}

      {!open ? (
        <button
          type="button"
          className={`mt-3 rounded-full bg-slate-900 text-white px-4 py-2 text-sm shadow-lg hover:bg-slate-800 ${props.launcherClassName || ''}`.trim()}
          onClick={() => setOpen(true)}
        >
          {props.launcherLabel}
        </button>
      ) : null}
    </div>
  );
};

export default Livechat;
