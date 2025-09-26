-- 创建邀请码表
CREATE TABLE invitation_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
    used_at TIMESTAMP WITH TIME ZONE NULL,
    used_by UUID REFERENCES auth.users(id) NULL,
    generated_by VARCHAR(100) DEFAULT 'miniprogram',
    ad_watch_id VARCHAR(100) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    max_uses INTEGER DEFAULT 1,
    current_uses INTEGER DEFAULT 0
);

-- 创建索引
CREATE INDEX idx_invitation_codes_code ON invitation_codes(code);
CREATE INDEX idx_invitation_codes_used_by ON invitation_codes(used_by);
CREATE INDEX idx_invitation_codes_created_at ON invitation_codes(created_at);
CREATE INDEX idx_invitation_codes_expires_at ON invitation_codes(expires_at);

-- 创建 RLS 策略
ALTER TABLE invitation_codes ENABLE ROW LEVEL SECURITY;

-- 允许所有人查看有效的邀请码（用于验证）
CREATE POLICY "Allow public to validate invitation codes" ON invitation_codes
    FOR SELECT USING (is_active = true AND expires_at > NOW());

-- 只允许服务端插入邀请码
CREATE POLICY "Allow service to insert invitation codes" ON invitation_codes
    FOR INSERT WITH CHECK (true);

-- 只允许服务端更新邀请码
CREATE POLICY "Allow service to update invitation codes" ON invitation_codes
    FOR UPDATE USING (true);

-- 创建函数：生成邀请码
CREATE OR REPLACE FUNCTION generate_invitation_code(
    p_ad_watch_id VARCHAR(100) DEFAULT NULL
) RETURNS TEXT AS $$
DECLARE
    v_code TEXT;
    v_exists BOOLEAN;
BEGIN
    -- 生成8位随机邀请码
    LOOP
        v_code := UPPER(
            SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 8)
        );
        
        -- 检查是否已存在
        SELECT EXISTS(SELECT 1 FROM invitation_codes WHERE code = v_code) INTO v_exists;
        
        EXIT WHEN NOT v_exists;
    END LOOP;
    
    -- 插入邀请码
    INSERT INTO invitation_codes (code, ad_watch_id)
    VALUES (v_code, p_ad_watch_id);
    
    RETURN v_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建函数：验证并使用邀请码
CREATE OR REPLACE FUNCTION validate_and_use_invitation_code(
    p_code VARCHAR(20),
    p_user_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    v_invitation_id UUID;
    v_current_uses INTEGER;
    v_max_uses INTEGER;
BEGIN
    -- 查找有效的邀请码
    SELECT id, current_uses, max_uses
    INTO v_invitation_id, v_current_uses, v_max_uses
    FROM invitation_codes
    WHERE code = p_code
      AND is_active = true
      AND expires_at > NOW()
      AND (used_by IS NULL OR max_uses > current_uses);
    
    -- 如果没找到有效邀请码
    IF v_invitation_id IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- 更新邀请码使用状态
    UPDATE invitation_codes
    SET 
        current_uses = current_uses + 1,
        used_at = CASE WHEN used_at IS NULL THEN NOW() ELSE used_at END,
        used_by = CASE WHEN used_by IS NULL THEN p_user_id ELSE used_by END,
        is_active = CASE WHEN (current_uses + 1) >= max_uses THEN FALSE ELSE is_active END
    WHERE id = v_invitation_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建函数：检查邀请码是否有效
CREATE OR REPLACE FUNCTION check_invitation_code_validity(
    p_code VARCHAR(20)
) RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS(
        SELECT 1 
        FROM invitation_codes 
        WHERE code = p_code
          AND is_active = true
          AND expires_at > NOW()
          AND (used_by IS NULL OR current_uses < max_uses)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
