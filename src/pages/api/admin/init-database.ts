import type { APIRoute } from 'astro';
import { createClient } from '../../../lib/supabase/server';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const { adminKey } = body;

    // 简单的管理员密钥验证
    const expectedAdminKey = process.env.ADMIN_KEY || 'admin-init-2024';
    if (adminKey !== expectedAdminKey) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: '无效的管理员密钥' 
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(cookies);
    const results = [];

    try {
      // 1. 创建用户资料表
      const createUserProfilesTable = `
        CREATE TABLE IF NOT EXISTS user_profiles (
          id SERIAL PRIMARY KEY,
          auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
          username VARCHAR(50) UNIQUE,
          full_name VARCHAR(100),
          avatar_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;

      const { error: createTableError } = await supabase.rpc('exec_sql', {
        sql: createUserProfilesTable
      });

      if (createTableError) {
        results.push({ step: '创建用户资料表', success: false, error: createTableError.message });
      } else {
        results.push({ step: '创建用户资料表', success: true });
      }

      // 2. 创建索引
      const createIndexes = [
        'CREATE INDEX IF NOT EXISTS idx_user_profiles_auth_user_id ON user_profiles(auth_user_id);',
        'CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);',
        'CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at);'
      ];

      for (const indexSql of createIndexes) {
        const { error: indexError } = await supabase.rpc('exec_sql', { sql: indexSql });
        if (indexError) {
          results.push({ step: `创建索引: ${indexSql}`, success: false, error: indexError.message });
        } else {
          results.push({ step: `创建索引`, success: true });
        }
      }

      // 3. 启用 RLS
      const enableRLS = 'ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;';
      const { error: rlsError } = await supabase.rpc('exec_sql', { sql: enableRLS });
      
      if (rlsError) {
        results.push({ step: '启用RLS', success: false, error: rlsError.message });
      } else {
        results.push({ step: '启用RLS', success: true });
      }

      // 4. 创建邀请码表
      const createInvitationTable = `
        CREATE TABLE IF NOT EXISTS invitation_codes (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          code VARCHAR(20) UNIQUE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
          used_at TIMESTAMP WITH TIME ZONE NULL,
          used_by UUID REFERENCES auth.users(id) NULL,
          used_by_profile_id INTEGER REFERENCES user_profiles(id) NULL,
          generated_by VARCHAR(100) DEFAULT 'miniprogram',
          ad_watch_id VARCHAR(100) NULL,
          is_active BOOLEAN DEFAULT TRUE,
          max_uses INTEGER DEFAULT 1,
          current_uses INTEGER DEFAULT 0
        );
      `;

      const { error: invitationTableError } = await supabase.rpc('exec_sql', {
        sql: createInvitationTable
      });

      if (invitationTableError) {
        results.push({ step: '创建邀请码表', success: false, error: invitationTableError.message });
      } else {
        results.push({ step: '创建邀请码表', success: true });
      }

      // 5. 创建一些测试邀请码
      const testCodes = ['TEST0001', 'TEST0002', 'TEST0003', 'DEMO1234', 'SAMPLE01'];
      
      for (const code of testCodes) {
        const { error: insertError } = await supabase
          .from('invitation_codes')
          .upsert({
            code: code,
            ad_watch_id: `test-${code.toLowerCase()}`,
            generated_by: 'admin-init'
          }, {
            onConflict: 'code'
          });

        if (insertError) {
          results.push({ step: `创建测试邀请码 ${code}`, success: false, error: insertError.message });
        } else {
          results.push({ step: `创建测试邀请码 ${code}`, success: true });
        }
      }

      const successCount = results.filter(r => r.success).length;
      const totalCount = results.length;

      return new Response(
        JSON.stringify({ 
          success: true,
          message: `数据库初始化完成：${successCount}/${totalCount} 步骤成功`,
          results: results
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );

    } catch (error) {
      console.error('数据库初始化错误:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: '数据库初始化失败',
          results: results
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('数据库初始化API错误:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: '服务器内部错误' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
