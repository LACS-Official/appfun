import type { APIRoute } from 'astro';
import { createClient } from '../../../lib/supabase/server';

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const supabase = createClient(cookies);
    const results = [];

    // 1. 检查基本连接
    try {
      const { data, error } = await supabase.from('information_schema.tables').select('table_name').limit(1);
      results.push({
        test: '数据库连接',
        success: !error,
        error: error?.message
      });
    } catch (error) {
      results.push({
        test: '数据库连接',
        success: false,
        error: error instanceof Error ? error.message : '连接失败'
      });
    }

    // 2. 检查 user_profiles 表是否存在
    try {
      const { data, error } = await supabase.from('user_profiles').select('id').limit(1);
      results.push({
        test: 'user_profiles 表',
        success: !error,
        error: error?.message,
        data: data?.length || 0
      });
    } catch (error) {
      results.push({
        test: 'user_profiles 表',
        success: false,
        error: error instanceof Error ? error.message : '表不存在'
      });
    }

    // 3. 检查 invitation_codes 表是否存在
    try {
      const { data, error } = await supabase.from('invitation_codes').select('id').limit(1);
      results.push({
        test: 'invitation_codes 表',
        success: !error,
        error: error?.message,
        data: data?.length || 0
      });
    } catch (error) {
      results.push({
        test: 'invitation_codes 表',
        success: false,
        error: error instanceof Error ? error.message : '表不存在'
      });
    }

    // 4. 检查数据库函数是否存在
    try {
      const { data, error } = await supabase.rpc('check_invitation_code_validity', {
        p_code: 'TESTCODE'
      });
      results.push({
        test: 'check_invitation_code_validity 函数',
        success: !error,
        error: error?.message
      });
    } catch (error) {
      results.push({
        test: 'check_invitation_code_validity 函数',
        success: false,
        error: error instanceof Error ? error.message : '函数不存在'
      });
    }

    // 5. 检查是否有测试邀请码
    try {
      const { data, error } = await supabase
        .from('invitation_codes')
        .select('code, is_active')
        .in('code', ['TEST0001', 'TEST0002', 'DEMO1234']);
      
      results.push({
        test: '测试邀请码',
        success: !error && data && data.length > 0,
        error: error?.message,
        data: data?.map(d => d.code) || []
      });
    } catch (error) {
      results.push({
        test: '测试邀请码',
        success: false,
        error: error instanceof Error ? error.message : '查询失败'
      });
    }

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    return new Response(
      JSON.stringify({
        success: successCount === totalCount,
        message: `数据库检查完成：${successCount}/${totalCount} 项通过`,
        results: results
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('数据库检查错误:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: '数据库检查失败',
        message: error instanceof Error ? error.message : '未知错误'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
