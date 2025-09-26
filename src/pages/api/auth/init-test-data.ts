import type { APIRoute } from 'astro';
import { createClient } from '../../../lib/supabase/server';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const { apiKey } = body;

    // 简单的API密钥验证
    const expectedApiKey = process.env.MINIPROGRAM_API_KEY || 'your-secret-api-key';
    if (apiKey !== expectedApiKey) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: '无效的API密钥' 
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(cookies);

    // 创建测试邀请码
    const testCodes = [
      { code: 'TEST0001', ad_watch_id: 'test-ad-001' },
      { code: 'TEST0002', ad_watch_id: 'test-ad-002' },
      { code: 'TEST0003', ad_watch_id: 'test-ad-003' },
      { code: 'DEMO1234', ad_watch_id: 'demo-ad-001' },
      { code: 'SAMPLE01', ad_watch_id: 'sample-ad-001' },
    ];

    const results = [];

    for (const testCode of testCodes) {
      try {
        // 检查邀请码是否已存在
        const { data: existing } = await supabase
          .from('invitation_codes')
          .select('id')
          .eq('code', testCode.code)
          .single();

        if (!existing) {
          // 插入新的邀请码
          const { data, error } = await supabase
            .from('invitation_codes')
            .insert({
              code: testCode.code,
              ad_watch_id: testCode.ad_watch_id,
              generated_by: 'test-init'
            })
            .select()
            .single();

          if (error) {
            results.push({ code: testCode.code, success: false, error: error.message });
          } else {
            results.push({ code: testCode.code, success: true, data });
          }
        } else {
          results.push({ code: testCode.code, success: true, message: '邀请码已存在' });
        }
      } catch (error) {
        results.push({ 
          code: testCode.code, 
          success: false, 
          error: error instanceof Error ? error.message : '未知错误' 
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `初始化完成：成功 ${successCount} 个，失败 ${failureCount} 个`,
        results: results
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('初始化测试数据API错误:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: '服务器内部错误' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
