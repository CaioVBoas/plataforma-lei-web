/** "1 demanda", "3 demandas". O plural irregular é explícito para não inventar regra de português. */
export const pluralize = (count: number, singular: string, plural: string) =>
  `${count} ${count === 1 ? singular : plural}`;

export const initialsOf = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

export const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** Converte "2026-09-02" (valor de input date) para "02/09/2026". */
export const isoToBrDate = (iso: string) => {
  const [year, month, day] = iso.split('-');
  return year && month && day ? `${day}/${month}/${year}` : iso;
};

export const sumHours = (values: string[]) =>
  values.reduce((total, value) => total + (Number.parseInt(value, 10) || 0), 0);

export const onlyDigits = (value: string) => value.replace(/[^0-9]/g, '');
