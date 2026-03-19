import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function ProfilePieChart({ data }) {
  return (
    <div style={styles.chartContainer}>
      <h3 style={styles.title}>Distribuição por Perfil</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={100}
            fill="#3b82f6"
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SatisfactionChart({ data }) {
  return (
    <div style={styles.chartContainer}>
      <h3 style={styles.title}>Satisfação por Perfil</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="perfil" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip 
            contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
            labelStyle={{ color: '#e2e8f0' }}
          />
          <Bar dataKey="satisfacao" fill="#10b981" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AreasChart({ data }) {
  return (
    <div style={styles.chartContainer}>
      <h3 style={styles.title}>Top Áreas de Atuação</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis type="number" stroke="#94a3b8" />
          <YAxis dataKey="area" type="category" stroke="#94a3b8" width={190} />
          <Tooltip 
            contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
            labelStyle={{ color: '#e2e8f0' }}
          />
          <Bar dataKey="count" fill="#f59e0b" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TimelineChart({ data }) {
  return (
    <div style={styles.chartContainer}>
      <h3 style={styles.title}>Timeline de Respostas</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="data" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip 
            contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
            labelStyle={{ color: '#e2e8f0' }}
          />
          <Line 
            type="monotone" 
            dataKey="respostas" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const styles = {
  chartContainer: {
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    border: '1px solid #334155',
    borderRadius: '12px',
    padding: 'clamp(16px, 4%, 24px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  },
  title: {
    margin: '0 0 16px 0',
    fontSize: 'clamp(14px, 3vw, 16px)',
    color: '#e2e8f0',
    fontWeight: '600',
  }
};
