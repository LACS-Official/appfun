import type { APIRoute } from 'astro';
import { createClient } from '../../../lib/supabase/server';

export const GET: APIRoute = async ({ cookies }) => {
  const supabase = createClient(cookies);

  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message, user: null }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        user: user ? {
          id: user.id,
          email: user.email,
          username: user.user_metadata?.username || user.email?.split('@')[0],
          avatar: user.user_metadata?.avatar_url,
          isLoggedIn: true,
        } : null 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: '获取用户信息失败', user: null }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
