/** Cookie consent storage. Returns "accepted" | "declined" | null (not answered yet). */
const KEY = "alvan-cookies";

export function getConsent() {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "accepted" || v === "declined") return v;
    // Older builds stored "actioned" for both choices: treat as answered, unknown.
    return v == null ? null : "declined";
  } catch {
    return null;
  }
}

export function setConsent(value) {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    /* storage unavailable: choice lasts for this page view only */
  }
}
