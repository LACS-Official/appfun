-- 更新用户ID系统：从UUID改为自增数字ID
-- 注意：这个迁移需要谨慎执行，因为它会影响现有的用户数据

-- 1. 创建新的用户资料表，使用自增数字ID
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    username VARCHAR(50) UNIQUE,
    full_name VARCHAR(100),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建索引
CREATE INDEX idx_user_profiles_auth_user_id ON user_profiles(auth_user_id);
CREATE INDEX idx_user_profiles_username ON user_profiles(username);
CREATE INDEX idx_user_profiles_created_at ON user_profiles(created_at);

-- 3. 创建 RLS 策略
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的资料
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth_user_id = auth.uid());

-- 用户只能更新自己的资料
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth_user_id = auth.uid());

-- 用户可以插入自己的资料
CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth_user_id = auth.uid());

-- 4. 更新邀请码表，使用新的用户ID系统
ALTER TABLE invitation_codes 
ADD COLUMN used_by_profile_id INTEGER REFERENCES user_profiles(id);

-- 创建索引
CREATE INDEX idx_invitation_codes_used_by_profile_id ON invitation_codes(used_by_profile_id);

-- 5. 创建触发器：自动创建用户资料
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

-- 在用户注册时自动创建资料
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- 6. 创建触发器：更新 updated_at 字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. 创建函数：获取用户资料（通过数字ID）
CREATE OR REPLACE FUNCTION get_user_profile_by_id(profile_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    auth_user_id UUID,
    username VARCHAR(50),
    full_name VARCHAR(100),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        up.id,
        up.auth_user_id,
        up.username,
        up.full_name,
        up.avatar_url,
        up.created_at,
        up.updated_at
    FROM user_profiles up
    WHERE up.id = profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. 创建函数：获取用户资料（通过认证用户ID）
CREATE OR REPLACE FUNCTION get_user_profile_by_auth_id(auth_id UUID)
RETURNS TABLE (
    id INTEGER,
    auth_user_id UUID,
    username VARCHAR(50),
    full_name VARCHAR(100),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        up.id,
        up.auth_user_id,
        up.username,
        up.full_name,
        up.avatar_url,
        up.created_at,
        up.updated_at
    FROM user_profiles up
    WHERE up.auth_user_id = auth_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. 创建函数：更新用户资料
CREATE OR REPLACE FUNCTION update_user_profile(
    p_auth_user_id UUID,
    p_username VARCHAR(50) DEFAULT NULL,
    p_full_name VARCHAR(100) DEFAULT NULL,
    p_avatar_url TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    profile_exists BOOLEAN;
BEGIN
    -- 检查用户资料是否存在
    SELECT EXISTS(
        SELECT 1 FROM user_profiles 
        WHERE auth_user_id = p_auth_user_id
    ) INTO profile_exists;
    
    IF NOT profile_exists THEN
        -- 如果不存在，创建新资料
        INSERT INTO user_profiles (auth_user_id, username, full_name, avatar_url)
        VALUES (p_auth_user_id, p_username, p_full_name, p_avatar_url);
    ELSE
        -- 如果存在，更新资料
        UPDATE user_profiles 
        SET 
            username = COALESCE(p_username, username),
            full_name = COALESCE(p_full_name, full_name),
            avatar_url = COALESCE(p_avatar_url, avatar_url),
            updated_at = NOW()
        WHERE auth_user_id = p_auth_user_id;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. 更新邀请码验证函数，使用新的用户ID系统
CREATE OR REPLACE FUNCTION validate_and_use_invitation_code_v2(
    p_code VARCHAR(20),
    p_auth_user_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    v_invitation_id UUID;
    v_current_uses INTEGER;
    v_max_uses INTEGER;
    v_profile_id INTEGER;
BEGIN
    -- 获取用户资料ID
    SELECT id INTO v_profile_id
    FROM user_profiles
    WHERE auth_user_id = p_auth_user_id;
    
    -- 如果用户资料不存在，先创建
    IF v_profile_id IS NULL THEN
        INSERT INTO user_profiles (auth_user_id)
        VALUES (p_auth_user_id)
        RETURNING id INTO v_profile_id;
    END IF;
    
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
        used_by = CASE WHEN used_by IS NULL THEN p_auth_user_id ELSE used_by END,
        used_by_profile_id = CASE WHEN used_by_profile_id IS NULL THEN v_profile_id ELSE used_by_profile_id END,
        is_active = CASE WHEN (current_uses + 1) >= max_uses THEN FALSE ELSE is_active END
    WHERE id = v_invitation_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
