// deno-lint-ignore-file no-explicit-any
// Referral points are awarded only after the referred member verifies.
// award_referral_for_member is idempotent at the database level (referral_awards PK).
export async function awardReferralAfterVerify(supabase: any, memberId: string): Promise<void> {
  try {
    const { data, error } = await supabase.rpc("award_referral_for_member", { p_member_id: memberId });
    if (error) { console.error("award_referral_for_member error:", error.message); return; }
    const row: any = Array.isArray(data) ? data[0] : data;
    if (!row?.awarded || !row.referrer_email) return;

    const first = (s: string | null) => (s || "").split(" ")[0] || "there";
    const res = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-waitlist-email`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        template: "referral_joined",
        to: row.referrer_email,
        data: {
          name: first(row.referrer_name),
          first_name: first(row.referrer_name),
          referred_name: first(row.member_name),
          points: row.referrer_new_points,
        },
      }),
    });
    if (!res.ok) console.error("Failed to send referral notification:", res.status);
  } catch (e) {
    console.error("Referral award error:", (e as Error).message);
  }
}
