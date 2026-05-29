export default function Dashboard() {
  return (
    <div className="dashboard-page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-desc">Chào mừng trở lại 👋</p>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Doanh thu</div>
          <div className="stat-value">842.5M₫</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Đơn hàng</div>
          <div className="stat-value">128</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Khách hàng</div>
          <div className="stat-value">34</div>
        </div>
      </div>
    </div>
  );
}