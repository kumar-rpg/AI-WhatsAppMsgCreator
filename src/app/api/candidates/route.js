import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { ALL_STAGES } from "@/lib/messageBuilder";

export async function GET() {
  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("candidates")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ candidates: data });
}

export async function POST(request) {
  const body = await request.json();
  const { name, position, track, stage } = body;

  if (!name || !position) {
    return NextResponse.json(
      { error: "name and position are required." },
      { status: 400 }
    );
  }

  const finalTrack = track === "Internship" ? "Internship" : "Employment";
  const finalStage = ALL_STAGES.includes(stage) ? stage : "Applied";

  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("candidates")
    .insert({ name, position, track: finalTrack, stage: finalStage })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ candidate: data }, { status: 201 });
}
