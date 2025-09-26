import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const GET: APIRoute = async () => {
  try {
    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

    const results = [];

    // 1. 检查环境变量
    results.push({
      test: 'Supabase URL 配置',
      success: !!supabaseUrl && supabaseUrl !== 'your_supabase_url_here',
      value: supabaseUrl || '未配置',
      expected: 'https://szuigvillnbtycwtawar.supabase.co'
    });

    results.push({
      test: 'Supabase 匿名密钥配置',
      success: !!supabaseAnonKey && supabaseAnonKey !== 'your_supabase_anon_key_here',
      value: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : '未配置',
      length: supabaseAnonKey?.length || 0
    });

    // 2. 测试 Supabase 客户端创建
    let supabase = null;
    try {
      supabase = createClient(supabaseUrl, supabaseAnonKey);
      results.push({
        test: 'Supabase 客户端创建',
        success: true,
        message: '客户端创建成功'
      });
    } catch (error) {
      results.push({
        test: 'Supabase 客户端创建',
        success: false,
        error: error instanceof Error ? error.message : '创建失败'
      });
    }

    // 3. 测试基本连接
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.getSession();
        results.push({
          test: '认证服务连接',
          success: !error,
          error: error?.message,
          hasSession: !!data?.session
        });
      } catch (error) {
        results.push({
          test: '认证服务连接',
          success: false,
          error: error instanceof Error ? error.message : '连接失败'
        });
      }

      // 4. 测试数据库连接（尝试查询一个系统表）
      try {
        const { data, error } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .limit(1);
        
        results.push({
          test: '数据库连接',
          success: !error,
          error: error?.message,
          tablesFound: data?.length || 0
        });
      } catch (error) {
        results.push({
          test: '数据库连接',
          success: false,
          error: error instanceof Error ? error.message : '连接失败'
        });
      }

      // 5. 测试用户表查询
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('id')
          .limit(1);
        
        results.push({
          test: 'user_profiles 表查询',
          success: !error,
          error: error?.message,
          recordsFound: data?.length || 0
        });
      } catch (error) {
        results.push({
          test: 'user_profiles 表查询',
          success: false,
          error: error instanceof Error ? error.message : '查询失败'
        });
      }

      // 6. 测试邀请码表查询
      try {
        const { data, error } = await supabase
          .from('invitation_codes')
          .select('id')
          .limit(1);
        
        results.push({
          test: 'invitation_codes 表查询',
          success: !error,
          error: error?.message,
          recordsFound: data?.length || 0
        });
      } catch (error) {
        results.push({
          test: 'invitation_codes 表查询',
          success: false,
          error: error instanceof Error ? error.message : '查询失败'
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    return new Response(
      JSON.stringify({
        success: successCount === totalCount,
        message: `Supabase 测试完成：${successCount}/${totalCount} 项通过`,
        results: results,
        summary: {
          total: totalCount,
          passed: successCount,
          failed: totalCount - successCount
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Supabase 测试错误:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Supabase 测试失败',
        message: error instanceof Error ? error.message : '未知错误'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
