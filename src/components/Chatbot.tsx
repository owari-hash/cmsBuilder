import React, { useMemo, useState } from 'react';
import { ChatbotSchema } from '../schemas';
import { bgMap } from '../engine/Tokens';

type LocalMessage = {
  sender: 'bot' | 'agent' | 'user';
  text: string;
  timestamp: string;
};

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const Chatbot: React.FC<any> = (rawProps) => {
  const parseResult = ChatbotSchema.safeParse(rawProps);

  if (!parseResult.success) {
    return (
      <div className="p-4 border border-red-500 bg-red-50 text-red-700">
        <h3>Chatbot Component Configuration Error</h3>
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
    return [{ sender: 'bot', text: props.welcomeMessage, timestamp: nowLabel() }];
  });

  const positionClass = props.position === 'bottom-left' ? 'left-5' : 'right-5';
  const containerClass = useMemo(
    () => `fixed bottom-5 ${positionClass} z-[90] ${props.className || ''}`.trim(),
    [positionClass, props.className]
  );

  const pushBotReply = () => {
    const pool = props.botReplies && props.botReplies.length > 0
      ? props.botReplies
      : ['Thanks for your message!'];
    const reply = pool[Math.floor(Math.random() * pool.length)];
    setMessages((prev) => [...prev, { sender: 'bot', text: reply, timestamp: nowLabel() }]);
  };

  const submitMessage = (text: string) => {
    const value = String(text || '').trim();
    if (!value) return;
    setMessages((prev) => [...prev, { sender: 'user', text: value, timestamp: nowLabel() }]);
    setDraft('');
    setTimeout(pushBotReply, 350);
  };

  return (
    <div className={containerClass}>
      {open ? (
        <div className={`w-[340px] max-w-[90vw] rounded-2xl border shadow-2xl overflow-hidden ${bgClass} ${props.panelClassName || ''}`.trim()}>
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <div>
              <h4 className="font-semibold">{props.title}</h4>
              <p className="text-xs opacity-75">Automated assistant</p>
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

          {props.quickReplies && props.quickReplies.length > 0 ? (
            <div className="px-3 pb-2 flex flex-wrap gap-2">
              {props.quickReplies.map((reply: string) => (
                <button
                  key={reply}
                  type="button"
                  className="text-xs rounded-full border px-2.5 py-1 hover:bg-black/10 dark:hover:bg-white/10"
                  onClick={() => submitMessage(reply)}
                >
                  {reply}
                </button>
              ))}
            </div>
          ) : null}

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
          className={`mt-3 rounded-full bg-blue-600 text-white px-4 py-2 text-sm shadow-lg hover:bg-blue-700 ${props.launcherClassName || ''}`.trim()}
          onClick={() => setOpen(true)}
        >
          {props.launcherLabel}
        </button>
      ) : null}
    </div>
  );
};

export default Chatbot;
