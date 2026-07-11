
const SUPABASE_URL = "https://aesjzhjfnkmxdvivjaqy.supabase.co";
const SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlc2p6aGpmbmtteGR2aXZqYXF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MTU5MzUsImV4cCI6MjA4Njk5MTkzNX0.ttXhdM1XU_VVQPDdtDEumawzgXqlo-JQtbT1WUO7G1E"

const supabaseClient = (typeof supabase !== 'undefined')
    ? supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
    : null;
window.supabaseClient = supabaseClient;