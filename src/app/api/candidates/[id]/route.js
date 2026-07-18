import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { ALL_STAGES } from "@/lib/messageBuilder";

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const { stage } = body;

  if (!ALL_STAGES.includes(stage)) {
    return NextResponse.json({ error: "Invalid stage." }, { status: 400 });
  }

  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("candidates")
    .update({ stage, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ candidate: data });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const supabase = supabaseAdmin();
  const { error } = await supabase.from("candidates").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
