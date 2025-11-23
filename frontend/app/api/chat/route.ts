import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const { message, seatData } = await req.json();
    
    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Gemini API key not configured. Please add GEMINI_API_KEY to .env.local' 
        },
        { status: 500 }
      );
    }

    // Prepare context about available seats
    const availableSeats = seatData?.filter((seat: any) => !seat.occupied) || [];
    const quietSeats = availableSeats.filter((seat: any) => seat.popularity < 60);
    const popularSeats = availableSeats.filter((seat: any) => seat.popularity >= 80);
    
    // Build context for Gemini
    const context = `
You are a helpful assistant for a library seat finder app. Help users find the best seat based on their needs.

IMPORTANT: 
- BLUE seats = AVAILABLE (can be recommended)
- PURPLE seats = OCCUPIED (DO NOT recommend these - they are already taken)
- Only recommend seats that are AVAILABLE (blue, not occupied)

Current seat data:
- Total available seats: ${availableSeats.length}
- Quiet seats (low popularity < 60%): ${quietSeats.length} seats
- Popular seats (high popularity >= 80%): ${popularSeats.length} seats

Available seats: ${availableSeats.slice(0, 10).map((s: any) => `${s.id} (popularity: ${s.popularity}%)`).join(', ')}

When users ask about:
- "focus", "quiet", "study" → Recommend quiet AVAILABLE seats with low popularity
- "popular", "busy", "social" → Recommend popular AVAILABLE seats
- "available", "free" → List available seats only

CRITICAL: NEVER recommend occupied (purple) seats. Only suggest seats that are available (blue).
Always prioritize AVAILABLE (not occupied) seats. Format seat IDs clearly (e.g., "t1-s1", "t2-s3").
Keep responses concise and helpful (2-3 sentences max).
`;

    // Initialize the Google Generative AI client (similar to Python: genai.Client(api_key="..."))
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Get the model - using gemini-2.5-flash-lite
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash-lite',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 200,
      },
    });

    // Generate content (similar to Python: model.generate_content(...))
    const prompt = context + `\n\nUser: ${message}\n\nAssistant:`;
    
    console.log('Sending prompt to Gemini API...');
    const result = await model.generateContent(prompt);
    
    console.log('Received response from Gemini API');
    const response = result.response;
    
    // Check for blocked content or errors
    if (!response) {
      console.error('No response from Gemini API');
      return NextResponse.json({
        success: false,
        message: 'No response received from the AI. Please try again.',
      }, { status: 500 });
    }

    // Check for prompt feedback (content filtering)
    const promptFeedback = result.response.promptFeedback;
    if (promptFeedback?.blockReason) {
      console.error('Content blocked:', promptFeedback.blockReason);
      return NextResponse.json({
        success: false,
        message: 'Your message was blocked by content filters. Please rephrase your question.',
      }, { status: 400 });
    }

    // Extract text from response
    let responseText: string;
    try {
      responseText = response.text();
      if (!responseText || responseText.trim().length === 0) {
        console.error('Empty response text from Gemini');
        return NextResponse.json({
          success: false,
          message: 'Received an empty response. Please try again.',
        }, { status: 500 });
      }
    } catch (textError) {
      console.error('Error extracting text from response:', textError);
      console.error('Response object:', JSON.stringify(response, null, 2));
      return NextResponse.json({
        success: false,
        message: 'Error processing the AI response. Please try again.',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: responseText.trim(),
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    console.error('Error details:', error.message, error.stack);
    
    // Return more specific error message
    const errorMessage = error.message?.includes('API key') 
      ? 'Invalid API key. Please check your GEMINI_API_KEY.'
      : error.message?.includes('model')
      ? 'Model not found. Please check the model name.'
      : 'Sorry, I had trouble processing that. Please try again.';
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'An error occurred while processing your request',
        message: errorMessage
      },
      { status: 500 }
    );
  }
}

