import type { APIRoute } from 'astro';
import { createClient } from '../../../lib/supabase/server';

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const supabase = createClient(cookies);

    // 获取当前用户
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error('认证错误:', authError);
      return new Response(
        JSON.stringify({ error: authError.message, user: null }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!user) {
      return new Response(
        JSON.stringify({ error: '用户未登录', user: null }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 获取用户资料（从 user_profiles 表）
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('auth_user_id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = 没有找到记录
      console.error('获取用户资料错误:', profileError);
      return new Response(
        JSON.stringify({ error: '获取用户资料失败', user: null }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 如果没有资料记录，创建一个
    let userProfile = profile;
    if (!profile) {
      const { data: newProfile, error: createError } = await supabase
        .from('user_profiles')
        .insert({
          auth_user_id: user.id,
          username: user.user_metadata?.username || user.email?.split('@')[0],
          full_name: user.user_metadata?.full_name || '',
          avatar_url: user.user_metadata?.avatar_url || ''
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户资料错误:', createError);
        return new Response(
          JSON.stringify({ error: '创建用户资料失败', user: null }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      userProfile = newProfile;
    }

    // 返回用户信息
    const userData = {
      id: userProfile.id, // 数字ID
      auth_user_id: user.id, // 认证系统UUID
      email: user.email,
      username: userProfile.username,
      full_name: userProfile.full_name,
      avatar: userProfile.avatar_url,
      email_confirmed_at: user.email_confirmed_at,
      created_at: userProfile.created_at,
      updated_at: userProfile.updated_at,
      isLoggedIn: true,
    };

    return new Response(
      JSON.stringify({ user: userData }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('获取用户资料API错误:', error);
    return new Response(
      JSON.stringify({ error: '获取用户资料失败', user: null }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const PUT: APIRoute = async ({ request, cookies }) => {
  try {
    const supabase = createClient(cookies);

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
    const { username, full_name, avatar_url } = body;

    // 更新用户资料
    const { data: updatedProfile, error: updateError } = await supabase
      .from('user_profiles')
      .update({
        username: username,
        full_name: full_name,
        avatar_url: avatar_url,
        updated_at: new Date().toISOString()
      })
      .eq('auth_user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('更新用户资料错误:', updateError);
      return new Response(
        JSON.stringify({ error: updateError.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 同时更新认证系统的用户元数据
    const { error: authUpdateError } = await supabase.auth.updateUser({
      data: {
        username: username,
        full_name: full_name,
        avatar_url: avatar_url,
      }
    });

    if (authUpdateError) {
      console.warn('更新认证用户元数据失败:', authUpdateError);
      // 不阻止操作，因为主要数据已经更新
    }

    // 返回更新后的用户信息
    const userData = {
      id: updatedProfile.id, // 数字ID
      auth_user_id: user.id, // 认证系统UUID
      email: user.email,
      username: updatedProfile.username,
      full_name: updatedProfile.full_name,
      avatar: updatedProfile.avatar_url,
      email_confirmed_at: user.email_confirmed_at,
      created_at: updatedProfile.created_at,
      updated_at: updatedProfile.updated_at,
      isLoggedIn: true,
    };

    return new Response(
      JSON.stringify({
        message: '用户资料更新成功',
        user: userData
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('更新用户资料API错误:', error);
    return new Response(
      JSON.stringify({ error: '更新用户资料失败' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
