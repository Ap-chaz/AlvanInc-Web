// Small helpers that check what visitors send us.

// A positive whole number, or null.
export const toId = (v) => {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : null;
};

// A trimmed, non-empty string no longer than `max`, or null.
export const text = (v, max) =>
  typeof v === 'string' && v.trim() && v.trim().length <= max ? v.trim() : null;

// A whole number for sort order; anything else becomes 0.
export const order = (v) => (Number.isInteger(v) ? v : 0);
