
"use client";
import { useState, useRef, useEffect } from 'react';
const PERSONAS = [
  { id: 'empath', label: 'Empath', system: 'You are an empathetic English tutor. Be gentle and encouraging.' },
  { id: 'guide', label: 'Guide', system: 'You are a practical guide. Give clear step-by-step corrections.' },
  { id: 'sage', label: 'Sage', system: 'You are a wise mentor. Provide reflective insights and examples.' },
  { id: 'friend', label: 'Friend', system: 'You are a casual friendly tutor. Be conversational and fun.' }
];
export default function Home() {
  const [persona, setPersona] = useState(PERSONAS[0]);
  const [messages, setMessages] = useState([ { role: 'ai', content: 'Hello! I am AeroGPT — choose a persona and say something.' } ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef();
  useEffect(()=>{ chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior:'smooth' }) },[messages]);
  async function sendMessage() {
    if(!input.trim()) return;
    const userMsg = { role:'user', content: input };
    setMessages(prev=>[...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, persona: persona.id })
      });
      const data = await res.json();
      const reply = data?.reply || 'Sorry, no reply.';
      setMessages(prev=>[...prev, { role:'ai', content: reply }]);
    } catch(e) {
      setMessages(prev=>[...prev, { role:'ai', content: 'Error connecting to AI.' }]);
    } finally { setLoading(false); }
  }
  return (
    <div className="container">
      <div className="card">
        <h2>AeroGPT — Beta (Minimal)</h2>
        <div style={{marginTop:8}} className="personas">
          {PERSONAS.map(p=>(
            <div key={p.id} className={ 'persona ' + (p.id===persona.id ? 'active':'' ) } onClick={()=>setPersona(p)}>
              {p.label}
            </div>
          ))}
        </div>
        <div className="chat card" ref={chatRef}>
          {messages.map((m,i)=>(
            <div key={i} className={ 'bubble ' + (m.role==='user' ? 'user':'ai') }>
              {m.content}
            </div>
          ))}
        </div>
        <div className="controls">
          <input type="text" value={input} onChange={e=>setInput(e.target.value)} placeholder="Say something..." onKeyDown={(e)=>{ if(e.key==='Enter') sendMessage() }} />
          <button onClick={sendMessage} disabled={loading}>{loading? 'Thinking...':'Send'}</button>
        </div>
      </div>
    </div>
  );
}
