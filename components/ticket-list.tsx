"use client";

import { useEffect, useState, useCallback } from "react";
import { Ticket } from "@/data/tickets";

const POLL_INTERVAL_MS = 30_000; // 30 seconds

interface TicketListProps {
  eventSlug: string;
  initialTickets: Ticket[];
}

export default function TicketList({
  eventSlug,
  initialTickets,
}: TicketListProps) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    try {
      const res = await fetch(`/api/events/${eventSlug}/tickets`);
      if (!res.ok) return;
      const data = await res.json();
      setTickets(data.tickets);
      setLastUpdated(data.lastUpdated);
    } catch (error) {
      // Silently fail — stale data is better than no data
      console.error("Failed to refresh tickets:", error);
    }
  }, [eventSlug]);

  useEffect(() => {
    const interval = setInterval(fetchTickets, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchTickets]);

  return (
    <>
      {lastUpdated && (
        <p>
          <small>
            Last updated:{" "}
            <time dateTime={lastUpdated}>
              {new Date(lastUpdated).toLocaleTimeString()}
            </time>
          </small>
        </p>
      )}

      <table>
        <thead>
          <tr>
            <th scope="col">Section</th>
            <th scope="col">Row</th>
            <th scope="col">Seats</th>
            <th scope="col">Price</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.section}</td>
              <td>{ticket.row}</td>
              <td>{ticket.seats}</td>
              <td>${ticket.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}