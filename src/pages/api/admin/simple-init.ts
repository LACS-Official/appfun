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

    // 1. 创建用户资料表
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id')
        .limit(1);

      if (error && error.message.includes('relation') && error.message.includes('does not exist')) {
        // 表不存在，需要创建
        results.push({
          step: '检查用户资料表',
          success: false,
          message: '表不存在，需要手动创建'
        });
      } else if (error) {
        results.push({
          step: '检查用户资料表',
          success: false,
          error: error.message
        });
      } else {
        results.push({
          step: '检查用户资料表',
          success: true,
          message: '表已存在'
        });
      }
    } catch (error) {
      results.push({
        step: '检查用户资料表',
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      });
    }

    // 2. 创建邀请码表
    try {
      const { data, error } = await supabase
        .from('invitation_codes')
        .select('id')
        .limit(1);

      if (error && error.message.includes('relation') && error.message.includes('does not exist')) {
        // 表不存在，需要创建
        results.push({
          step: '检查邀请码表',
          success: false,
          message: '表不存在，需要手动创建'
        });
      } else if (error) {
        results.push({
          step: '检查邀请码表',
          success: false,
          error: error.message
        });
      } else {
        results.push({
          step: '检查邀请码表',
          success: true,
          message: '表已存在'
        });
      }
    } catch (error) {
      results.push({
        step: '检查邀请码表',
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      });
    }

    // 3. 如果邀请码表存在，创建测试邀请码
    try {
      const testCodes = ['TEST0001', 'TEST0002', 'TEST0003', 'DEMO1234', 'SAMPLE01'];
      
      for (const code of testCodes) {
        try {
          const { data, error } = await supabase
            .from('invitation_codes')
            .upsert({
              code: code,
              ad_watch_id: `test-${code.toLowerCase()}`,
              generated_by: 'admin-init',
              expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30天后过期
              is_active: true,
              max_uses: 1,
              current_uses: 0
            }, {
              onConflict: 'code'
            });

          if (error) {
            results.push({
              step: `创建测试邀请码 ${code}`,
              success: false,
              error: error.message
            });
          } else {
            results.push({
              step: `创建测试邀请码 ${code}`,
              success: true,
              message: '创建成功'
            });
          }
        } catch (error) {
          results.push({
            step: `创建测试邀请码 ${code}`,
            success: false,
            error: error instanceof Error ? error.message : '未知错误'
          });
        }
      }
    } catch (error) {
      results.push({
        step: '创建测试邀请码',
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      });
    }

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    // 生成 SQL 创建脚本
    const sqlScript = `
-- 创建用户资料表
CREATE TABLE IF NOT EXISTS user_profiles (
    id SERIAL PRIMARY KEY,
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    username VARCHAR(50) UNIQUE,
    full_name VARCHAR(100),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_user_profiles_auth_user_id ON user_profiles(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at);

-- 启用 RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略
CREATE POLICY IF NOT EXISTS "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth_user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth_user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth_user_id = auth.uid());

-- 创建邀请码表
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

-- 创建邀请码表索引
CREATE INDEX IF NOT EXISTS idx_invitation_codes_code ON invitation_codes(code);
CREATE INDEX IF NOT EXISTS idx_invitation_codes_used_by ON invitation_codes(used_by);
CREATE INDEX IF NOT EXISTS idx_invitation_codes_used_by_profile_id ON invitation_codes(used_by_profile_id);
CREATE INDEX IF NOT EXISTS idx_invitation_codes_created_at ON invitation_codes(created_at);

-- 插入测试邀请码
INSERT INTO invitation_codes (code, ad_watch_id, generated_by) VALUES
('TEST0001', 'test-test0001', 'admin-init'),
('TEST0002', 'test-test0002', 'admin-init'),
('TEST0003', 'test-test0003', 'admin-init'),
('DEMO1234', 'test-demo1234', 'admin-init'),
('SAMPLE01', 'test-sample01', 'admin-init')
ON CONFLICT (code) DO NOTHING;

-- 创建触发器函数：自动创建用户资料
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (auth_user_id, username, full_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建更新时间触发器
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;

    return new Response(
      JSON.stringify({ 
        success: successCount > 0,
        message: `数据库检查完成：${successCount}/${totalCount} 步骤成功`,
        results: results,
        sqlScript: sqlScript.trim()
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('数据库初始化错误:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: '数据库初始化失败',
        message: error instanceof Error ? error.message : '未知错误'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
