import {
  clearIdentifyFlow,
  identifyFlow,
  identityFlow,
  removeFromIdentifyFlow,
} from './identityFlow';
import { describe, test, expect, beforeEach } from 'vitest';

describe('identityFlow', () => {
  beforeEach(() => {
    clearIdentifyFlow();
  });

  test('should clear all properties when calling clearIdentityFlow', () => {
    identifyFlow({
      developer: true,
      action: 'test',
    });
    expect(identityFlow).toEqual({
      developer: true,
      action: 'test',      
    });
    clearIdentifyFlow();
    expect(identityFlow).toEqual({});
  });

  test('should remove property when calling removeFromIdentifyFlow', () => {
    identifyFlow({
      test: 'test_step',
    });
    expect(identityFlow).toEqual({
      test: 'test_step',
    });
    removeFromIdentifyFlow(['test']);
    expect(identityFlow).toEqual({});
  });
});