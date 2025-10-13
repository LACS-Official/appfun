import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // 检查环境变量是否存在
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase 配置缺失。请在 .env 文件中设置 PUBLIC_SUPABASE_URL 和 PUBLIC_SUPABASE_ANON_KEY");
    // 返回一个模拟客户端，避免应用崩溃
    return {
      auth: {
        signInWithPassword: () => Promise.resolve({ data: null, error: new Error("Supabase 未配置") }),
        signUp: () => Promise.resolve({ data: null, error: new Error("Supabase 未配置") }),
        signOut: () => Promise.resolve({ error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: new Error("Supabase 未配置") })
          })
        })
      })
    };
  }
  
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}