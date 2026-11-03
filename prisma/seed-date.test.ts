import { createSeedDateShifter } from './seed-date';

describe('createSeedDateShifter', () => {
  it('moves the latest fixture day to today and preserves relative dates', () => {
    const shiftSeedDate = createSeedDateShifter(
      [new Date('2026-10-13T00:00:00.000Z')],
      new Date('2026-11-03T09:00:00.000Z')
    );

    expect(shiftSeedDate(new Date('2026-10-13T00:00:00.000Z')).toISOString()).toBe(
      '2026-11-03T00:00:00.000Z'
    );
    expect(shiftSeedDate(new Date('2026-10-12T10:00:00.000Z')).toISOString()).toBe(
      '2026-11-02T10:00:00.000Z'
    );
    expect(shiftSeedDate(new Date('2026-10-26T00:00:00.000Z')).toISOString()).toBe(
      '2026-11-16T00:00:00.000Z'
    );
  });
});