export function KPICard({ label, value, icon: Icon, color = '#3b82f6', trend = null, subtext = '' }) {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={{ ...styles.iconBox, backgroundColor: `${color}15`, borderColor: `${color}30` }}>
          {Icon && <Icon size={20} color={color} />}
        </div>
        <div style={styles.trendContainer}>
          <h3 style={styles.label}>{label}</h3>
          {trend && <span style={{ ...styles.trend, color: trend > 0 ? '#10b981' : '#ef4444' }}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>}
        </div>
      </div>
      <div style={styles.value}>{value}</div>
      {subtext && <p style={styles.subtext}>{subtext}</p>}
    </div>
  );
}

const styles = {
  card: {
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    border: '1px solid #334155',
    borderRadius: '12px',
    padding: 'clamp(16px, 5%, 24px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '12px',
  },
  iconBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    minWidth: '40px',
    height: '40px',
    borderRadius: '8px',
    border: '1px solid',
  },
  trendContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
    minWidth: 0,
  },
  label: {
    margin: 0,
    fontSize: 'clamp(12px, 2.5vw, 14px)',
    color: '#cbd5e1',
    fontWeight: '500',
    wordBreak: 'break-word',
  },
  trend: {
    fontSize: '11px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },
  value: {
    fontSize: 'clamp(24px, 6vw, 32px)',
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: '8px',
    wordBreak: 'break-word',
  },
  subtext: {
    margin: 0,
    fontSize: 'clamp(11px, 2vw, 12px)',
    color: '#94a3b8',
    wordBreak: 'break-word',
  }
};
