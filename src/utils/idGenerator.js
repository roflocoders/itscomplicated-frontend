export function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback для старых браузеров
  const time = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 9);
  return `${time}_${random}`;
}
