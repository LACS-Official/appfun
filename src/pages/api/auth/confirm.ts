import type { APIRoute } from 'astro';
import { createClient } from '../../../lib/supabase/server';

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const token_hash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type');
  const next = url.searchParams.get('next') ?? '/';

  if (token_hash && type) {
    const supabase = createClient(cookies);

    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    });

    if (!error) {
      return redirect(next);
    }
  }

  // 如果验证失败，重定向到错误页面
  return redirect('/auth/error?message=验证失败，请重试');
};
