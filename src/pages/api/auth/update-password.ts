import type { APIRoute } from 'astro';
import { createClient } from '../../../lib/supabase/server';

export const POST: APIRoute = async ({ request, cookies }) => {
  const supabase = createClient(cookies);

  try {
    // 检查用户是否已登录
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: '用户未登录' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 解析请求体
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return new Response(
        JSON.stringify({ error: '密码不能为空' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (password.length < 6) {
      return new Response(
        JSON.stringify({ error: '密码长度至少为6位' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 更新密码
    const { error: updateError } = await supabase.auth.updateUser({
      password: password
    });

    if (updateError) {
      return new Response(
        JSON.stringify({ error: updateError.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        message: '密码更新成功'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: '更新密码失败' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
