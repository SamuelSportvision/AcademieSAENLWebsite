export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export const DAYS_OF_WEEK: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export interface ScheduleEvent {
  id: string;
  day: DayOfWeek;
  sport_slug: string;
  sport_name: string;
  /** 24-hour format, e.g. "15:00" */
  start_time: string;
  /** 24-hour format, e.g. "17:00" */
  end_time: string;
  location: string | null;
  /** Hex color, e.g. "#3B82F6" */
  color: string;
  created_at: string;
}

export type NewScheduleEvent = Omit<ScheduleEvent, "id" | "created_at">;
