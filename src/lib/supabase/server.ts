import { createServerClient } from '@supabase/ssr';
import type { AstroCookies } from 'astro';

export function createClient(cookies: AstroCookies) {
  // 检查环境变量是否存在
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase 配置缺失。请在 .env 文件中设置 PUBLIC_SUPABASE_URL 和 PUBLIC_SUPABASE_ANON_KEY');
    // 返回一个模拟客户端，避免应用崩溃
    return {
      auth: {
        signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase 未配置') }),
        signUp: () => Promise.resolve({ data: null, error: new Error('Supabase 未配置') }),
        signOut: () => Promise.resolve({ error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: new Error('Supabase 未配置') })
          })
        }),
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: new Error('Supabase 未配置') })
          })
        }),
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: null, error: new Error('Supabase 未配置') })
            })
          })
        })
      })
    };
  }
  
  // 检查 cookies 对象是否存在
  if (!cookies) {
    console.error('Cookies 对象不存在');
    // 返回一个模拟客户端，避免应用崩溃
    return {
      auth: {
        signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Cookies 对象不存在') }),
        signUp: () => Promise.resolve({ data: null, error: new Error('Cookies 对象不存在') }),
        signOut: () => Promise.resolve({ error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: new Error('Cookies 对象不存在') })
          })
        }),
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: new Error('Cookies 对象不存在') })
          })
        }),
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: null, error: new Error('Cookies 对象不存在') })
            })
          })
        })
      })
    };
  }
  
  // 完全重写 cookies 适配器，避免直接访问 cookies.getAll/setAll
  const cookieAdapter = {
    get: (key: string) => {
      try {
        // 使用 Astro cookies 的正确方法
        const cookie = cookies.get(key);
        return cookie ? cookie.value : null;
      } catch (error) {
        console.error(`获取 cookie ${key} 失败:`, error);
        return null;
      }
    },
    set: (key: string, value: string, options: any) => {
      try {
        // 使用 Astro cookies 的正确方法
        cookies.set(key, value, options);
      } catch (error) {
        console.error(`设置 cookie ${key} 失败:`, error);
      }
    },
    remove: (key: string, options: any) => {
      try {
        // 使用 Astro cookies 的正确方法
        cookies.delete(key, options);
      } catch (error) {
        console.error(`删除 cookie ${key} 失败:`, error);
      }
    }
  };
  
  // 使用 cookie 适配器而不是直接使用 cookies
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: cookieAdapter
  });
}