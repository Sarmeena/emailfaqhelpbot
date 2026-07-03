"use client";

import { useEffect, useState } from "react";
import { Mail, CheckCircle2, AlertCircle, RefreshCw, LogOut, Key } from "lucide-react";
import { getGmailConfig, saveGmailConfig, disconnectGmail, GmailConfig } from "../../services/firestore/gmailConfig";

export default function SettingsGmail() {
  const [config, setConfig] = useState<GmailConfig | null>(null);
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function loadConfig() {
      try {
        const data = await getGmailConfig();
        if (data) {
          setConfig(data);
          setClientId(data.clientId || "");
          setClientSecret(data.clientSecret || "");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  async function handleSimulate() {
    setActionLoading(true);
    try {
      const res = await fetch("/api/gmail/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "simulate" }),
      });
      const data = await res.json();
      if (data.success) {
        const fresh = await getGmailConfig();
        setConfig(fresh);
        alert("Simulated Gmail account successfully connected! You can now sync inbox messages.");
      } else {
        alert(data.error || "Failed to simulate connection.");
      }
    } catch (err) {
      console.error(err);
      alert("Error starting simulation.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId.trim() || !clientSecret.trim()) {
      alert("Please enter both Client ID and Client Secret.");
      return;
    }
    setActionLoading(true);
    try {
      const res = await fetch("/api/gmail/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "connect", clientId, clientSecret }),
      });
      const data = await res.json();
      if (data.success && data.url) {
        // Redirect to Google Consent Screen
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to generate authentication URL.");
        setActionLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert("Error initiating OAuth flow.");
      setActionLoading(false);
    }
  }

  async function handleDisconnect() {
    if (!confirm("Disconnect Gmail account and clear saved credentials?")) return;
    setActionLoading(true);
    try {
      await disconnectGmail();
      setConfig(null);
      setClientId("");
      setClientSecret("");
      alert("Account disconnected.");
    } catch (err) {
      console.error(err);
      alert("Failed to disconnect.");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm flex items-center justify-center py-10">
        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-3 text-body-md text-on-surface-variant">Loading Gmail settings...</span>
      </section>
    );
  }

  const isConnected = config?.connected;
  const isSimulated = config?.isSimulated;

  return (
    <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-red-50 p-2 text-red-600">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-title-lg font-semibold text-on-surface">
              Gmail API Integration
            </h2>
            <p className="text-xs text-on-surface-variant">Sync incoming emails as helpdesk tickets and respond in-thread</p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center">
          {isConnected ? (
            isSimulated ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                Sandbox Simulated
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 border border-green-200">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Connected Profile
              </span>
            )
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-650 border border-slate-200">
              <AlertCircle className="h-3.5 w-3.5" />
              Not Connected
            </span>
          )}
        </div>
      </div>

      {isConnected ? (
        <div className="space-y-4">
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 space-y-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Account Type</span>
              <p className="text-body-md font-semibold text-slate-700">{isSimulated ? "Sandbox Environment (Simulated)" : "Standard OAuth 2.0 Client"}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Connected Address</span>
              <p className="text-lg font-mono font-bold text-slate-800 break-all">{config.emailAddress}</p>
            </div>
            {!isSimulated && (
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Client Credentials</span>
                <p className="text-xs font-mono text-slate-500 break-all">ID: {config.clientId.slice(0, 20)}...</p>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleDisconnect}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-4 py-2 text-sm font-semibold transition disabled:opacity-50"
            >
              <LogOut size={16} />
              Disconnect Integration
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleConnect} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-label-sm font-medium text-outline">
                Google OAuth Client ID
              </label>
              <input
                type="text"
                placeholder="1033982128...apps.googleusercontent.com"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 font-mono text-sm"
              />
            </div>

            <div>
              <label className="mb-2 block text-label-sm font-medium text-outline">
                Google OAuth Client Secret
              </label>
              <input
                type="password"
                placeholder="GOCSPX-..."
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 font-mono text-sm"
              />
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 border border-slate-100 p-4 text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">Callback configuration details:</p>
            <p>Ensure that your Google Cloud Console project includes the following redirect URI:</p>
            <p className="font-mono text-blue-700 font-bold bg-blue-50/50 p-1.5 rounded border border-blue-100 inline-block mt-1">
              http://localhost:3000/api/gmail/callback
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleSimulate}
              disabled={actionLoading}
              className="inline-flex justify-center items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-5 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition active:scale-95 disabled:opacity-50"
            >
              One-Click Sandbox Demo (No Keys)
            </button>

            <button
              type="submit"
              disabled={actionLoading}
              className="inline-flex justify-center items-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 transition active:scale-95 disabled:opacity-50 shadow-sm"
            >
              <Key size={15} />
              Connect Live Gmail
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
