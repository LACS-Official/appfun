import type { APIRoute } from 'astro';
import { createClient } from '../../../lib/supabase/server';

export const GET: APIRoute = async ({ cookies }) => {
  const supabase = createClient(cookies);

  try {
    // 获取当前会话
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      return new Response(
        JSON.stringify({ 
          error: sessionError.message, 
          session: null,
          isLoggedIn: false 
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!session) {
      return new Response(
        JSON.stringify({ 
          session: null,
          isLoggedIn: false,
          message: '用户未登录'
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 获取用户信息
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      return new Response(
        JSON.stringify({ 
          error: userError.message, 
          session: null,
          isLoggedIn: false 
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        session: {
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_at: session.expires_at,
          expires_in: session.expires_in,
          token_type: session.token_type,
        },
        user: user ? {
          id: user.id,
          email: user.email,
          username: user.user_metadata?.username || user.email?.split('@')[0],
          full_name: user.user_metadata?.full_name,
          avatar: user.user_metadata?.avatar_url,
          email_confirmed_at: user.email_confirmed_at,
          created_at: user.created_at,
          updated_at: user.updated_at,
          isLoggedIn: true,
        } : null,
        isLoggedIn: true
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: '获取会话信息失败', 
        session: null,
        isLoggedIn: false 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const DELETE: APIRoute = async ({ cookies }) => {
  const supabase = createClient(cookies);

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: '退出登录成功' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: '退出登录失败' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
