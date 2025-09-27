import { createServerClient } from "@supabase/ssr";
import type { AstroCookies } from "astro";

export function createClient(cookies: AstroCookies) {
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  // 检查环境变量是否配置
  if (!supabaseUrl || !supabaseAnonKey ||
      supabaseUrl === 'your_supabase_url_here' ||
      supabaseAnonKey === 'your_supabase_anon_key_here') {
    throw new Error('Supabase 配置未设置。请在 .env 文件中配置 PUBLIC_SUPABASE_URL 和 PUBLIC_SUPABASE_ANON_KEY');
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        try {
          // 使用更兼容的方式获取所有 cookies
          const allCookies = [];

          // 尝试获取常见的 Supabase cookies
          const supabaseCookieNames = [
            'sb-access-token',
            'sb-refresh-token',
            'sb-auth-token',
            `sb-${supabaseUrl.split('//')[1]?.split('.')[0]}-auth-token`,
            `sb-${supabaseUrl.split('//')[1]?.split('.')[0]}-auth-token-code-verifier`
          ];

          for (const cookieName of supabaseCookieNames) {
            try {
              const cookie = cookies.get(cookieName);
              if (cookie?.value) {
                allCookies.push({
                  name: cookieName,
                  value: cookie.value
                });
              }
            } catch (error) {
              // 忽略单个 cookie 获取失败
              console.debug(`Failed to get cookie ${cookieName}:`, error);
            }
          }

          return allCookies;
        } catch (error) {
          console.warn('Failed to get cookies:', error);
          return [];
        }
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          try {
            cookies.set(name, value, {
              ...options,
              httpOnly: false, // 确保客户端可以访问
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax'
            });
          } catch (error) {
            console.warn(`Failed to set cookie ${name}:`, error);
          }
        });
      },
    },
  });
}

/**
 * 从Cookie中获取所有Supabase相关的Cookie
 */
export function getSupabaseCookies(cookies: AstroCookies): Record<string, string> {
  const supabaseCookies: Record<string, string> = {};
  
  // 检查cookies是否有getAll方法，如果没有则使用替代方法
  try {
    // 直接使用cookies.get获取所需的Supabase cookie
    const cookieKeys = ['sb-access-token', 'sb-refresh-token', 'sb-account'];
    
    for (const key of cookieKeys) {
      const value = cookies.get(key);
      if (value && typeof value === 'object' && 'value' in value) {
        supabaseCookies[key] = value.value;
      }
    }
  } catch (error) {
    console.error('获取Supabase cookies失败:', error);
  }
  
  return supabaseCookies;
}
