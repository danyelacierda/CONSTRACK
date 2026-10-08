import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, serviceKey!);

async function run() {
  await supabase.from("equipment").update({ photo_url: "/images/equipment/komatsu_pc200.jpg" }).eq("id", "eq-001");
  await supabase.from("equipment").update({ photo_url: "/images/equipment/cat_428f.jpg" }).eq("id", "eq-002");
  await supabase.from("equipment").update({ photo_url: "/images/equipment/sdlg_l956f.jpg" }).eq("id", "eq-003");
  console.log("Done equipment update");
}

run();
