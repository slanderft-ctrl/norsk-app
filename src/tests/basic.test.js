import { describe, it, expect } from 'vitest';

describe('Basic test environment', () => {
  it('should run unit tests correctly', () => {
    expect(1 + 1).toBe(2);
  });

  it('should support string validation', () => {
    const email = 'user@x.no';
    expect(email).toContain('@');
  });
});