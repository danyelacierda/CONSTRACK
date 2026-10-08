import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, serviceKey!);

async function run() {
  await supabase.from("vehicles").update({ photo_url: "/images/vehicles/isuzu_giga.jpg" }).eq("id", "veh-001");
  await supabase.from("vehicles").update({ photo_url: "/images/vehicles/hino_700.jpg" }).eq("id", "veh-002");
  await supabase.from("vehicles").update({ photo_url: "/images/vehicles/fuso_super_great.jpg" }).eq("id", "veh-003");
  await supabase.from("vehicles").update({ photo_url: "/images/vehicles/isuzu_forward.jpg" }).eq("id", "veh-004");
  console.log("Done");
}

run();
