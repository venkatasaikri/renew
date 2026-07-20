'use client';

import { useGetPagesQuery } from '@/store/apiSlice';

export default function AdminDashboard() {
  const { data: pages, isLoading, error } = useGetPagesQuery();

  if (isLoading) return <div>Loading dashboard data...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Welcome to the CMS admin panel. Use the sidebar to navigate.</p>
      
      <div className="stats-cards">
        <div className="card">
          <h3>Total Pages</h3>
          <p className="stat-number">{pages?.length || 0}</p>
        </div>
      </div>
    </div>
  );
}
