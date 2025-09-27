import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '邮箱和密码不能为空'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

    const results = [];

    // 1. 检查配置
    results.push({
      step: '检查 Supabase 配置',
      success: !!supabaseUrl && !!supabaseAnonKey,
      url: supabaseUrl,
      keyLength: supabaseAnonKey?.length || 0
    });

    if (!supabaseUrl || !supabaseAnonKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Supabase 配置不完整',
          results: results
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. 创建客户端
    let supabase;
    try {
      supabase = createClient(supabaseUrl, supabaseAnonKey);
      results.push({
        step: '创建 Supabase 客户端',
        success: true,
        message: '客户端创建成功'
      });
    } catch (error) {
      results.push({
        step: '创建 Supabase 客户端',
        success: false,
        error: error instanceof Error ? error.message : '创建失败'
      });
      
      return new Response(
        JSON.stringify({
          success: false,
          error: '无法创建 Supabase 客户端',
          results: results
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. 尝试登录
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) {
        results.push({
          step: '用户登录',
          success: false,
          error: error.message,
          errorCode: error.status || 'unknown'
        });

        // 检查是否是用户不存在的错误
        if (error.message.includes('Invalid login credentials')) {
          results.push({
            step: '错误分析',
            success: false,
            message: '用户名或密码错误，或用户不存在'
          });
        } else if (error.message.includes('Email not confirmed')) {
          results.push({
            step: '错误分析',
            success: false,
            message: '邮箱未验证'
          });
        }

        return new Response(
          JSON.stringify({
            success: false,
            error: error.message,
            results: results
          }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      results.push({
        step: '用户登录',
        success: true,
        message: '登录成功',
        userId: data.user?.id,
        userEmail: data.user?.email
      });

      // 4. 检查用户资料
      if (data.user) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('auth_user_id', data.user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            results.push({
              step: '查询用户资料',
              success: false,
              error: profileError.message
            });
          } else if (!profile) {
            results.push({
              step: '查询用户资料',
              success: false,
              message: '用户资料不存在，需要创建'
            });
          } else {
            results.push({
              step: '查询用户资料',
              success: true,
              message: '用户资料存在',
              profileId: profile.id,
              username: profile.username
            });
          }
        } catch (error) {
          results.push({
            step: '查询用户资料',
            success: false,
            error: error instanceof Error ? error.message : '查询失败'
          });
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: '登录测试成功',
          results: results,
          user: {
            id: data.user?.id,
            email: data.user?.email,
            emailConfirmed: !!data.user?.email_confirmed_at
          }
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );

    } catch (error) {
      results.push({
        step: '用户登录',
        success: false,
        error: error instanceof Error ? error.message : '登录失败'
      });

      return new Response(
        JSON.stringify({
          success: false,
          error: '登录过程中发生错误',
          results: results
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('登录测试错误:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: '登录测试失败',
        message: error instanceof Error ? error.message : '未知错误'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
