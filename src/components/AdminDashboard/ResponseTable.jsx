import React from 'react';

export function ResponseTable({ respostas, onSelectResponse, selectedId = null }) {
  const [page, setPage] = React.useState(0);
  const [filter, setFilter] = React.useState('');
  const itemsPerPage = 10;

  const filteredRespostas = respostas.filter(resp => {
    const searchText = filter.toLowerCase();
    return (
      (resp.contato_nome && resp.contato_nome.toLowerCase().includes(searchText)) ||
      (resp.perfil && resp.perfil.toLowerCase().includes(searchText)) ||
      (resp.contato_info && resp.contato_info.toLowerCase().includes(searchText))
    );
  });

  const totalPages = Math.ceil(filteredRespostas.length / itemsPerPage);
  const paginatedRespostas = filteredRespostas.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>📋 Todas as Respostas</h3>
        <input
          type="text"
          placeholder="Buscar por nome, perfil ou contato..."
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(0);
          }}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Nome</th>
              <th style={styles.th}>Perfil</th>
              <th style={styles.th}>Áreas</th>
              <th style={styles.th}>Satisfação</th>
              <th style={styles.th}>Data</th>
              <th style={styles.th}>Contato</th>
              <th style={styles.th}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRespostas.map((resp) => (
              <tr
                key={resp.id}
                style={{
                  ...styles.tr,
                  background: selectedId === resp.id ? '#334155' : undefined,
                }}
              >
                <td style={styles.td}>{resp.contato_nome || '—'}</td>
                <td style={styles.td}>
                  <span style={styles.badge}>{resp.perfil}</span>
                </td>
                <td style={styles.td}>
                  <span style={styles.smallText}>
                    {resp.area && Array.isArray(resp.area)
                      ? resp.area.slice(0, 2).join(', ') + (resp.area.length > 2 ? '...' : '')
                      : '—'}
                  </span>
                </td>
                <td style={styles.td}>
                  <span style={{ ...styles.satisfacao, color: getSatisfacaoColor(resp.satisfacao) }}>
                    ★ {resp.satisfacao}
                  </span>
                </td>
                <td style={styles.td}>
                  <span style={styles.smallText}>
                    {resp.enviado_em ? new Date(resp.enviado_em.toDate?.() || resp.enviado_em).toLocaleDateString('pt-BR') : '—'}
                  </span>
                </td>
                <td style={styles.td}>
                  <span style={styles.smallText}>
                    {resp.contato_info ? '✓' : '—'}
                  </span>
                </td>
                <td style={styles.td}>
                  <button
                    onClick={() => onSelectResponse(resp)}
                    style={styles.actionBtn}
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.pagination}>
        <span style={styles.paginationInfo}>
          {filteredRespostas.length > 0
            ? `Mostrando ${page * itemsPerPage + 1}-${Math.min((page + 1) * itemsPerPage, filteredRespostas.length)} de ${filteredRespostas.length}`
            : 'Nenhuma resposta encontrada'}
        </span>
        <div style={styles.paginationButtons}>
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            style={styles.paginationBtn}
          >
            ← Anterior
          </button>
          <span style={styles.pageInfo}>{page + 1} de {totalPages || 1}</span>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            style={styles.paginationBtn}
          >
            Próximo →
          </button>
        </div>
      </div>
    </div>
  );
}

function getSatisfacaoColor(satisfacao) {
  if (!satisfacao) return '#94a3b8';
  if (satisfacao >= 4) return '#10b981';
  if (satisfacao >= 3) return '#f59e0b';
  return '#ef4444';
}

const styles = {
  container: {
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    border: '1px solid #334155',
    borderRadius: '12px',
    padding: 'clamp(16px, 4%, 24px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    overflowX: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    gap: '12px',
    flexWrap: 'wrap',
  },
  title: {
    margin: 0,
    fontSize: 'clamp(16px, 3vw, 18px)',
    color: '#e2e8f0',
    fontWeight: '600',
  },
  searchInput: {
    flex: 1,
    minWidth: '200px',
    padding: '10px 12px',
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '8px',
    color: '#e2e8f0',
    fontSize: 'clamp(12px, 2vw, 13px)',
  },
  tableWrapper: {
    overflowX: 'auto',
    marginBottom: '16px',
    borderRadius: '8px',
    border: '1px solid #334155',
    WebkitOverflowScrolling: 'touch',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 'clamp(11px, 1.5vw, 13px)',
  },
  th: {
    padding: 'clamp(8px, 2%, 12px)',
    background: '#0f172a',
    color: '#cbd5e1',
    fontWeight: '600',
    textAlign: 'left',
    borderBottom: '1px solid #334155',
    whiteSpace: 'nowrap',
  },
  tr: {
    borderBottom: '1px solid #334155',
    transition: 'background 0.2s ease',
  },
  td: {
    padding: 'clamp(8px, 2%, 12px)',
    color: '#cbd5e1',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  badge: {
    display: 'inline-block',
    background: 'rgba(59, 130, 246, 0.1)',
    color: '#3b82f6',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
  smallText: {
    fontSize: 'clamp(10px, 1.5vw, 12px)',
    color: '#94a3b8',
  },
  satisfacao: {
    fontWeight: '600',
    fontSize: 'clamp(10px, 1.5vw, 12px)',
  },
  actionBtn: {
    padding: '6px 10px',
    background: '#3b82f6',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '11px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '12px',
    borderTop: '1px solid #334155',
    flexWrap: 'wrap',
    gap: '12px',
  },
  paginationInfo: {
    fontSize: 'clamp(11px, 1.5vw, 12px)',
    color: '#94a3b8',
  },
  paginationButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  paginationBtn: {
    padding: '6px 10px',
    background: '#334155',
    border: '1px solid #475569',
    borderRadius: '6px',
    color: '#cbd5e1',
    fontSize: 'clamp(11px, 1.5vw, 12px)',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  pageInfo: {
    fontSize: 'clamp(10px, 1.5vw, 12px)',
    color: '#94a3b8',
    fontWeight: '500',
  }
};
