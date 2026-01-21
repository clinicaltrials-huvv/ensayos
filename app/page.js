import { supabase } from "../lib/supabaseClient";

export const revalidate = 60; // refresca cada 60s en Vercel

export default async function Home() {
  const { data: trials, error } = await supabase
    .from("trials")
    .select("id, title, tumor, phase, treatment_type, lines_prior, status, external_url")
    .order("title", { ascending: true });

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 24, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Ensayos clínicos</h1>
      <p style={{ marginTop: 0, color: "#444" }}>
        Listado público con filtros (fase 1). Próximo: búsqueda y filtros avanzados.
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
              {["Ensayo", "Tumor", "Fase", "Tratamiento", "Líneas previas", "Estado", "Enlace"].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                    padding: "10px 8px",
                    fontSize: 13,
                    color: "#333",
                    whiteSpace: "nowrap"
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(trials || []).map((t) => (
              <tr key={t.id}>
                <td style={{ padding: "10px 8px", borderBottom: "1px solid #eee" }}>{t.title || "-"}</td>
                <td style={{ padding: "10px 8px", borderBottom: "1px solid #eee" }}>{t.tumor || "-"}</td>
                <td style={{ padding: "10px 8px", borderBottom: "1px solid #eee" }}>{t.phase || "-"}</td>
                <td style={{ padding: "10px 8px", borderBottom: "1px solid #eee" }}>{t.treatment_type || "-"}</td>
                <td style={{ padding: "10px 8px", borderBottom: "1px solid #eee" }}>{t.lines_prior ?? "-"}</td>
                <td style={{ padding: "10px 8px", borderBottom: "1px solid #eee" }}>{t.status || "-"}</td>
                <td style={{ padding: "10px 8px", borderBottom: "1px solid #eee" }}>
                  {t.external_url ? (
                    <a href={t.external_url} target="_blank" rel="noreferrer">
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
                <td colSpan={7} style={{ padding: "12px 8px", color: "#555" }}>
                  No hay ensayos todavía en la tabla <code>trials</code>.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
