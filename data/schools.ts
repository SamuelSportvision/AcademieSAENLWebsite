export interface School {
  name: string;
  level: "Elementary" | "Intermediate" | "Other";
}

export const schools: School[] = [
  { name: "Holy Trinity Elementary", level: "Elementary" },
  { name: "St. Francis of Assisi", level: "Elementary" },
  { name: "Mary Queen of Peace", level: "Elementary" },
  { name: "St. Bons", level: "Elementary" },
  { name: "Juniper Ridge", level: "Elementary" },
  { name: "Rennie's River", level: "Elementary" },
  { name: "Vanier Elementary", level: "Elementary" },
  { name: "Roncalli Elementary", level: "Elementary" },
  { name: "Paradise Elementary", level: "Elementary" },
  { name: "Elizabeth Park Elementary", level: "Elementary" },
  { name: "Paradise Intermediate", level: "Intermediate" },
  { name: "Octagon Pond School", level: "Other" },
];
