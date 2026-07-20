'use client';

import { useAppSelector } from '@/store/storeHooks';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated && pathname !== '/admin/login' && pathname !== '/admin/register') {
      router.push('/admin/login');
    }
  }, [isAuthenticated, pathname, router]);

  if (!mounted) return null;

  if (!isAuthenticated && (pathname === '/admin/login' || pathname === '/admin/register')) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>CMS Admin</h2>
        <nav>
          <ul>
            <li><Link href="/admin">Dashboard</Link></li>
            <li><Link href="/admin/pages">Pages</Link></li>
            <li><Link href="/" target="_blank">View Site</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}
