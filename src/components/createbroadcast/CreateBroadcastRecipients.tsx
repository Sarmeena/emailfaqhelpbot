"use client";

import React, { useState, useRef } from "react";
import { Upload, Plus, Trash2, Search, Users, AlertCircle } from "lucide-react";

export interface Recipient {
  name: string;
  email: string;
}

interface CreateBroadcastRecipientsProps {
  recipientsList: Recipient[];
  setRecipientsList: React.Dispatch<React.SetStateAction<Recipient[]>>;
}

// Predefined mock groups
const MOCK_GROUPS: Record<string, Recipient[]> = {
  "All Customers": [
    { name: "Alice Smith", email: "alice.smith@example.com" },
    { name: "Bob Jones", email: "bob.jones@example.com" },
    { name: "Charlie Brown", email: "charlie.brown@example.com" },
    { name: "Diana Prince", email: "diana.prince@example.com" },
    { name: "Ethan Hunt", email: "ethan.hunt@example.com" },
    { name: "Fiona Gallagher", email: "fiona.gallagher@example.com" },
    { name: "George Clark", email: "george.clark@example.com" },
    { name: "Hannah Abbott", email: "hannah.abbott@example.com" },
    { name: "Ian Malcolm", email: "ian.malcolm@example.com" },
    { name: "Julia Roberts", email: "julia.roberts@example.com" },
  ],
  "New Users": [
    { name: "Liam Neeson", email: "liam.neeson@example.com" },
    { name: "Noah Centineo", email: "noah.centineo@example.com" },
    { name: "Oliver Twist", email: "oliver.twist@example.com" },
    { name: "Emma Watson", email: "emma.watson@example.com" },
    { name: "Ava Gardner", email: "ava.gardner@example.com" },
  ],
  "Premium Users": [
    { name: "Tony Stark", email: "tony@starkindustries.com" },
    { name: "Bruce Wayne", email: "bruce@waynecorp.com" },
    { name: "Steve Rogers", email: "cap@avengers.org" },
  ],
  "Beta Testers": [
    { name: "Peter Parker", email: "spidey@dailybugle.com" },
    { name: "Clark Kent", email: "clark.kent@dailyplanet.com" },
    { name: "Bruce Banner", email: "hulk@avengers.org" },
    { name: "Natasha Romanoff", email: "nat@avengers.org" },
  ]
};

