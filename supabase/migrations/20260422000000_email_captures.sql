-- Capture emails at the entry point of the assessment, even if the user
-- doesn't complete the full flow. Lets us follow up with drop-offs.
CREATE TABLE public.email_captures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  referrer TEXT,
  user_agent TEXT,
  completed_assessment BOOLEAN NOT NULL DEFAULT false,
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE SET NULL
);

CREATE INDEX idx_email_captures_email ON public.email_captures(email);
CREATE INDEX idx_email_captures_captured_at ON public.email_captures(captured_at DESC);
CREATE INDEX idx_email_captures_completed ON public.email_captures(completed_assessment);

ALTER TABLE public.email_captures ENABLE ROW LEVEL SECURITY;

-- Anyone (including anon) can insert their own email capture
CREATE POLICY "Anyone can insert email capture"
  ON public.email_captures
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow updates so we can mark completed_assessment=true and link assessment_id
CREATE POLICY "Anyone can update email capture"
  ON public.email_captures
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated users can read (for admin views)
CREATE POLICY "Authenticated can read email captures"
  ON public.email_captures
  FOR SELECT
  TO authenticated
  USING (true);
