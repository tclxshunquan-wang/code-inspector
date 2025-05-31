import type {
  InspectAgent,
  InspectChainGenerator,
} from '../types/type-agent.js';

/**
 * Generator function that creates an element chain
 * @param agent - Current inspection agent
 * @param agents - List of all available inspection agents
 * @param element - Element to inspect
 * @param generateElement - Function to generate element chain
 * @returns Element chain generator
 */
export function* elementsChainGenerator<Element = unknown>({
  agent,
  agents,
  element,
  generateElement,
}: {
  agent: InspectAgent<Element>;
  agents: InspectAgent<Element>[];
  element: Element;
  generateElement: <Element = unknown>(
    agent: InspectAgent<Element>,
    element: Element
  ) => InspectChainGenerator<Element>;
}): InspectChainGenerator<Element> {
  // Create generator using current agent and element
  const generator = generateElement(agent, element);
  while (true) {
    const next = generator.next();
    // If generator has more values, continue generating
    if (!next.done) {
      yield next.value;
      continue;
    }

    // If generator is done and has no return value, end
    if (!next.value) {
      return;
    }

    // Iterate through all agents to find one that can handle current element
    for (const agent of agents) {
      if (!agent.isAgentElement(next.value)) {
        continue;
      }
      // When suitable agent found, recursively generate new element chain
      yield* elementsChainGenerator({
        agent,
        agents,
        element: next.value,
        generateElement,
      });
      return;
    }

    return;
  }
}
