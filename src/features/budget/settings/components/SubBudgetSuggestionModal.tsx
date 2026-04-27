import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";

type CategoryMeta = {
  id: number;
  name: string;
  color: string;
};

type ExistingSubBudget = {
  category_id: number;
};

type SubBudgetSuggestionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  month: string;
  categories: CategoryMeta[];
  existingSubBudgets: ExistingSubBudget[];
  onCreateMany: (items: { category_id: number; amount: number }[]) => void;
};

export function SubBudgetSuggestionModal({
  isOpen,
  onClose,
  month,
  categories,
  existingSubBudgets,
  onCreateMany,
}: SubBudgetSuggestionModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const existingIds = useMemo(
    () => new Set(existingSubBudgets.map((sb) => sb.category_id)),
    [existingSubBudgets],
  );

  const missing = useMemo(
    () => categories.filter((c) => !existingIds.has(c.id)),
    [categories, existingIds],
  );

  const [selected, setSelected] = useState<number[]>([]);

  function selectAll() {
    setSelected(missing.map((c) => c.id));
  }

  function deselectAll() {
    setSelected([]);
  }

  function toggle(id: number) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function handleConfirm() {
    const items = selected.map((id) => ({
      category_id: id,
      amount: 0,
    }));

    onCreateMany(items);
    onClose();
  }

  if (!mounted || !isOpen) {
    return null;
  }

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "500px",
          width: "90%",
          backgroundColor: "#1a202c",
          border: "1px solid #2d3748",
          borderRadius: "12px",
          padding: "24px",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)",
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#f1f5f9",
            marginBottom: "16px",
          }}
        >
          Slimme categorie‑suggesties
        </h2>

        {missing.length === 0 && (
          <p style={{ color: "#a0aec0", fontSize: "14px" }}>
            Er zijn geen categorie‑suggesties beschikbaar.
          </p>
        )}

        {missing.length > 0 && (
          <>
            {/* HEADER */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <p style={{ color: "#a0aec0", fontSize: "14px" }}>
                {selected.length} van {missing.length} geselecteerd
              </p>

              <div style={{ display: "flex", gap: "8px" }}>
                {/* SELECT ALL */}
                <button
                  onClick={selectAll}
                  style={{
                    padding: "6px 12px",
                    fontSize: "12px",
                    borderRadius: "6px",
                    backgroundColor: "#1e293b",
                    color: "#e2e8f0",
                    border: "1px solid #2EE9D1",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#334155")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#1e293b")
                  }
                >
                  Alles selecteren
                </button>

                {/* DESELECT ALL */}
                <button
                  onClick={deselectAll}
                  style={{
                    padding: "6px 12px",
                    fontSize: "12px",
                    borderRadius: "6px",
                    backgroundColor: "#1e293b",
                    color: "#e2e8f0",
                    border: "1px solid #2EE9D1",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#334155")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#1e293b")
                  }
                >
                  Alles deselecteren
                </button>
              </div>
            </div>

            {/* LIST */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                maxHeight: "256px",
                overflowY: "auto",
                paddingRight: "4px",
              }}
            >
              {missing.map((cat) => (
                <label
                  key={cat.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "8px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#2d3748")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(cat.id)}
                    onChange={() => toggle(cat.id)}
                    style={{
                      width: "16px",
                      height: "16px",
                      accentColor: "#2EE9D1", // AQUA
                      cursor: "pointer",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: cat.color,
                      }}
                    />
                    <span style={{ color: "#e2e8f0", fontSize: "14px" }}>
                      {cat.name}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </>
        )}

        {/* FOOTER */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            marginTop: "24px",
          }}
        >
          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            style={{
              padding: "10px 16px",
              borderRadius: "6px",
              backgroundColor: "#1e293b",
              color: "#e2e8f0",
              border: "1px solid #2EE9D1",
              cursor: "pointer",
              fontWeight: "500",
              fontSize: "14px",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#334155")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#1e293b")
            }
          >
            Sluiten
          </button>

          {/* CONFIRM BUTTON */}
          {missing.length > 0 && (
            <button
              onClick={handleConfirm}
              disabled={selected.length === 0}
              style={{
                padding: "10px 16px",
                borderRadius: "6px",
                backgroundColor: "#2EE9D1", // AQUA
                color: "#0A0F1A",
                border: "1px solid #00C4E6",
                cursor: selected.length === 0 ? "not-allowed" : "pointer",
                fontWeight: "600",
                fontSize: "14px",
                opacity: selected.length === 0 ? 0.4 : 1,
              }}
              onMouseEnter={(e) => {
                if (selected.length > 0) {
                  e.currentTarget.style.backgroundColor = "#5FF3E0"; // lighter aqua
                }
              }}
              onMouseLeave={(e) => {
                if (selected.length > 0) {
                  e.currentTarget.style.backgroundColor = "#2EE9D1";
                }
              }}
            >
              {selected.length > 0
                ? `${selected.length} Toevoegen`
                : "Toevoegen"}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
