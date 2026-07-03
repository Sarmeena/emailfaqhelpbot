"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  getRequest,
  updateRequest,
} from "../../../../services/firestore/requests";

export default function EditRequestPage() {
  const { id } = useParams();
  const router = useRouter();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Open");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRequest() {
      if (!id) return;

      try {
        const request = await getRequest(id as string);

        setCustomerName(request.customerName);
        setCustomerEmail(request.customerEmail);
        setSubject(request.subject);
        setMessage(request.message);
        setPriority(request.priority);
        setStatus(request.status);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadRequest();
  }, [id]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    try {
      await updateRequest(id as string, {
        customerName,
        customerEmail,
        subject,
        message,
        priority,
        status,
      });

      alert("Request Updated!");

      router.push("/requests");
    } catch (error) {
      console.error(error);
      alert("Failed to update request.");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
  <main className="min-h-screen bg-gray-100 p-6">
    <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow">

      <h1 className="mb-8 text-3xl font-bold">
        Edit Request
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full rounded-lg border p-3"
          required
        />

        <input
          type="email"
          placeholder="Customer Email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          className="w-full rounded-lg border p-3"
          required
        />

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full rounded-lg border p-3"
          required
        />

        <textarea
          rows={5}
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-lg border p-3"
          required
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full rounded-lg border p-3"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-lg border p-3"
        >
          <option>Open</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white hover:bg-blue-800"
        >
          Update Request
        </button>

      </form>

    </div>
  </main>
);
}