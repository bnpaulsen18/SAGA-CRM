"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";

interface AdminNavProps {
  userName: string;
  userRole?: string;
  currentPage?: string;
  showBackButton?: boolean;
  backHref?: string;
}

export default function AdminNav({
  userName,
  userRole = "Platform Administrator",
  currentPage,
  showBackButton = false,
  backHref = "/admin"
}: AdminNavProps) {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header
      className="shadow-lg border-b-2 sticky top-0 z-50"
      style={{
        background: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b3d 25%, #5c1644 50%, #8b1e4b 75%, #b4154b 85%, #ff6b35 100%)',
        borderBottomColor: 'rgba(255, 107, 53, 0.3)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <img
                src="/SAGA_Logo_final.png"
                alt="SAGA CRM"
                style={{
                  height: '70px',
                  width: 'auto',
                  display: 'block',
                  filter: 'drop-shadow(0 6px 16px rgba(255, 107, 53, 0.4)) drop-shadow(0 3px 8px rgba(180, 21, 75, 0.3)) brightness(1.1) contrast(1.15) saturate(1.08)',
                  opacity: '0.98',
                  cursor: 'pointer'
                }}
              />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {currentPage || "Platform Admin"}
              </h1>
              <p className="text-sm text-white/85">SAGA CRM Management Console</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Link
                href={backHref}
                className="px-4 py-2 rounded-lg font-semibold transition-all hover:bg-white/10"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white'
                }}
              >
                ← Back
              </Link>
            )}
            <div className="text-right">
              <p className="text-sm text-white/90">{userName}</p>
              <p className="text-xs font-semibold" style={{ color: '#ffa07a' }}>
                {userRole}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #b4154b 0%, #ff6b35 100%)',
                border: 'none',
                color: 'white',
                boxShadow: '0 4px 12px rgba(255, 107, 53, 0.4)'
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
