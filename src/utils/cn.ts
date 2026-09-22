type ClassValue = string | false | null | undefined;

/** Junta classes condicionais, ignorando valores falsos. */
export const cn = (...classes: ClassValue[]) => classes.filter(Boolean).join(' ');
