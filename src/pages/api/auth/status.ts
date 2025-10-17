import type { APIRoute } from 'astro';
import { createClient } from '../../../lib/supabase/server';

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const supabase = createClient(cookies);
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error.message,
          user: null 
        }), 
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        user: user ? {
          id: user.id,
          email: user.email,
          user_metadata: user.user_metadata
        } : null
      }), 
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: '服务器错误',
        user: null 
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};