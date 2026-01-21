import { supabase } from "../lib/supabaseClient";

export const revalidate = 60;

export default async function Home() {
  const { data: trials, error } = await supabase
    .from("trials")
    .select(`
      id,
      name,
      tumor_type,
      prior_lines,
      status,
      molecule_type,
      characteristics,
      slots_available,
      phase,
      link
    `)
    .order("name", { ascending: true });

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: 24, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Ensayos clínicos</h1>
      <p style={{ marginTop: 0, color: "#444" }}>
        Listado público de ensayos disponibles.
      </p>

      {error && (
        <div style={{ padding: 12, border: "1px solid #f3c", borderRadius: 8, marginTop: 16 }}>
          <strong>Error leyendo Supabase:</strong>
          <div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>{error.message}</div>
        </div>
      )}

      <div style={{ marginTop: 16, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Ensayo</th>
              <th>Tipo tumoral</th>
              <th>Fase</th>
              <th>Tipo de molécula</th>
              <th>Líneas previas</th>
              <th>Estado</th>
              <th>Slots</th>
              <th>Enlace</th>
            </tr>
          </thead>
          <tbody>
            {(trials || []).map((t) => (
              <tr key={t.id}>
                <td>{t.name || "-"}</td>
                <td>{t.tumor_type || "-"}</td>
                <td>{t.phase || "-"}</td>
                <td>{t.molecule_type || "-"}</td>
                <td>{t.prior_lines ?? "-"}</td>
                <td>{t.status || "-"}</td>
                <td>{t.slots_available ? "Sí" : "No"}</td>
                <td>
                  {t.link ? (
                    <a href={t.link} target="_blank" rel="noreferrer">
                      Ver
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
            {!error && (trials || []).length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: "12px 8px", color: "#555" }}>
                  No hay ensayos todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
