const bcrypt = require('bcrypt');

export async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

export async function comparePassword(password, hashedPassword) {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  console.log(isMatch);
  return isMatch;
}

export function formatDate(date: string | Date | null, timeZone: string = "UTC"): string | null {
  if (!date) return null;
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: 'Asia/Ho_Chi_Minh',
  });
}