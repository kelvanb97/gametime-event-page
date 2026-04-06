export interface Performer {
  name: string;
  type: "SportsTeam" | "Person" | "Organization";
}

export interface Venue {
  name: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
}

export interface Event {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  startDate: string; // ISO 8601
  endDate: string;
  doorsOpen: string;
  venue: Venue;
  performers: Performer[];
  imageUrl: string;
  category: string;
}

export const events: Event[] = [
  {
    slug: "lakers-vs-warriors-2026-03-20",
    name: "Los Angeles Lakers vs Golden State Warriors",
    shortName: "Lakers vs Warriors",
    description:
      "NBA regular season game between the Los Angeles Lakers and Golden State Warriors at Crypto.com Arena.",
    startDate: "2026-03-20T19:30:00-08:00",
    endDate: "2026-03-20T22:00:00-08:00",
    doorsOpen: "2026-03-20T18:00:00-08:00",
    venue: {
      name: "Crypto.com Arena",
      streetAddress: "1111 S Figueroa St",
      addressLocality: "Los Angeles",
      addressRegion: "CA",
      postalCode: "90015",
      addressCountry: "US",
    },
    performers: [
      { name: "Los Angeles Lakers", type: "SportsTeam" },
      { name: "Golden State Warriors", type: "SportsTeam" },
    ],
    imageUrl: "https://example.com/images/lakers-warriors.jpg",
    category: "NBA Basketball",
  },
];

export function getEventBySlug(slug: string): Event | undefined {
  return events.find((e) => e.slug === slug);
}

export function getAllSlugs(): string[] {
  return events.map((e) => e.slug);
}