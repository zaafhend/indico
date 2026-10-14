import { test as base } from '@playwright/test';
import { PetClient } from '../src/api/petClient';

type Fixtures = {
  petClient: PetClient;
  trackPet: (id: number | undefined) => void;
};

export const test = base.extend<Fixtures>({
  petClient: async ({ request }, use) => {
    await use(new PetClient(request));
  },

  trackPet: async ({ petClient }, use) => {
    const ids: number[] = [];
    await use((id) => {
      if (id !== undefined) ids.push(id);
    });
    for (const id of ids) {
      await petClient.deleteById(id);
    }
  },
});

export { expect } from '@playwright/test';
