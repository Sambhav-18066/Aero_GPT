
import { NextResponse } from 'next/server';
export async function POST(req) {
  try {
    const { text } = await req.json();
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ ok:false, error: 'Missing OPENAI_API_KEY' }, { status: 500 });
    }
    const prompt = `You are an expert English teacher. Rate the following text on grammar, clarity, and fluency out of 100, and give a short correction and tips. Respond in JSON with keys: grammar, fluency, clarity, corrected, tips. Text: "${text.replace(/"/g,'\"')}"`;
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role:'system', content: 'You are a helpful English teacher.' }, { role:'user', content: prompt }], max_tokens: 400, temperature: 0.2 })
    });
    const data = await r.json();
    const reply = data.choices?.[0]?.message?.content || '';
    return NextResponse.json({ ok:true, analysis: reply });
  } catch(e) {
    return NextResponse.json({ ok:false, error: e.message }, { status:500 });
  }
}