export default function CreateBroadcastRecipients({
  recipientsList,
  setRecipientsList,
}: CreateBroadcastRecipientsProps) {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [manualName, setManualName] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Group Select handler
  const handleGroupChange = (groupName: string) => {
    setSelectedGroup(groupName);
    if (groupName && MOCK_GROUPS[groupName]) {
      setRecipientsList(MOCK_GROUPS[groupName]);
      setErrorMessage("");
    }
  };

  // Manual Add handler
  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualEmail) {
      setErrorMessage("Email is required.");
      return;
    }
    
    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(manualEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    // Check duplicate
    if (recipientsList.some(r => r.email.toLowerCase() === manualEmail.toLowerCase())) {
      setErrorMessage("This email is already in the recipient list.");
      return;
    }

    const newRecipient: Recipient = {
      name: manualName.trim() || manualEmail.split("@")[0],
      email: manualEmail.trim()
    };

    setRecipientsList(prev => [...prev, newRecipient]);
    setManualName("");
    setManualEmail("");
    setErrorMessage("");
  };

  // CSV file parser handler
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      setErrorMessage("Only CSV files are supported.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) return;

        const lines = text.split(/\r?\n/);
        const parsed: Recipient[] = [];
        
        for (const line of lines) {
          if (!line.trim()) continue;
          
          // Simple CSV split (handling optionally quoted values)
          const parts = line.split(",").map(part => part.trim().replace(/^["']|["']$/g, ""));
          
          let email = "";
          let name = "";

          if (parts.length === 1) {
            email = parts[0];
            name = email.split("@")[0];
          } else if (parts.length >= 2) {
            // Check if first is name, second is email or vice versa
            if (parts[1].includes("@")) {
              name = parts[0];
              email = parts[1];
            } else if (parts[0].includes("@")) {
              email = parts[0];
              name = parts[1];
            } else {
              // fallback
              name = parts[0];
              email = parts[1];
            }
          }

          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (email && emailRegex.test(email)) {
            parsed.push({ name, email });
          }
        }

        if (parsed.length === 0) {
          setErrorMessage("No valid recipients found in CSV. Format: name,email");
        } else {
          setRecipientsList(prev => {
            // Filter out existing duplicates
            const filteredNew = parsed.filter(newRec => 
              !prev.some(existing => existing.email.toLowerCase() === newRec.email.toLowerCase())
            );
            return [...prev, ...filteredNew];
          });
          setErrorMessage("");
          alert(`Successfully imported ${parsed.length} recipients!`);
        }
      } catch (err) {
        console.error("Error reading CSV", err);
        setErrorMessage("Failed to parse CSV file.");
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove recipient handler
  const handleRemoveRecipient = (email: string) => {
    setRecipientsList(prev => prev.filter(r => r.email !== email));
  };

  // Filtered recipient list for table search
  const filteredRecipients = recipientsList.filter(
    r => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
         r.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-outline-variant pb-4">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          <h2 className="text-title-lg font-title-lg text-on-surface">
            Recipients Setup
          </h2>
        </div>
        <span className="rounded-full bg-primary-container px-3 py-1 text-label-md font-semibold text-primary">
          {recipientsList.length} Total
        </span>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-lg bg-error-container p-3 text-on-error-container text-body-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Recipient Collection Dropdown */}
        <div className="space-y-2">
          <label className="block text-label-md font-medium text-on-surface-variant">
            Select Recipient Collection
          </label>
          <select
            value={selectedGroup}
            onChange={(e) => handleGroupChange(e.target.value)}
            className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-3 text-body-md text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary"
          >
            <option value="">-- Choose Predefined Group --</option>
            {Object.keys(MOCK_GROUPS).map((group) => (
              <option key={group} value={group}>
                {group} ({MOCK_GROUPS[group].length} users)
              </option>
            ))}
          </select>
        </div>

        {/* Upload Recipients CSV */}
        <div className="space-y-2">
          <label className="block text-label-md font-medium text-on-surface-variant">
            Upload Recipients (CSV)
          </label>
          <div 
            onClick={() => fileInputRef.current?.click()} 
            className="flex items-center justify-center gap-3 cursor-pointer rounded-lg border border-dashed border-outline-variant bg-surface-container-low p-3 hover:bg-surface-container transition-all"
          >
            <Upload className="h-5 w-5 text-primary" />
            <span className="text-body-sm text-on-surface-variant font-medium">
              Click to upload name,email CSV
            </span>
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              onChange={handleCsvUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Manual Add Form */}
      <form onSubmit={handleManualAdd} className="space-y-2 border-t border-outline-variant pt-4">
        <label className="block text-label-md font-medium text-on-surface-variant">
          Manual Add Recipient
        </label>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Full Name (optional)"
            value={manualName}
            onChange={(e) => setManualName(e.target.value)}
            className="flex-1 rounded-lg border border-outline-variant bg-surface-container-lowest p-3 text-body-md text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary"
          />
          <input
            type="email"
            placeholder="email@example.com"
            value={manualEmail}
            onChange={(e) => setManualEmail(e.target.value)}
            className="flex-1 rounded-lg border border-outline-variant bg-surface-container-lowest p-3 text-body-md text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary"
            required
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-label-md font-label-md text-on-primary hover:bg-primary-container transition active:scale-95 shrink-0"
          >
            <Plus className="h-5 w-5" />
            <span>Add</span>
          </button>
        </div>
      </form>

      {/* Recipient Table */}
      <div className="border-t border-outline-variant pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-label-md font-medium text-on-surface-variant">
            Recipient List Table
          </label>
          <div className="relative w-48 md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search list..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-body-sm text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest max-h-60 overflow-y-auto">
          <table className="w-full text-left border-collapse text-body-sm">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="p-3 font-semibold text-on-surface-variant">Name</th>
                <th className="p-3 font-semibold text-on-surface-variant">Email Address</th>
                <th className="p-3 font-semibold text-on-surface-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filteredRecipients.length > 0 ? (
                filteredRecipients.map((rec) => (
                  <tr key={rec.email} className="hover:bg-surface-container-low/50">
                    <td className="p-3 text-on-surface font-medium">{rec.name}</td>
                    <td className="p-3 text-on-surface-variant">{rec.email}</td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveRecipient(rec.email)}
                        className="p-1 rounded text-error hover:bg-error-container/20 transition-colors"
                        title="Remove Recipient"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-on-surface-variant italic">
                    No recipients matched search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}