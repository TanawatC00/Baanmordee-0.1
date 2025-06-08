
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Get OpenAI API key from Supabase secrets
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY ไม่ได้ตั้งค่าใน Supabase secrets');
    }

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
            content: `คุณเป็นผู้ช่วยทางการแพทย์ AI ที่เชี่ยวชาญด้านสุขภาพเท่านั้น คุณสามารถตอบคำถามเฉพาะเรื่องต่อไปนี้:
- อาการและโรคต่างๆ
- การรักษาและยา
- การดูแลสุขภาพและการป้องกันโรค
- คำแนะนำด้านสุขภาพทั่วไป
- อาหารและโภชนาการ
- การออกกำลังกายเพื่อสุขภาพ
- สุขภาพจิต

หากผู้ใช้ถามเรื่องอื่นที่ไม่ใช่เรื่องสุขภาพ ให้ตอบว่า "ขออภัย ฉันสามารถให้คำปรึกษาเฉพาะเรื่องสุขภาพเท่านั้น กรุณาสอบถามเรื่องที่เกี่ยวข้องกับสุขภาพ การแพทย์ หรือการดูแลตัวเอง"

ตอบคำถามด้วยภาษาไทยที่เข้าใจง่าย และเตือนเสมอว่าคำแนะนำนี้ไม่สามารถทดแทนการตรวจรักษาจากแพทย์ได้` 
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
        throw new Error('API มีการใช้งานเกินขีดจำกัด กรุณาลองใหม่ในภายหลัง');
      } else if (response.status === 401) {
        throw new Error('API key ไม่ถูกต้อง กรุณาตรวจสอบใน Supabase secrets');
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