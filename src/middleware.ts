import { defineMiddleware } from 'astro:middleware';
import { createClient } from './lib/supabase/server';

// 受保护的路由列表
const protectedRoutes = ['/account', '/account/', '/software/manage', '/dashboard'];

export const onRequest = defineMiddleware(async (context, next) => {
  // 检查是否是受保护的路由
  const isProtectedRoute = protectedRoutes.some(route => 
    context.url.pathname.startsWith(route)
  );

  // 如果是受保护的路由，检查用户是否已登录
  if (isProtectedRoute) {
    const supabase = createClient(context.cookies);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // 用户未登录，重定向到登录页面
      return context.redirect('/auth/login');
    }
  }

  // 继续处理请求
  return next();
});