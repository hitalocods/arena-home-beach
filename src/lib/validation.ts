const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function requiredString(value: unknown, field: string, max = 120) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${field} é obrigatório.`);
  }
  if (value.trim().length > max) {
    throw new Error(`${field} excede o tamanho permitido.`);
  }
  return value.trim();
}

export function optionalString(value: unknown, max = 500) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || value.trim().length > max) {
    throw new Error("Texto inválido.");
  }
  return value.trim();
}

export function booleanValue(value: unknown, fallback = true) {
  return typeof value === "boolean" ? value : fallback;
}

export function numberValue(value: unknown, field: string, min = 0) {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed) || parsed < min) {
    throw new Error(`${field} inválido.`);
  }
  return parsed;
}

export function integerValue(value: unknown, fallback = 0) {
  const parsed = Number(value ?? fallback);
  if (!Number.isInteger(parsed)) throw new Error("Ordem inválida.");
  return parsed;
}

export function timeValue(value: unknown) {
  const time = requiredString(value, "Horário", 5);
  if (!TIME_PATTERN.test(time)) throw new Error("Horário inválido.");
  return time;
}

export function dateValue(value: unknown) {
  const date = requiredString(value, "Data", 10);
  if (!DATE_PATTERN.test(date)) throw new Error("Data inválida.");
  const parsed = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) throw new Error("Data inválida.");
  return parsed;
}

export function dateToInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function todayInSaoPaulo() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function phoneValue(value: unknown) {
  const phone = requiredString(value, "WhatsApp", 20);
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 13) {
    throw new Error("Informe um WhatsApp válido.");
  }
  return digits;
}

export function imageUrlValue(value: unknown, required = false) {
  if (!value && !required) return null;
  const url = requiredString(value, "Imagem", 2000);
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") throw new Error();
  } catch {
    throw new Error("URL da imagem inválida.");
  }
  return url;
}

export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
}
