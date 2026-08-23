export type MyChildProfile = {
  name: string;
  dateOfBirth: string;
  sex: "MALE" | "FEMALE";
  /** Grow Right patient id when registered */
  patientId?: string;
};

export const MY_CHILD_STORAGE_KEY = "drcare-my-child";

export function readMyChildProfile(): MyChildProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(MY_CHILD_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MyChildProfile;
    if (parsed?.name && parsed?.dateOfBirth && (parsed.sex === "MALE" || parsed.sex === "FEMALE")) {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function writeMyChildProfile(profile: MyChildProfile): void {
  localStorage.setItem(MY_CHILD_STORAGE_KEY, JSON.stringify(profile));
}

export function clearMyChildProfile(): void {
  localStorage.removeItem(MY_CHILD_STORAGE_KEY);
}

/** Build /growth/register URL with My Child fields prefilled. */
export function registerHrefFromProfile(profile: MyChildProfile): string {
  const params = new URLSearchParams({
    name: profile.name,
    dob: profile.dateOfBirth,
    sex: profile.sex,
    from: "my-child",
  });
  return `/growth/register?${params.toString()}`;
}
