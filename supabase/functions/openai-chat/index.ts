
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to detect language from message
const detectLanguage = (message: string): 'th' | 'en' => {
  // Simple language detection based on character patterns
  const thaiPattern = /[\u0E00-\u0E7F]/;
  const englishPattern = /[a-zA-Z]/;
  
  const hasThaiChars = thaiPattern.test(message);
  const hasEnglishChars = englishPattern.test(message);
  
  // If message contains Thai characters, assume Thai
  if (hasThaiChars) return 'th';
  
  // If message contains only English characters, assume English
  if (hasEnglishChars && !hasThaiChars) return 'en';
  
  // Default to Thai
  return 'th';
};

// System prompts for different languages
const getSystemPrompt = (language: 'th' | 'en'): string => {
  if (language === 'en') {
    return `You are an AI medical assistant that specializes exclusively in health matters. You can only answer questions about the following topics:
- Symptoms and diseases
- Treatments and medications
- Health care and disease prevention
- General health advice
- Nutrition and diet
- Exercise for health
- Mental health

If users ask about anything other than health-related topics, respond with: "I'm sorry, I can only provide advice on health-related matters. Please ask questions related to health, medicine, or self-care."

Answer questions in clear, easy-to-understand English, and always remind users that this advice cannot replace medical examination by a doctor.`;
  } else {
    return `คุณเป็นผู้ช่วยทางการแพทย์ AI ที่เชี่ยวชาญด้านสุขภาพเท่านั้น คุณสามารถตอบคำถามเฉพาะเรื่องต่อไปนี้:
- อาการและโรคต่างๆ
- การรักษาและยา
- การดูแลสุขภาพและการป้องกันโรค
- คำแนะนำด้านสุขภาพทั่วไป
- อาหารและโภชนาการ
- การออกกำลังกายเพื่อสุขภาพ
- สุขภาพจิต

หากผู้ใช้ถามเรื่องอื่นที่ไม่ใช่เรื่องสุขภาพ ให้ตอบว่า "ขออภัย ฉันสามารถให้คำปรึกษาเฉพาะเรื่องสุขภาพเท่านั้น กรุณาสอบถามเรื่องที่เกี่ยวข้องกับสุขภาพ การแพทย์ หรือการดูแลตัวเอง"

ตอบคำถามด้วยภาษาไทยที่เข้าใจง่าย และเตือนเสมอว่าคำแนะนำนี้ไม่สามารถทดแทนการตรวจรักษาจากแพทย์ได้`;
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, user_id } = await req.json();
    
    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!user_id) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

      // Detect language from user message
    const detectedLanguage = detectLanguage(message);
  
    // Get OpenAI API key from Supabase secrets
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      const errorMsg = detectedLanguage === 'en' 
        ? 'OPENAI_API_KEY is not configured in Supabase secrets'
        : 'OPENAI_API_KEY ไม่ได้ตั้งค่าใน Supabase secrets';
      throw new Error(errorMsg);

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get conversation history for this user
    const { data: chatHistory, error: historyError } = await supabase
      .from('chat_messages')
      .select('role, content, created_at')
      .eq('user_id', user_id)
      .order('created_at', { ascending: true })
      .limit(20); // Limit to last 20 messages

    if (historyError) {
      console.error('Error fetching chat history:', historyError);
    }

    // Prepare conversation history
    const conversation = chatHistory ? chatHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    })) : [];

    console.log('Sending request to OpenAI with message:', message);
    console.log('Detected language:', detectedLanguage);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: getSystemPrompt(detectedLanguage)
          },
          ...conversation,
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    console.log('OpenAI API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      
      if (response.status === 429) {
        const errorMsg = detectedLanguage === 'en'
          ? 'API usage limit exceeded. Please try again later.'
          : 'API มีการใช้งานเกินขีดจำกัด กรุณาลองใหม่ในภายหลัง';
        throw new Error(errorMsg);
      } else if (response.status === 401) {
        const errorMsg = detectedLanguage === 'en'
          ? 'Invalid API key. Please check Supabase secrets.'
          : 'API key ไม่ถูกต้อง กรุณาตรวจสอบใน Supabase secrets';
        throw new Error(errorMsg);
      } else {
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    // Save user message to database
    await supabase.from('chat_messages').insert({
      user_id: user_id,
      role: 'user',
      content: message
    });

    // Save AI response to database
    await supabase.from('chat_messages').insert({
      user_id: user_id,
      role: 'assistant',
      content: reply
    });

    console.log('OpenAI response received successfully');

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in openai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'เกิดข้อผิดพลาดในการประมวลผล กรุณาลองใหม่อีกครั้ง' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});