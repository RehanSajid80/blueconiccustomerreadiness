-- ============================================================================
-- Chat with Memory: Tables for AI chat with persistent memory integration
-- Run on: CI Agent Supabase project (tnwvhrahujolkmergfxa)
-- ============================================================================

-- Chat sessions
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_identifier TEXT,
  title TEXT DEFAULT 'New conversation',
  memory_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat messages with memory tracking
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  memory_ids_used TEXT[] DEFAULT '{}',
  memories_stored INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id, created_at);

-- Chat feedback for quality tracking
CREATE TABLE IF NOT EXISTS chat_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
  rating TEXT CHECK (rating IN ('helpful', 'not_helpful')),
  feedback_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies (open for now - single tenant)
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for chat_sessions" ON chat_sessions FOR ALL USING (true);
CREATE POLICY "Allow all for chat_messages" ON chat_messages FOR ALL USING (true);
CREATE POLICY "Allow all for chat_feedback" ON chat_feedback FOR ALL USING (true);
