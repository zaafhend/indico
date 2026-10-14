import { expect } from '@playwright/test';

const STATUSES = ['available', 'pending', 'sold'];

/** Checks a response body against the Pet schema from the Swagger docs, required fields only */
export function expectValidPet(body: unknown): void {
  expect(body).toEqual(
    expect.objectContaining({
      name: expect.any(String),
      photoUrls: expect.any(Array),
    }),
  );

  const pet = body as Record<string, unknown>;
  for (const url of pet.photoUrls as unknown[]) {
    expect(typeof url).toBe('string');
  }
  if (pet.id !== undefined) expect(Number.isInteger(pet.id)).toBe(true);
  if (pet.status !== undefined) expect(STATUSES).toContain(pet.status);
  if (pet.tags !== undefined) expect(Array.isArray(pet.tags)).toBe(true);
  if (pet.category !== undefined) expect(typeof pet.category).toBe('object');
}
