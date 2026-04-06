export interface Ticket {
  id: string;
  section: string;
  row: string;
  seats: number;
  price: number; // USD
  listed: string; // ISO 8601 timestamp
}

export interface TicketInventory {
  eventSlug: string;
  tickets: Ticket[];
  lastUpdated: string;
}

const baseTickets: Ticket[] = [
  { id: "t-001", section: "Floor A", row: "1", seats: 2, price: 350, listed: "2026-03-10T12:00:00-08:00" },
  { id: "t-002", section: "Floor B", row: "3", seats: 4, price: 295, listed: "2026-03-12T09:00:00-08:00" },
  { id: "t-003", section: "100", row: "8", seats: 2, price: 185, listed: "2026-03-14T15:30:00-08:00" },
  { id: "t-004", section: "100", row: "15", seats: 3, price: 150, listed: "2026-03-15T10:00:00-08:00" },
  { id: "t-005", section: "200", row: "4", seats: 2, price: 110, listed: "2026-03-11T08:00:00-08:00" },
  { id: "t-006", section: "200", row: "12", seats: 4, price: 89, listed: "2026-03-13T14:00:00-08:00" },
  { id: "t-007", section: "300", row: "2", seats: 2, price: 65, listed: "2026-03-09T11:00:00-08:00" },
  { id: "t-008", section: "300", row: "18", seats: 6, price: 45, listed: "2026-03-16T16:00:00-08:00" },
];

// Simulates live inventory — prices fluctuate and tickets randomly sell out
export function getTicketsForEvent(eventSlug: string): TicketInventory {
  const tickets = baseTickets
    .filter(() => Math.random() > 0.2) // ~20% chance a ticket is "sold"
    .map((ticket) => {
      const jitter = Math.floor((Math.random() - 0.5) * 20); // ±$10
      return {
        ...ticket,
        price: Math.max(1, ticket.price + jitter),
        seats: Math.max(1, ticket.seats + Math.floor((Math.random() - 0.5) * 4)),
      };
    });

  return {
    eventSlug,
    lastUpdated: new Date().toISOString(),
    tickets,
  };
}

export function getPriceRange(tickets: Ticket[]): {
  low: number;
  high: number;
} {
  const prices = tickets.map((t) => t.price);
  return {
    low: Math.min(...prices),
    high: Math.max(...prices),
  };
}