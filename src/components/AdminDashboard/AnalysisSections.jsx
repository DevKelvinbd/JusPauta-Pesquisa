export function AnalysisSections({ respostas }) {
  // Top 5 Dores
  const doresMap = {};
  respostas.forEach(resp => {
    if (resp.dores && Array.isArray(resp.dores)) {
      resp.dores.forEach(dor => {
        doresMap[dor] = (doresMap[dor] || 0) + 1;
      });
    }
  });
  const topDores = Object.entries(doresMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([dor, count]) => ({ dor, count }));

  // Top 5 Ferramentas
  const ferramentasMap = {};
  respostas.forEach(resp => {
    if (resp.ferramentas && Array.isArray(resp.ferramentas)) {
      resp.ferramentas.forEach(ferr => {
        ferramentasMap[ferr] = (ferramentasMap[ferr] || 0) + 1;
      });
    }
  });
  const topFerramentas = Object.entries(ferramentasMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([ferramenta, count]) => ({ ferramenta, count }));

  // Top 5 Funcionalidades
  const funcionalidadesMap = {};
  respostas.forEach(resp => {
    if (resp.funcionalidades && Array.isArray(resp.funcionalidades)) {
      resp.funcionalidades.forEach(func => {
        funcionalidadesMap[func] = (funcionalidadesMap[func] || 0) + 1;
      });
    }
  });
  const topFuncionalidades = Object.entries(funcionalidadesMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([funcionalidade, count]) => ({ funcionalidade, count }));

  // Disposição de pagamento
  const pagamentoMap = {};
  respostas.forEach(resp => {
    if (resp.pagamento) {
      pagamentoMap[resp.pagamento] = (pagamentoMap[resp.pagamento] || 0) + 1;
    }
  });

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        <AnalysisBox title="Top 5 Dores Principais" items={topDores} dataKey="dor" />
        <AnalysisBox title="Top 5 Ferramentas" items={topFerramentas} dataKey="ferramenta" />
        <AnalysisBox title="Top 5 Funcionalidades" items={topFuncionalidades} dataKey="funcionalidade" />
        <PaymentBox title="Disposição de Pagamento" data={pagamentoMap} />
      </div>
    </div>
  );
}

function AnalysisBox({ title, items, dataKey }) {
  return (
    <div style={styles.analysisBox}>
      <h3 style={styles.analysisTitle}>{title}</h3>
      <div style={styles.list}>
        {items.length > 0 ? (
          items.map((item, idx) => (
            <div key={idx} style={styles.listItem}>
              <span style={styles.rank}>#{idx + 1}</span>
              <span style={styles.itemText}>{item[dataKey]}</span>
              <span style={styles.count}>{item.count}</span>
            </div>
          ))
        ) : (
          <p style={styles.empty}>Sem dados</p>
        )}
      </div>
    </div>
  );
}

function PaymentBox({ title, data }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0) || 1;
  const entries = Object.entries(data).sort(([, a], [, b]) => b - a);

  return (
    <div style={styles.analysisBox}>
      <h3 style={styles.analysisTitle}>{title}</h3>
      <div style={styles.paymentList}>
        {entries.length > 0 ? (
          entries.map(([tipo, count], idx) => (
            <div key={idx} style={styles.paymentItem}>
              <div style={styles.paymentHeader}>
                <span style={styles.paymentType}>{tipo}</span>
                <span style={styles.paymentCount}>{count}</span>
              </div>
              <div style={styles.progressBar}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${(count / total) * 100}%`,
                  }}
                />
              </div>
              <span style={styles.paymentPercent}>
                {((count / total) * 100).toFixed(1)}%
              </span>
            </div>
          ))
        ) : (
          <p style={styles.empty}>Sem dados</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginTop: '24px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
  },
  analysisBox: {
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    border: '1px solid #334155',
    borderRadius: '12px',
    padding: 'clamp(16px, 4%, 24px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  },
  analysisTitle: {
    margin: '0 0 16px 0',
    fontSize: 'clamp(14px, 3vw, 16px)',
    color: '#e2e8f0',
    fontWeight: '600',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px',
    background: 'rgba(15, 23, 42, 0.5)',
    borderRadius: '8px',
    border: '1px solid #334155',
    minWidth: 0,
  },
  rank: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#3b82f6',
    minWidth: '24px',
    textAlign: 'center',
  },
  itemText: {
    flex: 1,
    fontSize: 'clamp(12px, 2vw, 13px)',
    color: '#cbd5e1',
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  count: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#94a3b8',
    background: 'rgba(59, 130, 246, 0.1)',
    padding: '4px 8px',
    borderRadius: '4px',
    whiteSpace: 'nowrap',
  },
  paymentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  paymentItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  paymentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px',
  },
  paymentType: {
    fontSize: 'clamp(12px, 2vw, 13px)',
    color: '#cbd5e1',
    fontWeight: '500',
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  paymentCount: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#94a3b8',
    whiteSpace: 'nowrap',
  },
  progressBar: {
    height: '6px',
    background: 'rgba(15, 23, 42, 0.7)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #3b82f6, #10b981)',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
  paymentPercent: {
    fontSize: '10px',
    color: '#94a3b8',
  },
  empty: {
    textAlign: 'center',
    color: '#64748b',
    padding: '20px',
    fontSize: 'clamp(12px, 2vw, 13px)',
  }
};
