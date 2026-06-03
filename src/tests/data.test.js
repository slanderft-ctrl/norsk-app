import { describe, it, expect } from 'vitest';

import * as topicsModule from '../data/topics.js';
import * as grammarModule from '../data/grammar-blocks.js';
import questions from '../data/questions.json';
import verbs from '../data/verbs.json';

const topics =
  topicsModule.default ||
  topicsModule.topics ||
  topicsModule.TOPICS ||
  Object.values(topicsModule).find((value) => Array.isArray(value));

const grammarBlocks =
  grammarModule.default ||
  grammarModule.grammarBlocks ||
  grammarModule.GRAMMAR_BLOCKS ||
  grammarModule.grammar ||
  Object.values(grammarModule).find((value) => value && typeof value === 'object');

describe('U04 Learning data', () => {
  it('topics list should not be empty', () => {
    expect(Array.isArray(topics)).toBe(true);
    expect(topics.length).toBeGreaterThan(0);
  });

  it('first topic should contain required fields', () => {
    const topic = topics[0];

    expect(topic).toHaveProperty('id');
    expect(topic).toHaveProperty('title');
  });

  it('grammar blocks should contain learning content', () => {
    expect(grammarBlocks).toBeDefined();
    expect(Object.keys(grammarBlocks).length).toBeGreaterThan(0);
  });
});

describe('U05 LevelTest data', () => {
  it('questions list should not be empty', () => {
    expect(Array.isArray(questions)).toBe(true);
    expect(questions.length).toBeGreaterThan(0);
  });

  it('each question should contain id, question and answer', () => {
    const q = questions[0];

    expect(q).toHaveProperty('id');
    expect(q).toHaveProperty('question');
    expect(q).toHaveProperty('answer');
  });

  it('questions should contain CEFR-like difficulty level', () => {
    const q = questions[0];

    expect(q).toHaveProperty('level');
    expect(typeof q.level).toBe('number');
  });
});

describe('U02 Dictionary data', () => {
  it('verbs list should be available', () => {
    expect(verbs).toBeDefined();
    expect(Array.isArray(verbs.verbs)).toBe(true);
  });

  it('verbs should contain Norwegian and Ukrainian fields', () => {
    const verb = verbs.verbs[0];

    expect(verb).toHaveProperty('no');
    expect(verb).toHaveProperty('ua');
  });
});