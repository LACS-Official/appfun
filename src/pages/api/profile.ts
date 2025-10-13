import type { APIRoute } from 'astro';
import { createClient } from '../../lib/supabase/server';

export const PUT: APIRoute = async ({ request, cookies }) => {
  try {
    // 创建Supabase客户端
    const supabase = createClient(cookies);
    
    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: '未授权' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // 解析请求体
    const body = await request.json();
    const { username, bio } = body;
    
    // 验证数据
    if (!username || username.trim() === '') {
      return new Response(JSON.stringify({ error: '用户名不能为空' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // 首先尝试更新现有记录
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    let data;
    let error;
    
    if (existingProfile) {
      // 如果记录存在，则更新
      const result = await supabase
        .from('profiles')
        .update({
          username: username.trim(),
          bio: bio || '',
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();
      
      data = result.data;
      error = result.error;
    } else {
      // 如果记录不存在，则插入新记录
      const result = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          username: username.trim(),
          bio: bio || '',
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      data = result.data;
      error = result.error;
    }
    
    if (error) {
      throw error;
    }
    
    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('更新个人资料失败:', error);
    return new Response(JSON.stringify({ error: error?.message || '更新失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const GET: APIRoute = async ({ cookies }) => {
  try {
    // 创建Supabase客户端
    const supabase = createClient(cookies);
    
    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: '未授权' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // 获取用户资料
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    // 如果没有找到资料，返回默认资料
    const profile = data || {
      id: user.id,
      username: user?.email?.split('@')[0] || '用户',
      bio: '',
      avatar_url: null,
      updated_at: new Date().toISOString()
    };
    
    return new Response(JSON.stringify({ data: profile }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('获取个人资料失败:', error);
    return new Response(JSON.stringify({ error: error?.message || '获取失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};