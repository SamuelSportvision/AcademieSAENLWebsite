export interface Sport {
  slug: string;
  name: string;
  partner: string | null;
  partnerUrl: string | null;
  registrationUrl: string;
  tagline: string;
  description: string;
  highlights: string[];
  accentColor: string;
  image: string | null;
}

const TEAMSNAP_URL = "https://go.teamsnap.com/forms/518037";

export const sports: Sport[] = [
  {
    slug: "hockey",
    name: "Hockey",
    partner: "Xtreme Hockey",
    partnerUrl: null,
    registrationUrl: TEAMSNAP_URL,
    tagline: "Train Weekly.",
    description:
      "Our Hockey program gives athletes the ice time and coaching they need to develop at an elite level.",
    highlights: [
      "Weekly on-ice training sessions",
      "Qualified and experienced coaching staff",
      "Partner program: Xtreme Hockey",
    ],
    accentColor: "#3B82F6",
    image: "/images/hockey-team.jpg",
  },
  {
    slug: "cheerleading",
    name: "Cheerleading",
    partner: "Cheer Sport Sharks",
    partnerUrl: null,
    registrationUrl: TEAMSNAP_URL,
    tagline: "Strength, precision, and teamwork every day.",
    description:
      "Our Cheerleading program combines athleticism, artistry, and teamwork. Athletes train weekly with qualified coaches in a supportive environment that nurtures both sport performance and personal growth.",
    highlights: [
      "Weekly practice with certified coaches",
      "Strength and conditioning included",
      "Partner program: Cheer Sport Sharks",
    ],
    accentColor: "#EC4899",
    image: "/images/cheerleading-card.png",
  },
  {
    slug: "volleyball",
    name: "Volleyball",
    partner: "The Court House",
    partnerUrl: null,
    registrationUrl: TEAMSNAP_URL,
    tagline: "Elevate your game on and off the court.",
    description:
      "Partnered with The Court House, our Volleyball program gives dedicated athletes weekly court time and expert coaching to develop their skills at a high level.",
    highlights: [
      "Weekly training with experienced coaches",
      "Technical and tactical skill development",
      "Partner facility: The Court House",
    ],
    accentColor: "#F59E0B",
    image: "/images/volleyball-card.png",
  },
  {
    slug: "baseball",
    name: "Baseball",
    partner: "Premier Sports Academy",
    partnerUrl: null,
    registrationUrl: TEAMSNAP_URL,
    tagline: "Develop the fundamentals. Excel at every level.",
    description:
      "In partnership with Premier Sports Academy, our Baseball program provides a structured weekly training environment for players who want to take their game to the next level.",
    highlights: [
      "Weekly hitting, fielding, and pitching sessions",
      "Coaching from Premier Sports Academy staff",
      "Focus on fundamentals and game IQ",
    ],
    accentColor: "#10B981",
    image: "/images/baseball-team.jpg",
  },
  {
    slug: "basketball",
    name: "Basketball",
    partner: "CE23 Basketball",
    partnerUrl: null,
    registrationUrl: TEAMSNAP_URL,
    tagline: "Play every day. Grow every game.",
    description:
      "Our Basketball program, developed in partnership with CE23 Basketball, offers weekly training sessions focused on skill development, team play, and athletic growth.",
    highlights: [
      "Weekly skill development sessions",
      "Partner program: CE23 Basketball",
      "Individual and team-based coaching",
    ],
    accentColor: "#F97316",
    image: "/images/basketball.jpg",
  },
  {
    slug: "boxing",
    name: "Boxing",
    partner: "NL Boxing",
    partnerUrl: null,
    registrationUrl: TEAMSNAP_URL,
    tagline: "Discipline, focus, and dedication — every day.",
    description:
      "Our Boxing program develops discipline, mental toughness, and physical conditioning in a safe and structured environment. Athletes train weekly under qualified coaches.",
    highlights: [
      "Weekly training with qualified boxing coaches",
      "Focus on technique, fitness, and mental strength",
      "Partner program: NL Boxing",
    ],
    accentColor: "#EF4444",
    image: "/images/boxing-card.png",
  },
  {
    slug: "dance",
    name: "Dance",
    partner: "The Dance Academy",
    partnerUrl: null,
    registrationUrl: TEAMSNAP_URL,
    tagline: "Express yourself. Train like a professional.",
    description:
      "Partnered with The Dance Academy, our Dance program allows aspiring dancers to train weekly in a professional environment.",
    highlights: [
      "Weekly dance training with professional instructors",
      "Partner facility: The Dance Academy",
      "Multiple styles and disciplines available",
    ],
    accentColor: "#A855F7",
    image: "/images/dance.jpg",
  },
  {
    slug: "soccer",
    name: "Soccer",
    partner: "Pro Touch Academy",
    partnerUrl: null,
    registrationUrl: TEAMSNAP_URL,
    tagline: "Train harder. Play smarter.",
    description:
      "Our Soccer program provides athletes with weekly training sessions focused on technical development, tactical understanding, and physical conditioning.",
    highlights: [
      "Weekly technical and tactical training",
      "Conditioning and game preparation",
      "Partner program: Pro Touch Academy",
    ],
    accentColor: "#22C55E",
    image: "/images/soccer-hero.png",
  },
];

export function getSportBySlug(slug: string): Sport | undefined {
  return sports.find((s) => s.slug === slug);
}
