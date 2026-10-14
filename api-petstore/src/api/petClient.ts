import { APIRequestContext, APIResponse } from '@playwright/test';
import { Pet, PetStatus } from '../types/pet';

/**
 * Thin wrapper around the /pet endpoints.
 * Paths are relative to baseURL (which ends with a slash).
 */
export class PetClient {
  constructor(private readonly request: APIRequestContext) {}

  /** POST /pet with a JSON body. `pet` is `unknown` so tests can send invalid payloads. */
  create(pet: unknown): Promise<APIResponse> {
    return this.request.post('pet', { data: pet });
  }

  /** POST /pet with a raw string body (malformed JSON, empty body, wrong content type). */
  createRaw(body: string, contentType = 'application/json'): Promise<APIResponse> {
    return this.request.post('pet', {
      data: body,
      headers: { 'Content-Type': contentType },
    });
  }

  /** DELETE /pet/{petId} with an optional api_key header. */
  deleteById(id: number | string, apiKey?: string): Promise<APIResponse> {
    return this.request.delete(`pet/${id}`, {
      headers: apiKey !== undefined ? { api_key: apiKey } : undefined,
    });
  }

  /**
   * GET /pet/findByStatus
   * Pass a string or an array (joined as comma-separated). Omit to send no status parameter.
   */
  findByStatus(status?: string | string[]): Promise<APIResponse> {
    const value = Array.isArray(status) ? status.join(',') : status;
    return this.request.get('pet/findByStatus', {
      params: value === undefined ? undefined : { status: value },
    });
  }

  /**
   * Convenience helper: looks a pet up in the findByStatus results.
   * Returns undefined when the pet is not in that status list.
   */
  async findPetById(id: number, status: PetStatus): Promise<Pet | undefined> {
    const response = await this.findByStatus(status);
    const pets = (await response.json()) as Pet[];
    return pets.find((pet) => pet.id === id);
  }
}