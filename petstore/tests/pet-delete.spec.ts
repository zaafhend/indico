import { test, expect } from './fixtures';
import { buildPet, uniqueId } from '../src/data/petFactory';

test.describe('DELETE /pet/{petId} - positive', () => {
  test('P01 deletes an existing pet', async ({ petClient }) => {
    const pet = buildPet();
    await petClient.create(pet);

    const response = await petClient.deleteById(pet.id!);

    expect(response.status()).toBe(200);
  });

  test('P02 pet is gone after delete (not found by status)', async ({ petClient }) => {
    const pet = buildPet();
    await petClient.create(pet);
    await petClient.deleteById(pet.id!);

    expect(await petClient.findPetById(pet.id!, pet.status!)).toBeUndefined();
  });

  test('P03 deletes with an api_key header', async ({ petClient }) => {
    const pet = buildPet();
    await petClient.create(pet);

    const response = await petClient.deleteById(pet.id!, 'special-key');

    expect(response.status()).toBe(200);
  });

  test('P04 deletes without an api_key header (header is optional)', async ({ petClient }) => {
    const pet = buildPet();
    await petClient.create(pet);

    const response = await petClient.deleteById(pet.id!);

    expect(response.status()).toBe(200);
  });

  for (const status of ['available', 'pending', 'sold'] as const) {
    test(`P05 deletes a pet with status "${status}"`, async ({ petClient }) => {
      const pet = buildPet({ status });
      await petClient.create(pet);

      expect((await petClient.deleteById(pet.id!)).status()).toBe(200);
    });
  }

  test('P06 deleting one pet does not affect another', async ({ petClient, trackPet }) => {
    const petA = buildPet();
    const petB = buildPet();
    trackPet(petA.id);
    trackPet(petB.id);
    await petClient.create(petA);
    await petClient.create(petB);

    await petClient.deleteById(petB.id!);

    expect(await petClient.findPetById(petA.id!, petA.status!)).toBeDefined();
    expect(await petClient.findPetById(petB.id!, petB.status!)).toBeUndefined();
  });

  test('P07 a pet can be recreated with the same id after delete', async ({ petClient, trackPet }) => {
    const pet = buildPet();
    trackPet(pet.id);
    await petClient.create(pet);
    await petClient.deleteById(pet.id!);

    const response = await petClient.create(pet);

    expect(response.status()).toBe(200);
    expect(await petClient.findPetById(pet.id!, pet.status!)).toBeDefined();
  });
});

test.describe('DELETE /pet/{petId} - negative @negative', () => {
  test('N01 returns 404 for a non-existent id', async ({ petClient }) => {
    expect((await petClient.deleteById(uniqueId())).status()).toBe(404);
  });

  test('N02 returns 404 when deleting the same pet twice', async ({ petClient }) => {
    const pet = buildPet();
    await petClient.create(pet);

    expect((await petClient.deleteById(pet.id!)).status()).toBe(200);
    expect((await petClient.deleteById(pet.id!)).status()).toBe(404);
  });

  test('N03 returns 400 for a non-numeric id (per docs)', async ({ petClient }) => {
    expect((await petClient.deleteById('abc')).status()).toBe(400);
  });

  test('N04 returns 400 for a decimal id (per docs)', async ({ petClient }) => {
    expect((await petClient.deleteById('1.5')).status()).toBe(400);
  });

  test('N05 returns 400 for special characters in the id (per docs)', async ({ petClient }) => {
    expect((await petClient.deleteById('!@#')).status()).toBe(400);
  });
});

test.describe('DELETE /pet/{petId} - empty and null @empty', () => {
  test('E01 returns 400 for a "null" id (per docs)', async ({ petClient }) => {
    expect((await petClient.deleteById('null')).status()).toBe(400);
  });

  test('E02 returns 400 for a whitespace-only id (per docs)', async ({ petClient }) => {
    expect((await petClient.deleteById('%20')).status()).toBe(400);
  });

  test('E03 deletes a pet when api_key header is empty', async ({ petClient }) => {
    const pet = buildPet();
    await petClient.create(pet);

    expect((await petClient.deleteById(pet.id!, '')).status()).toBe(200);
  });
});
