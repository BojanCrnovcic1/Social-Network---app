import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KAY = process.env.SUPABASE_KAY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KAY);