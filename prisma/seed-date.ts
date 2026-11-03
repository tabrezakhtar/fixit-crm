const millisecondsPerDay = 86_400_000;

export function createSeedDateShifter(seedDates: Date[], today = new Date()) {
  const referenceDay = Math.max(
    ...seedDates.map((date) =>
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    )
  );

  return (value: Date): Date => {
    const valueDay = Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate());
    const daysFromReference = Math.round((valueDay - referenceDay) / millisecondsPerDay);

    return new Date(
      Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate() + daysFromReference,
        value.getUTCHours(),
        value.getUTCMinutes(),
        value.getUTCSeconds(),
        value.getUTCMilliseconds()
      )
    );
  };
}