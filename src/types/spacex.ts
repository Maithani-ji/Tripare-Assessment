export interface Launch {
  id: string;
  name: string;
  date_utc: string;
  success: boolean | null;
  upcoming: boolean;
  links: {
    patch: { small: string | null; large: string | null };
    webcast: string | null;
  };
  launchpad: string;
}

export interface Launchpad {
  id: string;
  full_name: string;
  locality: string;
  region: string;
  timezone: string;
  latitude: number;
  longitude: number;
  launch_attempts: number;
  launch_successes: number;
}
