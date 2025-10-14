/**
 * 跨域认证API路由
 * 处理来自其他网站的认证请求
 */

import type { APIRoute } from 'astro';
import { createClient } from '../../../lib/supabase/server';
import type { AstroCookies } from 'astro';

// 环境变量配置
const config = {
  // 允许的域名白名单
  allowedOrigins: import.meta.env.ALLOWED_ORIGINS ? 
    import.meta.env.ALLOWED_ORIGINS.split(',').map((origin: string) => origin.trim()) : 
    ['http://localhost:4321', 'https://app.lacs.cc'],
  
  // 会话过期时间（24小时）
  sessionExpiry: 24 * 60 * 60 * 1000,
};

/**
 * 验证请求来源
 */
function validateOrigin(origin: string | null): boolean {
  if (!origin) {
    return false;
  }
  
  return config.allowedOrigins.includes(origin);
}

/**
 * 设置CORS头
 */
function setCorsHeaders(response: Response, origin: string | null) {
  const originValue = origin || '';
  response.headers.set('Access-Control-Allow-Origin', originValue);
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

/**
 * 生成认证令牌
 */
function generateAuthToken(user: { id: string; email?: string; user_metadata?: { username?: string } }): string {
  const payload = {
    id: user.id,
    email: user.email,
    username: user.user_metadata?.username || user.email?.split('@')[0],
    timestamp: Date.now(),
    expiresAt: Date.now() + config.sessionExpiry,
  };
  
  // 使用 Base64 编码（实际生产环境应该使用 JWT）
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

/**
 * 验证认证令牌
 */
function validateAuthToken(token: string): { id: string; email?: string; username?: string; timestamp: number; expiresAt: number } | null {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    
    // 检查令牌是否过期
    if (Date.now() > payload.expiresAt) {
      return null;
    }
    
    return payload;
  } catch (error) {
    console.error('令牌验证失败:', error);
    return null;
  }
}

/**
 * 处理登录
 */
async function handleLogin(body: any, cookies: AstroCookies) {
  const { email, password } = body;
  
  if (!email || !password) {
    return { success: false, error: '邮箱和密码不能为空' };
  }
  
  const supabase = createClient(cookies);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    if (!data.user) {
      return { success: false, error: '登录失败' };
    }
    
    const token = generateAuthToken(data.user);
    
    return {
      success: true,
      token,
      user: {
        id: data.user.id,
        email: data.user.email,
        username: data.user.user_metadata?.username || data.user.email?.split('@')[0],
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message || '登录失败' };
  }
}

/**
 * 处理登出
 */
async function handleLogout(_body: any, cookies: AstroCookies) {
  const supabase = createClient(cookies);
  
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || '登出失败' };
  }
}

/**
 * 处理验证
 */
async function handleVerify(body: any, _cookies: AstroCookies) {
  const { token } = body;
  
  if (!token) {
    return { success: false, error: '令牌不能为空' };
  }
  
  const payload = validateAuthToken(token);
  
  if (!payload) {
    return { success: false, error: '无效的令牌' };
  }
  
  return {
    success: true,
    user: {
      id: payload.id,
      email: payload.email,
      username: payload.username,
    },
  };
}

/**
 * 处理获取用户信息
 */
async function handleGetUserInfo(_body: any, cookies: AstroCookies) {
  const supabase = createClient(cookies);
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    
    if (!user) {
      return { success: false, error: '用户未登录' };
    }
    
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.user_metadata?.username || user.email?.split('@')[0],
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message || '获取用户信息失败' };
  }
}

/**
 * 处理OPTIONS请求（CORS预检）
 */
export const OPTIONS: APIRoute = async ({ request }) => {
  const origin = request.headers.get('origin');
  
  if (!validateOrigin(origin)) {
    return new Response(null, { status: 403 });
  }

  const response = new Response(null, { status: 200 });
  return setCorsHeaders(response, origin || '');
};

/**
 * 处理POST请求
 */
export const POST: APIRoute = async ({ request, cookies }) => {
  const origin = request.headers.get('origin');
  
  if (!validateOrigin(origin)) {
    return new Response(
      JSON.stringify({ success: false, error: '未授权的域名' }),
      { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    const body = await request.json();
    const { action, origin: requestOrigin } = body;
    
    // 再次验证请求来源
    if (!validateOrigin(requestOrigin)) {
      const response = new Response(
        JSON.stringify({ success: false, error: '未授权的域名' }),
        { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      return setCorsHeaders(response, origin || '');
    }

    let result;
    switch (action) {
      case 'login':
        result = await handleLogin(body, cookies);
        break;
      case 'logout':
        result = await handleLogout(body, cookies);
        break;
      case 'verify':
        result = await handleVerify(body, cookies);
        break;
      case 'get_user_info':
        result = await handleGetUserInfo(body, cookies);
        break;
      default:
        result = { success: false, error: '无效的操作' };
    }

    const response = new Response(
      JSON.stringify(result),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    return setCorsHeaders(response, origin || '');

  } catch (error) {
    console.error('跨域认证处理失败:', error);
    const response = new Response(
      JSON.stringify({ success: false, error: '服务器内部错误' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    return setCorsHeaders(response, origin || '');
  }
};

/**
 * 处理GET请求（状态检查）
 */
export const GET: APIRoute = async ({ request }) => {
  const origin = request.headers.get('origin');
  
  if (!validateOrigin(origin)) {
    return new Response(
      JSON.stringify({ success: false, error: '未授权的域名' }),
      { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    
    if (!token) {
      const response = new Response(
        JSON.stringify({
          success: false,
          isLoggedIn: false,
        }),
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      return setCorsHeaders(response, origin || '');
    }

    const payload = validateAuthToken(token);
    
    const response = new Response(
      JSON.stringify({
        success: true,
        isLoggedIn: !!payload,
        user: payload ? {
          id: payload.id,
          username: payload.username,
          email: payload.email,
        } : null,
      }),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    return setCorsHeaders(response, origin || '');

  } catch (error) {
    console.error('状态检查失败:', error);
    const response = new Response(
      JSON.stringify({ success: false, error: '服务器内部错误' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    return setCorsHeaders(response, origin || '');
  }
};