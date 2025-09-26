import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  // 检查环境变量是否配置
  if (!supabaseUrl || !supabaseAnonKey ||
      supabaseUrl === 'your_supabase_url_here' ||
      supabaseAnonKey === 'your_supabase_anon_key_here') {
    throw new Error('Supabase 配置未设置。请在 .env 文件中配置 PUBLIC_SUPABASE_URL 和 PUBLIC_SUPABASE_ANON_KEY');
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
