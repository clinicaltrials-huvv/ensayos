import { supabase } from "../lib/supabaseClient";
import TrialsTableClient from "./TrialsTableClient";

export const revalidate = 60;

export default async function Home() {
  const { data: trials, error } = await supabase
    .from("trials")
    .select("id, name, tumor_type, prior_lines, status, molecule_type, characteristics, slots_available, phase, link")
    .order("name", { ascending: true });

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: 24, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Ensayos clínicos</h1>

      <p style={{ marginTop: 0, color: "#444" }}>
        Filtra por tipo tumoral o busca rápidamente.
      </p>

      {error ? (
        <div style={{ padding: 12, border: "1px solid #f3c", borderRadius: 8, marginTop: 16 }}>
          <strong>Error leyendo Supabase:</strong>
          <div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>{error.message}</div>
        </div>
      ) : (
        <TrialsTableClient trials={trials || []} />
      )}
    </main>
  );
}
