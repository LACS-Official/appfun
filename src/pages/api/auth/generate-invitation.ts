import type { APIRoute } from 'astro';
import { createClient } from '../../../lib/supabase/server';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const { adWatchId, apiKey } = body;

    // 简单的API密钥验证（在生产环境中应该使用更安全的方式）
    const expectedApiKey = process.env.MINIPROGRAM_API_KEY || 'lacs-miniprogram-2024';
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

    try {
      // 生成随机邀请码（8位大写字母和数字）
      function generateCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      }

      let newCode = generateCode();
      let attempts = 0;
      const maxAttempts = 10;

      // 确保邀请码唯一性
      while (attempts < maxAttempts) {
        try {
          const { data: existing, error: checkError } = await supabase
            .from('invitation_codes')
            .select('id')
            .eq('code', newCode)
            .single();

          if (checkError && checkError.code === 'PGRST116') {
            // 没有找到重复的邀请码，可以使用
            break;
          } else if (existing) {
            // 找到重复的，重新生成
            newCode = generateCode();
            attempts++;
          } else if (checkError) {
            // 其他错误，可能是表不存在
            console.warn('检查邀请码重复性时发生错误:', checkError);
            break;
          }
        } catch (error) {
          console.warn('检查邀请码唯一性时发生异常:', error);
          break;
        }
      }

      // 尝试插入邀请码到数据库
      try {
        const { data, error } = await supabase
          .from('invitation_codes')
          .insert({
            code: newCode,
            ad_watch_id: adWatchId || null,
            generated_by: 'miniprogram'
          })
          .select()
          .single();

        if (error) {
          console.error('插入邀请码到数据库时发生错误:', error);

          // 如果表不存在，仍然返回生成的邀请码
          if (error.message.includes('relation') || error.message.includes('does not exist')) {
            console.log('数据库表不存在，返回生成的邀请码（测试模式）');
            return new Response(
              JSON.stringify({
                success: true,
                code: newCode,
                message: '邀请码生成成功（测试模式）'
              }),
              { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
          }

          return new Response(
            JSON.stringify({
              success: false,
              error: '生成邀请码时发生错误'
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({
            success: true,
            code: newCode,
            message: '邀请码生成成功'
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

      } catch (error) {
        console.error('生成邀请码时发生异常:', error);

        // 降级：返回生成的邀请码，即使没有保存到数据库
        return new Response(
          JSON.stringify({
            success: true,
            code: newCode,
            message: '邀请码生成成功（未保存到数据库）'
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }

    } catch (error) {
      console.error('生成邀请码时发生异常:', error);
      return new Response(
        JSON.stringify({
          success: false,
          error: '生成邀请码时发生错误'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('生成邀请码API错误:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: '服务器内部错误' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
