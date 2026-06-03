import { describe, it, expect } from 'vitest';

import * as topicsModule from '../data/topics.js';
import * as grammarModule from '../data/grammar-blocks.js';
import questions from '../data/questions.json';
import verbs from '../data/verbs.json';

const topics =
  topicsModule.default ||
  topicsModule.topics ||
  Object.values(topicsModule).find((value) => Array.isArray(value));

const grammarBlocks = Object.values(grammarModule).filter(
  (value) =>
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    value.topic
);

describe('U04 Learning module content', () => {
  it('each topic should have at least one subtopic', () => {
    topics.forEach((topic) => {
      expect(Array.isArray(topic.subtopics)).toBe(true);
      expect(topic.subtopics.length).toBeGreaterThan(0);
    });
  });

  it('each subtopic should contain learning text', () => {
    const subtopic = topics[0].subtopics[0];

    expect(subtopic).toHaveProperty('text');
    expect(typeof subtopic.text).toBe('string');
    expect(subtopic.text.length).toBeGreaterThan(20);
  });

  it('each subtopic should contain vocabulary items', () => {
    const subtopic = topics[0].subtopics[0];

    expect(Array.isArray(subtopic.vocabulary)).toBe(true);
    expect(subtopic.vocabulary.length).toBeGreaterThan(0);
  });

  it('each subtopic should contain questions', () => {
    const subtopic = topics[0].subtopics[0];

    expect(Array.isArray(subtopic.questions)).toBe(true);
    expect(subtopic.questions.length).toBeGreaterThan(0);
  });

  it('grammar blocks should contain examples', () => {
    const block = grammarBlocks[0];

    expect(block).toHaveProperty('examples');
    expect(Array.isArray(block.examples)).toBe(true);
    expect(block.examples.length).toBeGreaterThan(0);
  });

  it('grammar blocks should contain exercises', () => {
    const block = grammarBlocks[0];

    expect(block).toHaveProperty('exercises');
    expect(Array.isArray(block.exercises)).toBe(true);
    expect(block.exercises.length).toBeGreaterThan(0);
  });
});

describe('U05 LevelTest question validation', () => {
  it('choice questions should contain options', () => {
    const choiceQuestion = questions.find((q) => q.type === 'choice');

    expect(choiceQuestion).toBeDefined();
    expect(Array.isArray(choiceQuestion.options)).toBe(true);
    expect(choiceQuestion.options.length).toBeGreaterThan(1);
  });

  it('questions should contain CEFR label', () => {
    const q = questions[0];

    expect(q).toHaveProperty('cefrLabel');
    expect(typeof q.cefrLabel).toBe('string');
  });
});

describe('U02 Dictionary data validation', () => {
  it('each verb should have Norwegian infinitive', () => {
    const verb = verbs.verbs[0];

    expect(verb.no).toBeDefined();
    expect(typeof verb.no).toBe('string');
    expect(verb.no.length).toBeGreaterThan(0);
  });

  it('each verb should have Ukrainian translation', () => {
    const verb = verbs.verbs[0];

    expect(verb.ua).toBeDefined();
    expect(typeof verb.ua).toBe('string');
    expect(verb.ua.length).toBeGreaterThan(0);
  });
});