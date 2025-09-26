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

          // 如果有 getAll 方法，也尝试使用它
          if (typeof cookies.getAll === 'function') {
            try {
              const allFromGetAll = cookies.getAll();
              for (const cookie of allFromGetAll) {
                if (cookie.name.startsWith('sb-') &&
                    !allCookies.some(c => c.name === cookie.name)) {
                  allCookies.push({
                    name: cookie.name,
                    value: cookie.value
                  });
                }
              }
            } catch (error) {
              console.debug('getAll method failed:', error);
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
