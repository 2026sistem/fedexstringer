import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://oxlbxakijmahmrcimalp.supabase.co'
const SUPABASE_KEY = 'sb_publishable_6mmlU1skEpwf0M60noXNMA_vQ60j3BW'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
