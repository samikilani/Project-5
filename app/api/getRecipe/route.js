import { NextResponse } from 'next/server';

export async function POST(request) {
  const { pantryItems } = await request.json();
  const prompt = `Given the following pantry items: ${pantryItems.join(', ')}, suggest a recipe.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 150
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const recipe = data.choices[0].message.content.trim();

    return NextResponse.json({ recipe });
  } catch (error) {
    console.error('Error creating completion:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
