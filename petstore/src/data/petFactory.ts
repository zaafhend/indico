import { Pet } from '../types/pet';

/** Generate a unique ID for a pet. Use time to ensure uniqueness */
export function uniqueId(): number {
  return Date.now() * 1000 + Math.floor(Math.random() * 1000);
}

/** Full body request for pet creation*/
export function buildPet(overrides: Partial<Pet> = {}): Pet {
  return {
    id: uniqueId(),
    category: { id: 1, name: 'cat' },
    name: 'Mochi',
    photoUrls: ['https://imgur.com/a/H0BxoAj'],
    tags: [{ id: 1, name: 'friendly' }],
    status: 'sold',
    ...overrides,
  };
}

/** Only the required fields: name and photoUrls. */
export function buildRequiredOnlyPet(): Pet {
  return { name: 'Mochi', photoUrls: ['https://imgur.com/a/H0BxoAj'] };
}
