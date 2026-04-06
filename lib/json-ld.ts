import { Event } from "@/data/events";
import { Ticket, getPriceRange } from "@/data/tickets";
import { getBaseUrl } from "@/lib/utils";

export function generateEventJsonLd(event: Event, tickets: Ticket[]) {
  const priceRange = getPriceRange(tickets);
  const baseUrl = getBaseUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    doorTime: event.doorsOpen,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    image: event.imageUrl,
    location: {
      "@type": "Place",
      name: event.venue.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: event.venue.streetAddress,
        addressLocality: event.venue.addressLocality,
        addressRegion: event.venue.addressRegion,
        postalCode: event.venue.postalCode,
        addressCountry: event.venue.addressCountry,
      },
    },
    performer: event.performers.map((performer) => ({
      "@type": performer.type,
      name: performer.name,
    })),
    offers: {
      "@type": "AggregateOffer",
      lowPrice: priceRange.low.toString(),
      highPrice: priceRange.high.toString(),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      validFrom: tickets.length > 0 ? tickets[0].listed : event.startDate,
      url: `${baseUrl}/events/${event.slug}`,
      offerCount: tickets.length.toString(),
    },
    organizer: {
      "@type": "Organization",
      name: "Gametime",
      url: baseUrl,
    },
  };
}