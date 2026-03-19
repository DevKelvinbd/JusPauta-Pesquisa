import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { QUESTIONS } from "../data/questions";

const TOTAL = QUESTIONS.length;

export default function Survey() {
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  const q = QUESTIONS[current];

  function selectSingle(val) {
    setAnswers((a) => ({ ...a, [q.id]: val }));
  }
  function toggleMulti(val) {
    const prev = answers[q.id] || [];
    if (prev.includes(val)) {
      setAnswers((a) => ({ ...a, [q.id]: prev.filter((v) => v !== val) }));
    } else {
      if (q.max && prev.length >= q.max) return;
      setAnswers((a) => ({ ...a, [q.id]: [...prev, val] }));
    }
  }
  function selectScale(val) {
    setAnswers((a) => ({ ...a, [q.id]: val }));
  }
  function setText(val) {
    setAnswers((a) => ({ ...a, [q.id]: val }));
  }

  function canAdvance() {
    if (q.type === "contact" || q.type === "text") return true;
    if (!answers[q.id]) return false;
    if (Array.isArray(answers[q.id]) && answers[q.id].length === 0) return false;
    return true;
  }

  async function next() {
    if (current < TOTAL - 1) setCurrent((c) => c + 1);
    else await handleSubmit();
  }
  function prev() {
    if (current > 0) setCurrent((c) => c - 1);
  }

  async function handleSubmit() {
    setSending(true);
    const payload = {
      ...answers,
      contato_nome: contactName || null,
      contato_info: contactInfo || null,
      enviado_em: serverTimestamp(),
      user_agent: navigator.userAgent,
    };

    try {
      await addDoc(collection(db, "respostas"), payload);
    } catch (err) {
      console.error("Erro ao salvar:", err);
      // Salva localmente como fallback
      const saved = JSON.parse(localStorage.getItem("juspauta_respostas") || "[]");
      saved.push({ ...payload, enviado_em: new Date().toISOString() });
      localStorage.setItem("juspauta_respostas", JSON.stringify(saved));
    }

    setSending(false);
    setSubmitted(true);
  }

  // ─── THANK YOU SCREEN ───
  if (submitted) {
    return (
      <div style={styles.wrapper}>
        <div style={{ ...styles.card, textAlign: "center", padding: "56px 40px" }}>
          <div style={{ fontSize: 48, marginBottom: 16, filter: "grayscale(0.2)" }}>✓</div>
          <h2 style={styles.thankTitle}>Obrigado pela sua participação!</h2>
          <p style={styles.thankText}>
            Suas respostas vão ajudar a construir uma ferramenta feita de verdade
            para quem vive a advocacia no dia a dia.
          </p>
          <div style={styles.thankDivider} />
          <p style={styles.thankSmall}>
            Se deixou seu contato, entraremos em breve com novidades.
          </p>
        </div>
      </div>
    );
  }

  // ─── MAIN FORM ───
  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <div style={styles.header}>
        <p style={styles.headerTag}>Pesquisa de Validação</p>
        <h1 style={styles.headerTitle}>JusPauta</h1>
        <p style={styles.headerSub}>
          Queremos entender suas dores reais para criar algo que faça diferença
          no seu dia a dia.
        </p>
      </div>

      {/* Progress */}
      <div style={styles.progressWrap}>
        <div style={styles.progressLabels}>
          <span style={styles.progressText}>Pergunta {current + 1} de {TOTAL}</span>
          <span style={styles.progressText}>{Math.round(((current + 1) / TOTAL) * 100)}%</span>
        </div>
        <div style={styles.progressTrack}>
          <div style={{
            ...styles.progressBar,
            width: `${((current + 1) / TOTAL) * 100}%`,
          }} />
        </div>
      </div>

      {/* Card */}
      <div style={styles.card}>
        {q.section && (
          <div style={styles.sectionBadge}>
            <span style={{ fontSize: 14 }}>{q.sectionIcon}</span>
            <span style={styles.sectionText}>{q.section}</span>
          </div>
        )}

        <h2 style={styles.question}>{q.question}</h2>
        {q.subtitle && <p style={styles.subtitle}>{q.subtitle}</p>}

        {/* SINGLE SELECT */}
        {q.type === "single" && (
          <div style={styles.optionsCol}>
            {q.options.map((opt) => {
              const sel = answers[q.id] === opt;
              return (
                <button key={opt} onClick={() => selectSingle(opt)}
                  style={{ ...styles.optionBtn, ...(sel ? styles.optionSel : {}) }}>
                  <div style={{ ...styles.radio, ...(sel ? styles.radioSel : {}) }}>
                    {sel && <div style={styles.radioDot} />}
                  </div>
                  <span style={styles.optionText}>{opt}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* MULTI SELECT */}
        {q.type === "multi" && (
          <div style={styles.optionsCol}>
            {q.options.map((opt) => {
              const arr = answers[q.id] || [];
              const sel = arr.includes(opt);
              const disabled = q.max && arr.length >= q.max && !sel;
              return (
                <button key={opt} onClick={() => !disabled && toggleMulti(opt)}
                  style={{
                    ...styles.optionBtn,
                    ...(sel ? styles.optionSel : {}),
                    ...(disabled ? styles.optionDisabled : {}),
                  }}>
                  <div style={{ ...styles.checkbox, ...(sel ? styles.checkboxSel : {}) }}>
                    {sel && <span style={styles.checkMark}>✓</span>}
                  </div>
                  <span style={styles.optionText}>{opt}</span>
                </button>
              );
            })}
            {q.max && (
              <p style={styles.maxLabel}>
                {(answers[q.id] || []).length}/{q.max} selecionadas
              </p>
            )}
          </div>
        )}

        {/* SCALE */}
        {q.type === "scale" && (
          <div style={styles.scaleWrap}>
            {[1, 2, 3, 4, 5].map((n) => {
              const sel = answers[q.id] === n;
              return (
                <button key={n} onClick={() => selectScale(n)}
                  style={{ ...styles.scaleBtn, ...(sel ? styles.scaleSel : {}) }}>
                  <span style={{ ...styles.scaleNum, color: sel ? "var(--accent)" : "var(--light)" }}>{n}</span>
                  <span style={styles.scaleLabel}>{q.labels[n - 1]}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* TEXT */}
        {q.type === "text" && (
          <textarea
            value={answers[q.id] || ""}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escreva aqui sua resposta..."
            rows={4}
            style={styles.textarea}
          />
        )}

        {/* CONTACT */}
        {q.type === "contact" && (
          <div style={styles.contactFields}>
            <input value={contactName} onChange={(e) => setContactName(e.target.value)}
              placeholder="Seu nome" style={styles.input} />
            <input value={contactInfo} onChange={(e) => setContactInfo(e.target.value)}
              placeholder="E-mail ou WhatsApp" style={styles.input} />
          </div>
        )}

        {/* NAV */}
        <div style={styles.nav}>
          <button onClick={prev} disabled={current === 0}
            style={{ ...styles.navBack, ...(current === 0 ? { opacity: 0, pointerEvents: "none" } : {}) }}>
            ← Voltar
          </button>
          <button onClick={next}
            disabled={!canAdvance() && q.type !== "text" && q.type !== "contact"}
            style={{
              ...styles.navNext,
              ...(canAdvance() || q.type === "text" || q.type === "contact"
                ? {} : styles.navNextDisabled),
            }}>
            {sending ? "Enviando..." : current === TOTAL - 1 ? "Enviar Respostas" : "Próxima →"}
          </button>
        </div>
      </div>

      {/* Footer */}
      <p style={styles.footer}>
        JusPauta © 2026 — Pesquisa confidencial
      </p>
    </div>
  );
}

// ─── STYLES ───
const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(165deg, var(--dark) 0%, var(--dark2) 40%, var(--dark) 100%)",
    padding: "32px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    textAlign: "center",
    marginBottom: 28,
    maxWidth: 560,
    width: "100%",
  },
  headerTag: {
    color: "var(--accent)",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  headerTitle: {
    fontFamily: "var(--font-display)",
    fontSize: 42,
    color: "var(--accent-light)",
    fontWeight: 400,
    marginBottom: 8,
    fontStyle: "italic",
  },
  headerSub: {
    color: "var(--muted)",
    fontSize: 14,
    lineHeight: 1.6,
  },
  progressWrap: {
    maxWidth: 560,
    width: "100%",
    marginBottom: 24,
  },
  progressLabels: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  progressText: {
    fontSize: 11,
    color: "var(--muted)",
    fontWeight: 500,
  },
  progressTrack: {
    height: 3,
    background: "var(--surface-light)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    background: "linear-gradient(90deg, var(--accent), var(--accent-light))",
    borderRadius: 3,
    transition: "width 0.4s ease",
  },
  card: {
    maxWidth: 560,
    width: "100%",
    background: "var(--surface)",
    borderRadius: 20,
    border: "1px solid var(--surface-light)",
    padding: "36px 32px",
    boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
  },
  sectionBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "var(--dark)",
    borderRadius: 8,
    padding: "6px 14px",
    marginBottom: 20,
    border: "1px solid var(--surface-light)",
  },
  sectionText: {
    fontSize: 11,
    fontWeight: 700,
    color: "var(--accent)",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  question: {
    fontFamily: "var(--font-display)",
    fontSize: 22,
    fontWeight: 500,
    color: "var(--accent-light)",
    marginBottom: 8,
    lineHeight: 1.35,
    letterSpacing: 0.1,
  },
  subtitle: {
    color: "var(--muted)",
    fontSize: 13,
    marginBottom: 22,
  },
  optionsCol: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  optionBtn: {
    background: "transparent",
    border: "1px solid var(--surface-light)",
    borderRadius: 12,
    padding: "14px 16px",
    textAlign: "left",
    color: "var(--light)",
    cursor: "pointer",
    fontFamily: "var(--font-body)",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  optionSel: {
    background: "rgba(194, 149, 106, 0.1)",
    borderColor: "var(--accent)",
  },
  optionDisabled: {
    opacity: 0.4,
    cursor: "not-allowed",
  },
  optionText: {
    fontSize: 14,
    lineHeight: 1.4,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: "50%",
    border: "2px solid var(--muted)",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
  },
  radioSel: {
    borderColor: "var(--accent)",
    background: "var(--accent)",
  },
  radioDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "var(--dark)",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    border: "2px solid var(--muted)",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
  },
  checkboxSel: {
    borderColor: "var(--accent)",
    background: "var(--accent)",
  },
  checkMark: {
    color: "var(--dark)",
    fontSize: 11,
    fontWeight: 800,
    lineHeight: 1,
  },
  maxLabel: {
    color: "var(--muted)",
    fontSize: 12,
    marginTop: 4,
  },
  scaleWrap: {
    display: "flex",
    gap: 8,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  scaleBtn: {
    width: 80,
    padding: "14px 8px",
    borderRadius: 14,
    border: "2px solid var(--surface-light)",
    background: "transparent",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    transition: "all 0.2s",
    fontFamily: "var(--font-body)",
  },
  scaleSel: {
    borderColor: "var(--accent)",
    background: "rgba(194, 149, 106, 0.12)",
  },
  scaleNum: {
    fontSize: 22,
    fontWeight: 700,
  },
  scaleLabel: {
    fontSize: 9,
    color: "var(--muted)",
    textAlign: "center",
    lineHeight: 1.2,
  },
  textarea: {
    width: "100%",
    background: "var(--dark)",
    border: "1px solid var(--surface-light)",
    borderRadius: 12,
    padding: 16,
    color: "var(--light)",
    fontSize: 14,
    fontFamily: "var(--font-body)",
    resize: "vertical",
    boxSizing: "border-box",
    lineHeight: 1.6,
  },
  contactFields: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  input: {
    width: "100%",
    background: "var(--dark)",
    border: "1px solid var(--surface-light)",
    borderRadius: 12,
    padding: "14px 16px",
    color: "var(--light)",
    fontSize: 14,
    fontFamily: "var(--font-body)",
    boxSizing: "border-box",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 28,
    paddingTop: 20,
    borderTop: "1px solid var(--surface-light)",
  },
  navBack: {
    background: "transparent",
    border: "1px solid var(--surface-light)",
    borderRadius: 10,
    padding: "10px 20px",
    color: "var(--muted)",
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "var(--font-body)",
    transition: "all 0.2s",
  },
  navNext: {
    background: "linear-gradient(135deg, var(--accent), #a07850)",
    border: "none",
    borderRadius: 10,
    padding: "12px 28px",
    color: "var(--dark)",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "var(--font-body)",
    transition: "all 0.3s",
  },
  navNextDisabled: {
    background: "var(--surface-light)",
    color: "var(--muted)",
    cursor: "not-allowed",
  },
  footer: {
    color: "rgba(100,116,139,0.5)",
    fontSize: 11,
    marginTop: 24,
    textAlign: "center",
  },
  thankTitle: {
    fontFamily: "var(--font-display)",
    fontSize: 30,
    color: "var(--accent)",
    marginBottom: 12,
    fontWeight: 400,
  },
  thankText: {
    color: "var(--muted)",
    fontSize: 15,
    lineHeight: 1.6,
    marginBottom: 24,
  },
  thankDivider: {
    width: 48,
    height: 2,
    background: "var(--surface-light)",
    margin: "0 auto 20px",
    borderRadius: 2,
  },
  thankSmall: {
    color: "var(--muted)",
    fontSize: 13,
    opacity: 0.7,
  },
};
