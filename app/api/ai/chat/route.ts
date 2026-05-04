import { NextRequest, NextResponse } from 'next/server';

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_API_URL = process.env.HF_API_URL || 'https://router.huggingface.co/v1/chat/completions';
const HF_MODEL_ID = process.env.HF_MODEL_ID || 'Qwen/Qwen2.5-7B-Instruct';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    if (!HF_API_KEY) {
      // Return a mock response if no API key is set
      return NextResponse.json({
        response: "AI Response (Demo Mode): I'm ready to help you generate scripts! In demo mode without an API key, I can't provide real AI responses. Please add your HUGGINGFACE_API_KEY to the environment variables for full functionality.\n\nFor script generation, tell me what kind of script you need (e.g., auto-farm, ESP, clicker) and I'll help you create it!",
        model: 'demo-mode',
      });
    }

    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HF_API_KEY}`,
      },
      body: JSON.stringify({
        model: HF_MODEL_ID,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful coding assistant specialized in generating scripts for games, automation tools, and utilities. You provide clean, well-commented code. Focus on Lua/Roblox scripting, JavaScript, Python, and other common languages. Always explain your code clearly.',
          },
          ...messages,
        ],
        max_tokens: 2048,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('HF API Error:', errorData);
      
      // Fallback to demo mode
      return NextResponse.json({
        response: "AI Response (Fallback): I encountered an issue connecting to the AI service. Here's a general tip for script generation:\n\nWhen creating game scripts, always:\n1. Start with clear variable declarations\n2. Add error handling\n3. Comment your code thoroughly\n4. Test in safe environments first\n\nPlease try again later or check your API configuration.",
        model: 'fallback',
      });
    }

    const data = await response.json();
    
    const aiResponse = data.choices?.[0]?.message?.content || 'No response generated';

    return NextResponse.json({
      response: aiResponse,
      model: HF_MODEL_ID,
    });
  } catch (error) {
    console.error('AI Chat error:', error);
    
    // Return fallback response
    return NextResponse.json({
      response: "AI Service Unavailable: I'm currently unable to connect to the AI service. This could be due to network issues or API configuration problems.\n\nPlease try again later. In the meantime, here are some script ideas you might want to explore:\n- Auto-farming scripts\n- ESP/Wallhack utilities\n- Auto-clicker tools\n- Discord bot templates",
      model: 'error-fallback',
    });
  }
}
