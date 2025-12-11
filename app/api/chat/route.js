
import { NextResponse } from 'next/server';
export async function POST(req) {
  try {
    const body = await req.json();
    const message = body.message || '';
    const persona = body.persona || 'empath';
    const personaPrompts = {
      empath: 'You are an empathetic English tutor. Be gentle and encouraging. Provide corrections and examples.',
      guide: 'You are a practical guide. Give clear, step-by-step corrections and exercises.',
      sage: 'You are a wise mentor. Provide reflective insights, examples, and gentle challenges.',
      friend: 'You are a casual friendly tutor. Be conversational, light, and helpful.'
    };
    const systemPrompt = personaPrompts[persona] || personaPrompts['empath'];
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ reply: 'Missing OPENAI_API_KEY on server. Add it to environment variables.' }, { status: 500 });
    }
    const payload = { model: 'gpt-4o-mini', messages: [ { role: 'system', content: systemPrompt }, { role: 'user', content: message } ], max_tokens: 400, temperature: 0.7 };
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify(payload)
    });
    if (!r.ok) {
      const text = await r.text();
      return NextResponse.json({ reply: 'OpenAI API error: ' + text }, { status: 500 });
    }
    const data = await r.json();
    const reply = data.choices?.[0]?.message?.content || 'No reply from model.';
    return NextResponse.json({ reply });
  } catch (err) {
    console.error('Chat API error', err);
    return NextResponse.json({ reply: 'Server error.' }, { status: 500 });
  }
}
