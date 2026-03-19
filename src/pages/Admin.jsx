import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { QUESTIONS } from "../data/questions";
import * as XLSX from "xlsx";
import { KPICard } from "../components/AdminDashboard/KPICard";
import { ProfilePieChart, SatisfactionChart, AreasChart, TimelineChart } from "../components/AdminDashboard/Charts";
import { AnalysisSections } from "../components/AdminDashboard/AnalysisSections";
import { ResponseTable } from "../components/AdminDashboard/ResponseTable";
import { 
  IconClipboard, IconPhone, IconStar, IconTrendingUp, IconUser, IconBriefcase,
  IconRefresh, IconDownload, IconChevronLeft
} from "../components/AdminDashboard/Icons";

const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD || "juspauta2026";

export default function Admin() {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  async function loadData() {
    setLoading(true);
    try {
      const q = query(collection(db, "respostas"), orderBy("enviado_em", "desc"));
      const snap = await getDocs(q);
      const items = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setData(items);
    } catch (err) {
      console.error("Erro ao carregar:", err);
    }
    setLoading(false);
  }

  function handleLogin(e) {
    e.preventDefault();
    if (pass === ADMIN_PASS) {
      setAuth(true);
      loadData();
    } else {
      alert("Senha incorreta");
    }
  }

  function exportExcel() {
    const rows = data.map((item) => {
      const row = {};
      QUESTIONS.forEach((q) => {
        const val = item[q.id];
        if (Array.isArray(val)) row[q.question] = val.join("; ");
        else if (q.type === "scale" && val) row[q.question] = `${val}/5`;
        else row[q.question] = val || "";
      });
      row["Nome"] = item.contato_nome || "";
      row["Contato"] = item.contato_info || "";
      row["Data"] = item.enviado_em?.toDate?.()
        ? item.enviado_em.toDate().toLocaleString("pt-BR")
        : "";
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Respostas");

    const colWidths = Object.keys(rows[0] || {}).map((key) => ({
      wch: Math.max(key.length, 20),
    }));
    ws["!cols"] = colWidths;

    XLSX.writeFile(wb, `JusPauta_Respostas_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  function formatAnswer(questionId, value) {
    if (!value) return "—";
    if (Array.isArray(value)) return value.join(", ");
    const q = QUESTIONS.find((qq) => qq.id === questionId);
    if (q?.type === "scale") return `${value}/5 (${q.labels[value - 1]})`;
    return value;
  }

  // ─── LOGIN ───
  if (!auth) {
    return (
      <div style={s.wrapper}>
        <div style={{ ...s.card, maxWidth: 380, textAlign: "center" }}>
          <h2 style={s.loginTitle}>Painel Admin</h2>
          <p style={s.loginSub}>JusPauta — Respostas da Pesquisa</p>
          <div style={{ marginTop: 24 }}>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin(e)}
              placeholder="Senha de acesso"
              style={s.input}
            />
            <button onClick={handleLogin} style={s.btn}>
              Entrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── DETAIL VIEW ───
  if (selected !== null) {
    const item = data[selected];
    return (
      <div style={s.wrapper}>
        <div style={{ ...s.card, maxWidth: 640 }}>
          <button onClick={() => setSelected(null)} style={s.backBtn}>
            ← Voltar para o dashboard
          </button>
          <h2 style={s.detailTitle}>
            Resposta #{selected + 1}
            {item.contato_nome && ` — ${item.contato_nome}`}
          </h2>
          <p style={s.detailDate}>
            {item.enviado_em?.toDate?.()
              ? item.enviado_em.toDate().toLocaleString("pt-BR")
              : "Data não registrada"}
          </p>
          <div style={s.divider} />
          {QUESTIONS.map((q) => {
            const val = item[q.id];
            if (!val || (Array.isArray(val) && val.length === 0)) return null;
            return (
              <div key={q.id} style={s.detailItem}>
                <p style={s.detailQuestion}>{q.question}</p>
                <p style={s.detailAnswer}>{formatAnswer(q.id, val)}</p>
              </div>
            );
          })}
          {(item.contato_nome || item.contato_info) && (
            <div style={s.detailItem}>
              <p style={s.detailQuestion}>Contato</p>
              <p style={s.detailAnswer}>
                {item.contato_nome || ""} {item.contato_info ? `— ${item.contato_info}` : ""}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── DASHBOARD VIEW ───
  return (
    <div style={s.wrapper}>
      <div style={s.dashboardContainer}>
        {/* Header */}
        <div style={s.dashboardHeader}>
          <div style={s.headerContent}>
            <h1 style={s.dashboardTitle}>Dashboard de Respostas</h1>
            <p style={s.dashboardSub}>Análise em tempo real da pesquisa JusPauta</p>
          </div>
          <div style={s.headerButtons}>
            <button onClick={loadData} style={s.refreshBtn} title="Atualizar dados">
              <IconRefresh size={16} color="currentColor" />
              <span style={s.btnText}>{loading ? "Atualizando..." : "Atualizar"}</span>
            </button>
            {data.length > 0 && (
              <button onClick={exportExcel} style={s.exportBtn} title="Exportar para Excel">
                <IconDownload size={16} color="currentColor" />
                <span style={s.btnText}>Exportar</span>
              </button>
            )}
          </div>
        </div>

        {data.length === 0 ? (
          <div style={{ ...s.emptyState }}>
            <p style={s.emptyText}>
              {loading ? "Carregando respostas..." : "Nenhuma resposta ainda. Compartilhe o link da pesquisa!"}
            </p>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <KPISection data={data} />

            {/* Charts Grid */}
            <ChartsSection data={data} />

            {/* Analysis Sections */}
            <AnalysisSections respostas={data} />

            {/* Responses Table */}
            <ResponseTable respostas={data} onSelectResponse={(resp) => {
              const index = data.findIndex(d => d.id === resp.id);
              setSelected(index);
            }} />
          </>
        )}
      </div>
    </div>
  );
}

function KPISection({ data }) {
  const totalRespostas = data.length;
  
  const respondentesComContato = data.filter(d => d.contato_info).length;
  const taxaContato = totalRespostas > 0 ? ((respondentesComContato / totalRespostas) * 100).toFixed(1) : 0;
  
  const satisfacoes = data.filter(d => d.satisfacao).map(d => d.satisfacao);
  const satisfacaoMedia = satisfacoes.length > 0 ? (satisfacoes.reduce((a, b) => a + b, 0) / satisfacoes.length).toFixed(1) : 0;
  
  const agora = new Date();
  const sete_dias_atras = new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000);
  const respostasUltimos7Dias = data.filter(d => {
    const dataEnvio = d.enviado_em?.toDate?.() || new Date(d.enviado_em);
    return dataEnvio >= sete_dias_atras;
  }).length;

  const perfisMap = {};
  data.forEach(d => {
    if (d.perfil) perfisMap[d.perfil] = (perfisMap[d.perfil] || 0) + 1;
  });
  const perfilMaisComum = Object.entries(perfisMap).sort(([, a], [, b]) => b - a)[0]?.[0] || '—';

  const areasMap = {};
  data.forEach(d => {
    if (d.area && Array.isArray(d.area)) {
      d.area.forEach(a => {
        areasMap[a] = (areasMap[a] || 0) + 1;
      });
    }
  });
  const areaMaisComum = Object.entries(areasMap).sort(([, a], [, b]) => b - a)[0]?.[0] || '—';

  return (
    <div style={s.kpiGrid}>
      <KPICard
        label="Total de Respostas"
        value={totalRespostas}
        icon={IconClipboard}
        color="#3b82f6"
      />
      <KPICard
        label="Taxa de Contato"
        value={`${taxaContato}%`}
        icon={IconPhone}
        color="#10b981"
        subtext={`${respondentesComContato} respondentes`}
      />
      <KPICard
        label="Satisfação Média"
        value={`${satisfacaoMedia}/5`}
        icon={IconStar}
        color="#f59e0b"
      />
      <KPICard
        label="Últimos 7 dias"
        value={respostasUltimos7Dias}
        icon={IconTrendingUp}
        color="#8b5cf6"
        subtext={`${((respostasUltimos7Dias / totalRespostas) * 100).toFixed(1)}% do total`}
      />
      <KPICard
        label="Perfil Mais Comum"
        value={perfilMaisComum}
        icon={IconUser}
        color="#ec4899"
      />
      <KPICard
        label="Área Mais Comum"
        value={areaMaisComum}
        icon={IconBriefcase}
        color="#06b6d4"
      />
    </div>
  );
}

function ChartsSection({ data }) {
  // Perfis chart
  const perfisMap = {};
  data.forEach(d => {
    if (d.perfil) perfisMap[d.perfil] = (perfisMap[d.perfil] || 0) + 1;
  });
  const perfisChartData = Object.entries(perfisMap).map(([name, value]) => ({ name, value }));

  // Satisfação por perfil
  const satisfacaoPorPerfil = {};
  const contsPorPerfil = {};
  data.forEach(d => {
    if (d.perfil && d.satisfacao) {
      if (!satisfacaoPorPerfil[d.perfil]) {
        satisfacaoPorPerfil[d.perfil] = 0;
        contsPorPerfil[d.perfil] = 0;
      }
      satisfacaoPorPerfil[d.perfil] += d.satisfacao;
      contsPorPerfil[d.perfil] += 1;
    }
  });
  const satisfacaoChartData = Object.entries(satisfacaoPorPerfil).map(([perfil, total]) => ({
    perfil,
    satisfacao: (total / contsPorPerfil[perfil]).toFixed(1)
  }));

  // Áreas chart (top 5)
  const areasMap = {};
  data.forEach(d => {
    if (d.area && Array.isArray(d.area)) {
      d.area.forEach(a => {
        areasMap[a] = (areasMap[a] || 0) + 1;
      });
    }
  });
  const areasChartData = Object.entries(areasMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([area, count]) => ({ area, count }));

  // Timeline chart
  const timelineMap = {};
  data.forEach(d => {
    const data_envio = d.enviado_em?.toDate?.() || new Date(d.enviado_em);
    const dataStr = data_envio.toLocaleDateString('pt-BR');
    timelineMap[dataStr] = (timelineMap[dataStr] || 0) + 1;
  });
  const timelineChartData = Object.entries(timelineMap)
    .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
    .map(([data, respostas]) => ({ data, respostas }));

  return (
    <div style={s.chartsGrid}>
      <div style={s.chartFull}>
        {perfisChartData.length > 0 && <ProfilePieChart data={perfisChartData} />}
      </div>
      <div style={s.chartFull}>
        {satisfacaoChartData.length > 0 && <SatisfactionChart data={satisfacaoChartData} />}
      </div>
      <div style={s.chartFull}>
        {areasChartData.length > 0 && <AreasChart data={areasChartData} />}
      </div>
      <div style={s.chartFull}>
        {timelineChartData.length > 0 && <TimelineChart data={timelineChartData} />}
      </div>
    </div>
  );
}

const s = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(165deg, #0f172a 0%, #1a1f35 40%, #0f172a 100%)",
    padding: "clamp(16px, 5%, 32px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  dashboardContainer: {
    width: "100%",
    maxWidth: "1400px",
  },
  dashboardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "clamp(20px, 5%, 32px)",
    flexWrap: "wrap",
    gap: "clamp(12px, 3%, 20px)",
  },
  headerContent: {
    minWidth: 0,
    flex: 1,
  },
  dashboardTitle: {
    margin: 0,
    fontSize: "clamp(24px, 6vw, 32px)",
    color: "#e2e8f0",
    fontWeight: "700",
  },
  dashboardSub: {
    margin: "8px 0 0 0",
    fontSize: "clamp(12px, 2.5vw, 14px)",
    color: "#94a3b8",
  },
  headerButtons: {
    display: "flex",
    gap: "clamp(8px, 2%, 12px)",
    flexWrap: "wrap",
  },
  refreshBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "clamp(8px, 2%, 10px) clamp(12px, 3%, 20px)",
    background: "#334155",
    border: "1px solid #475569",
    borderRadius: "8px",
    color: "#cbd5e1",
    fontSize: "clamp(11px, 2vw, 13px)",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  },
  exportBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "clamp(8px, 2%, 10px) clamp(12px, 3%, 20px)",
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "clamp(11px, 2vw, 13px)",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  },
  btnText: {
    display: 'block',
  },
  emptyState: {
    background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    border: "1px solid #334155",
    borderRadius: "12px",
    padding: "clamp(40px, 8%, 80px) clamp(20px, 5%, 40px)",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
  },
  emptyText: {
    fontSize: "clamp(14px, 3vw, 16px)",
    color: "#94a3b8",
    margin: 0,
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(clamp(160px, 30vw, 200px), 1fr))",
    gap: "clamp(12px, 3%, 16px)",
    marginBottom: "clamp(20px, 5%, 32px)",
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(clamp(280px, 45vw, 400px), 1fr))",
    gap: "clamp(16px, 3%, 20px)",
    marginBottom: "clamp(20px, 5%, 32px)",
  },
  chartFull: {
    width: "100%",
  },
  card: {
    background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    borderRadius: 16,
    border: "1px solid #334155",
    padding: "clamp(20px, 4%, 28px) clamp(16px, 4%, 24px)",
    width: "100%",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
  },
  loginTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(24px, 5vw, 28px)",
    color: "#e2e8f0",
    fontWeight: 400,
    marginBottom: 4,
  },
  loginSub: { 
    color: "#94a3b8", 
    fontSize: "clamp(12px, 2.5vw, 13px)", 
    marginBottom: 8 
  },
  input: {
    width: "100%",
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: 10,
    padding: "clamp(10px, 2%, 12px) clamp(12px, 3%, 16px)",
    color: "#e2e8f0",
    fontSize: "clamp(12px, 2.5vw, 14px)",
    fontFamily: "var(--font-body)",
    boxSizing: "border-box",
    marginBottom: 12,
  },
  btn: {
    width: "100%",
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    border: "none",
    borderRadius: 10,
    padding: "clamp(10px, 2%, 12px)",
    color: "#fff",
    fontSize: "clamp(12px, 2.5vw, 14px)",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "var(--font-body)",
  },
  backBtn: {
    background: "transparent",
    border: "1px solid #334155",
    borderRadius: 8,
    padding: "clamp(6px, 2%, 8px) clamp(12px, 3%, 16px)",
    color: "#94a3b8",
    fontSize: "clamp(11px, 2vw, 13px)",
    cursor: "pointer",
    fontFamily: "var(--font-body)",
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: "clamp(18px, 4vw, 22px)",
    color: "#e2e8f0",
    fontWeight: 600,
    marginBottom: 4,
  },
  detailDate: { 
    fontSize: "clamp(10px, 2vw, 12px)", 
    color: "#94a3b8", 
    marginBottom: 4 
  },
  divider: {
    height: 1,
    background: "#334155",
    margin: "16px 0",
  },
  detailItem: { marginBottom: 18 },
  detailQuestion: { 
    fontSize: "clamp(12px, 2vw, 13px)", 
    fontWeight: 600, 
    color: "#cbd5e1", 
    marginBottom: 4 
  },
  detailAnswer: { 
    fontSize: "clamp(12px, 2vw, 13px)", 
    color: "#94a3b8", 
    lineHeight: 1.5 
  },
};
