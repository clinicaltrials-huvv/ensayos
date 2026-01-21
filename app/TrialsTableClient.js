"use client";

import { useMemo, useState } from "react";

export default function TrialsTableClient({ trials }) {
  const [tumorFilter, setTumorFilter] = useState("ALL");
  const [q, setQ] = useState("");

  const tumorOptions = useMemo(() => {
    const set = new Set();
    (trials || []).forEach((t) => {
      if (t.tumor_type) set.add(t.tumor_type);
    });
    return ["ALL", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [trials]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return (trials || []).filter((t) => {
      const tumorOk = tumorFilter === "ALL" ? true : t.tumor_type === tumorFilter;

      if (!query) return tumorOk;

      const haystack = [
        t.name,
        t.tumor_type,
        t.phase,
        t.molecule_type,
        t.characteristics,
        t.link
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return tumorOk && haystack.includes(query);
    });
  }, [trials, tumorFilter, q]);

  return (
    <div style={{ marginTop: 16 }}>
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: 12
        }}
      >
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 12, color: "#444" }}>Tipo tumoral</span>
          <select
            value={tumorFilter}
            onChange={(e) => setTumorFilter(e.target.value)}
            style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #ddd" }}
          >
            {tumorOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt === "ALL" ? "Todos" : opt}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: 220 }}>
          <span style={{ fontSize: 12, color: "#444" }}>Buscar</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Nombre, fase, molécula, características…"
            style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #ddd", width: "100%" }}
          />
        </label>

        <div style={{ marginLeft: "auto", fontSize: 12, color: "#444" }}>
          Mostrando <strong>{filtered.length}</strong> de <strong>{(trials || []).length}</strong>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>Ensayo</th>
              <th style={th}>Tipo tumoral</th>
              <th style={th}>Fase</th>
              <th style={th}>Tipo de molécula</th>
              <th style={th}>Líneas previas</th>
              <th style={th}>Estado</th>
              <th style={th}>Slots</th>
              <th style={th}>Enlace</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id}>
                <td style={td}>{t.name || "-"}</td>
                <td style={td}>{t.tumor_type || "-"}</td>
                <td style={td}>{t.phase || "-"}</td>
                <td style={td}>{t.molecule_type || "-"}</td>
                <td style={td}>{t.prior_lines ?? "-"}</td>
                <td style={td}>{t.status === true ? "Activo" : "No activo"}</td>
                <td style={td}>{t.slots_available || "-"}</td>
                <td style={td}>
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

            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: "12px 8px", color: "#555" }}>
                  No hay ensayos que coincidan con el filtro/búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const th = {
  textAlign: "left",
  borderBottom: "1px solid #ddd",
  padding: "10px 8px",
  fontSize: 13,
  color: "#333",
  whiteSpace: "nowrap"
};

const td = {
  padding: "10px 8px",
  borderBottom: "1px solid #eee",
  verticalAlign: "top"
};
