import { test, expect } from './fixtures';
import { buildPet } from '../src/data/petFactory';
import { expectValidPet } from '../src/utils/assertions';
import { PetStatus } from '../src/types/pet';

// Based on  the Swagger docs, an invalid status value on GET /pet/findByStatus returns 400.
const INVALID_STATUS = 400;

// No assertion for total pet count since the store is public
type PetLike = { id?: number; status?: string };

test.describe('GET /pet/findByStatus - positive', () => {
  for (const status of ['available', 'pending', 'sold'] as PetStatus[]) {
    test(`P01 returns only "${status}" pets`, async ({ petClient }) => {
      const response = await petClient.findByStatus(status);

      expect(response.status()).toBe(200);
      const body = (await response.json()) as PetLike[];
      expect(Array.isArray(body)).toBe(true);
      for (const pet of body) {
        expect(pet.status).toBe(status);
      }
    });
  }

  test('P02 returns pets of either status for two comma-separated statuses', async ({ petClient }) => {
    const response = await petClient.findByStatus(['available', 'pending']);

    expect(response.status()).toBe(200);
    const body = (await response.json()) as PetLike[];
    expect(Array.isArray(body)).toBe(true);
    for (const pet of body) {
      expect(['available', 'pending']).toContain(pet.status);
    }
  });

  test('P03 accepts all three statuses together', async ({ petClient }) => {
    const response = await petClient.findByStatus(['available', 'pending', 'sold']);

    expect(response.status()).toBe(200);
    const body = (await response.json()) as PetLike[];
    expect(Array.isArray(body)).toBe(true);
    for (const pet of body) {
      expect(['available', 'pending', 'sold']).toContain(pet.status);
    }
  });

  test('P04 a newly created pet appears in the results for its status', async ({ petClient, trackPet }) => {
    const pet = buildPet({ status: 'pending' });
    trackPet(pet.id);
    await petClient.create(pet);

    const response = await petClient.findByStatus('pending');

    expect(response.status()).toBe(200);
    const body = (await response.json()) as PetLike[];
    const found = body.find((p) => p.id === pet.id);
    expect(found).toBeDefined();
    expectValidPet(found);
    expect(found).toEqual(pet);
  });

  test('P05 a status change moves the pet between result lists', async ({ petClient, trackPet }) => {
    const pet = buildPet({ status: 'available' });
    trackPet(pet.id);
    await petClient.create(pet);
    await petClient.create({ ...pet, status: 'sold' });

    const available = (await (await petClient.findByStatus('available')).json()) as PetLike[];
    const sold = (await (await petClient.findByStatus('sold')).json()) as PetLike[];

    expect(available.some((p) => p.id === pet.id)).toBe(false);
    expect(sold.some((p) => p.id === pet.id)).toBe(true);
  });

  test('P06 a deleted pet no longer appears in the results', async ({ petClient }) => {
    const pet = buildPet({ status: 'available' });
    await petClient.create(pet);
    await petClient.deleteById(pet.id!);

    const body = (await (await petClient.findByStatus('available')).json()) as PetLike[];

    expect(body.some((p) => p.id === pet.id)).toBe(false);
  });

  test('P07 a pet appears only once when several statuses are requested', async ({ petClient, trackPet }) => {
    const pet = buildPet({ status: 'available' });
    trackPet(pet.id);
    await petClient.create(pet);

    const body = (await (await petClient.findByStatus(['available', 'pending'])).json()) as PetLike[];

    expect(body.filter((p) => p.id === pet.id)).toHaveLength(1);
  });
});

test.describe('GET /pet/findByStatus - negative @negative', () => {
  test('N01 rejects an unknown status value', async ({ petClient }) => {
    expect((await petClient.findByStatus('unknown')).status()).toBe(INVALID_STATUS);
  });

  test('N02 rejects a status with the wrong case', async ({ petClient }) => {
    expect((await petClient.findByStatus('Available')).status()).toBe(INVALID_STATUS);
  });

  test('N03 rejects a numeric status', async ({ petClient }) => {
    expect((await petClient.findByStatus('1')).status()).toBe(INVALID_STATUS);
  });

  test('N04 rejects a mix of valid and invalid statuses', async ({ petClient }) => {
    expect((await petClient.findByStatus(['available', 'unknown'])).status()).toBe(INVALID_STATUS);
  });
});

test.describe('GET /pet/findByStatus - empty and missing @empty', () => {
  test('E01 rejects a missing status parameter', async ({ petClient }) => {
    expect((await petClient.findByStatus()).status()).toBe(INVALID_STATUS);
  });

  test('E02 rejects an empty status value', async ({ petClient }) => {
    expect((await petClient.findByStatus('')).status()).toBe(INVALID_STATUS);
  });

  test('E03 rejects a whitespace-only status value', async ({ petClient }) => {
    expect((await petClient.findByStatus(' ')).status()).toBe(INVALID_STATUS);
  });

  test('E04 rejects a "null" status value', async ({ petClient }) => {
    expect((await petClient.findByStatus('null')).status()).toBe(INVALID_STATUS);
  });
});
