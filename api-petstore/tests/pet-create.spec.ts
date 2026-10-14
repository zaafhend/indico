import { test, expect } from './fixtures';
import { buildPet, buildRequiredOnlyPet, uniqueId } from '../src/data/petFactory';
import { expectValidPet } from '../src/utils/assertions';
import { PetStatus } from '../src/types/pet';

// Per the Swagger docs, invalid input on POST /pet returns 405.
const INVALID_INPUT = 405;

test.describe('POST /pet - positive', () => {
  test('P01 creates a pet with the full body', async ({ petClient, trackPet }) => {
    const pet = buildPet();
    trackPet(pet.id);

    const response = await petClient.create(pet);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expectValidPet(body);
    expect(body).toEqual(pet);
  });

  test('P02 creates a pet with required fields only', async ({ petClient, trackPet }) => {
    const response = await petClient.create(buildRequiredOnlyPet());

    expect(response.status()).toBe(200);
    const body = await response.json();
    trackPet(body.id);
    expectValidPet(body);
    expect(body.name).toBe('Mochi');
  });

  for (const status of ['available', 'pending', 'sold'] as PetStatus[]) {
    test(`P03 creates a pet with status "${status}"`, async ({ petClient, trackPet }) => {
      const pet = buildPet({ status });
      trackPet(pet.id);

      const response = await petClient.create(pet);

      expect(response.status()).toBe(200);
      expect((await response.json()).status).toBe(status);
    });
  }

  test('P04 creates a pet with multiple photoUrls and tags', async ({ petClient, trackPet }) => {
    const pet = buildPet({
      photoUrls: ['https://example.com/1.jpg', 'https://example.com/2.jpg', 'https://example.com/3.jpg'],
      tags: [
        { id: 1, name: 'friendly' },
        { id: 2, name: 'small' },
        { id: 3, name: 'vaccinated' },
      ],
    });
    trackPet(pet.id);

    const response = await petClient.create(pet);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.photoUrls).toEqual(pet.photoUrls);
    expect(body.tags).toEqual(pet.tags);
  });

  test('P05 generates an id when none is sent', async ({ petClient, trackPet }) => {
    const { id, ...petWithoutId } = buildPet();

    const response = await petClient.create(petWithoutId);

    expect(response.status()).toBe(200);
    const body = await response.json();
    trackPet(body.id);
    expect(Number.isInteger(body.id)).toBe(true);
  });

  test('P06 keeps special characters in name', async ({ petClient, trackPet }) => {
    const pet = buildPet({ name: '<pet>' });
    trackPet(pet.id);

    const response = await petClient.create(pet);

    expect(response.status()).toBe(200);
    expect((await response.json()).name).toBe(pet.name);
  });

  test('P07 persists the pet (create, then it is found by status)', async ({ petClient, trackPet }) => {
    const pet = buildPet();
    trackPet(pet.id);

    await petClient.create(pet);
    const found = await petClient.findPetById(pet.id!, pet.status!);

    expect(found).toEqual(pet);
  });

  test('P08 accepts an empty tags array and an empty category object', async ({ petClient, trackPet }) => {
    const pet = buildPet({ tags: [], category: {} });
    trackPet(pet.id);

    const response = await petClient.create(pet);

    expect(response.status()).toBe(200);
  });
});

test.describe('POST /pet - negative @negative', () => {
  test('N01 rejects a body without name', async ({ petClient }) => {
    const { name, ...invalid } = buildPet();
    expect((await petClient.create(invalid)).status()).toBe(INVALID_INPUT);
  });

  test('N02 rejects a body without photoUrls', async ({ petClient }) => {
    const { photoUrls, ...invalid } = buildPet();
    expect((await petClient.create(invalid)).status()).toBe(INVALID_INPUT);
  });

  test('N03 rejects an invalid status value', async ({ petClient }) => {
    const invalid = { ...buildPet(), status: 'unknown' };
    expect((await petClient.create(invalid)).status()).toBe(INVALID_INPUT);
  });

  test('N04 rejects id sent as a string', async ({ petClient }) => {
    const invalid = { ...buildPet(), id: 'abc' };
    expect((await petClient.create(invalid)).status()).toBe(INVALID_INPUT);
  });

  test('N05 rejects name sent as a number', async ({ petClient }) => {
    const invalid = { ...buildPet({ id: uniqueId() }), name: 123 };
    expect((await petClient.create(invalid)).status()).toBe(INVALID_INPUT);
  });

  test('N06 rejects photoUrls sent as a string', async ({ petClient }) => {
    const invalid = { ...buildPet(), photoUrls: 'https://example.com/a.jpg' };
    expect((await petClient.create(invalid)).status()).toBe(INVALID_INPUT);
  });

  test('N07 rejects tags sent as an object', async ({ petClient }) => {
    const invalid = { ...buildPet(), tags: { id: 1, name: 'x' } };
    expect((await petClient.create(invalid)).status()).toBe(INVALID_INPUT);
  });

  test('N08 rejects malformed JSON', async ({ petClient }) => {
    const response = await petClient.createRaw('{"name": "Mochi", "photoUrls": ');
    expect(response.status()).toBe(INVALID_INPUT);
  });
});

test.describe('POST /pet - empty and null @empty', () => {
  test('E01 rejects an empty JSON object', async ({ petClient }) => {
    expect((await petClient.create({})).status()).toBe(INVALID_INPUT);
  });

  test('E02 rejects an empty body', async ({ petClient }) => {
    expect((await petClient.createRaw('')).status()).toBe(INVALID_INPUT);
  });

  test('E03 rejects null name', async ({ petClient }) => {
    const invalid = { ...buildPet(), name: null };
    expect((await petClient.create(invalid)).status()).toBe(INVALID_INPUT);
  });

  test('E04 rejects null photoUrls', async ({ petClient }) => {
    const invalid = { ...buildPet(), photoUrls: null };
    expect((await petClient.create(invalid)).status()).toBe(INVALID_INPUT);
  });

  test('E05 rejects an empty status string', async ({ petClient }) => {
    const invalid = { ...buildPet(), status: '' };
    expect((await petClient.create(invalid)).status()).toBe(INVALID_INPUT);
  });
});
