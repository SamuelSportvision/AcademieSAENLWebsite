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
    tagline: "Train daily. Compete at your best.",
    description:
      "Our Hockey program gives student-athletes the ice time and coaching they need to develop at an elite level — all while keeping up with their academics through a flexible school schedule.",
    highlights: [
      "Daily on-ice training sessions",
      "Qualified and experienced coaching staff",
      "Balanced academic and athletic schedule",
      "Partner program: Xtreme Hockey",
    ],
    accentColor: "#3B82F6",
    image: "/images/hockey-team.jpg",
  },
  {
    slug: "cheerleading",
    name: "Cheerleading",
    partner: null,
    partnerUrl: null,
    registrationUrl: TEAMSNAP_URL,
    tagline: "Strength, precision, and teamwork every day.",
    description:
      "Our Cheerleading program combines athleticism, artistry, and teamwork. Athletes train daily with qualified coaches in a supportive environment that nurtures both sport performance and personal growth.",
    highlights: [
      "Daily practice with certified coaches",
      "Strength and conditioning included",
      "Performance and competition preparation",
      "Flexible academic schedule for athletes",
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
      "Partnered with The Court House, our Volleyball program gives dedicated athletes daily court time and expert coaching to develop their skills at a high level while maintaining a flexible school schedule.",
    highlights: [
      "Daily training with experienced coaches",
      "Technical and tactical skill development",
      "Partner facility: The Court House",
      "Flexible schedule designed for student-athletes",
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
      "In partnership with Premier Sports Academy, our Baseball program provides a structured daily training environment for players who want to take their game to the next level while continuing their education.",
    highlights: [
      "Daily hitting, fielding, and pitching sessions",
      "Coaching from Premier Sports Academy staff",
      "Focus on fundamentals and game IQ",
      "Balanced academic and training schedule",
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
      "Our Basketball program, developed in partnership with CE23 Basketball, offers daily training sessions for student-athletes focused on skill development, team play, and athletic growth.",
    highlights: [
      "Daily skill development sessions",
      "Partner program: CE23 Basketball",
      "Individual and team-based coaching",
      "Flexible school schedule for athletes",
    ],
    accentColor: "#F97316",
    image: "/images/basketball.jpg",
  },
  {
    slug: "boxing",
    name: "Boxing",
    partner: null,
    partnerUrl: null,
    registrationUrl: TEAMSNAP_URL,
    tagline: "Discipline, focus, and dedication — every day.",
    description:
      "Our Boxing program develops discipline, mental toughness, and physical conditioning in a safe and structured environment. Athletes train daily under qualified coaches while following a flexible academic schedule.",
    highlights: [
      "Daily training with qualified boxing coaches",
      "Focus on technique, fitness, and mental strength",
      "Safe and structured training environment",
      "Flexible academic programming",
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
      "Partnered with The Dance Academy, our Dance program allows aspiring dancers to train daily in a professional environment while keeping up with their academics through a flexible schedule tailored to artists.",
    highlights: [
      "Daily dance training with professional instructors",
      "Partner facility: The Dance Academy",
      "Multiple styles and disciplines available",
      "Flexible schedule designed for student-artists",
    ],
    accentColor: "#A855F7",
    image: "/images/dance.jpg",
  },
  {
    slug: "soccer",
    name: "Soccer",
    partner: null,
    partnerUrl: null,
    registrationUrl: TEAMSNAP_URL,
    tagline: "Train harder. Play smarter.",
    description:
      "Our Soccer program provides student-athletes with daily training sessions focused on technical development, tactical understanding, and physical conditioning — all within a flexible academic framework.",
    highlights: [
      "Daily technical and tactical training",
      "Conditioning and game preparation",
      "Experienced coaching staff",
      "Flexible school schedule for athletes",
    ],
    accentColor: "#22C55E",
    image: "/images/soccer-card.png",
  },
];

export function getSportBySlug(slug: string): Sport | undefined {
  return sports.find((s) => s.slug === slug);
}
