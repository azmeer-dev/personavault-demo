"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface OverviewData {
  accounts: number;
  identities: number;
  apps: number;
  pendingConsents: number;
  auditLogs: number;
}

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    if (status === 'authenticated') {
      fetch('/api/dashboard/overview', {credentials: "include"},)
        .then(async (res) => {
          if (!res.ok) throw new Error('Failed to fetch overview data');
          return res.json();
        })
        .then((json: OverviewData) => setData(json))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [status, router]);

  if (status === 'loading' || loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }
  if (error || !data) {
    return <div className="p-6 text-red-500">Error: {error || 'Unknown error'}</div>;
  }

  return (
    <main className="p-6 bg-[var(--color-background)] text-[var(--color-on-background)]">
      <h1 className="text-3xl font-semibold mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-4 bg-[var(--color-surface)] rounded-2xl shadow">
          <h2 className="text-lg font-medium">Linked Accounts</h2>
          <p className="text-4xl font-bold mt-2">{data.accounts}</p>
        </div>
        <div className="p-4 bg-[var(--color-surface)] rounded-2xl shadow">
          <h2 className="text-lg font-medium">Identities</h2>
          <p className="text-4xl font-bold mt-2">{data.identities}</p>
        </div>
        <div className="p-4 bg-[var(--color-surface)] rounded-2xl shadow">
          <h2 className="text-lg font-medium">API Apps</h2>
          <p className="text-4xl font-bold mt-2">{data.apps}</p>
        </div>
        <div className="p-4 bg-[var(--color-surface)] rounded-2xl shadow">
          <h2 className="text-lg font-medium">Pending Consents</h2>
          <p className="text-4xl font-bold mt-2">{data.pendingConsents}</p>
        </div>
        <div className="p-4 bg-[var(--color-surface)] rounded-2xl shadow lg:col-span-4">
          <h2 className="text-lg font-medium">Audit Logs</h2>
          <p className="text-4xl font-bold mt-2">{data.auditLogs}</p>
        </div>
      </div>

      {/* <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <p className="text-sm text-gray-500">Coming soon...</p>
      </section> */}
    </main>
  );
}
