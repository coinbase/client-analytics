import { IdentityFlow, IdentityFlowProps } from '../types/identityFlow';

// left blank for now - unsure if we want to block or specifically allow any
// const BLOCKED_PROPS: string[] = [];
// const ALLOWED_PROPERTIES: string[] = [''];

/**
 * Use these object to store properties that will be attached to each event
 * This object is only stored in memory therefore it does not persist across user sessions.
 * If a user reloads the page this info will disappear
 */
export const identityFlow: IdentityFlow = {
  //  this feature is currently in alpha release
  //  in order to add properties you must submit a PR
};

/**
 * Clears identity flow by deleting properties. Delete only properties you have introduced
 * @param {string[]} properties to delete
 * @return {void}
 */
export function removeFromIdentifyFlow(properties: IdentityFlowProps[]) {
  properties.forEach((prop) => {
    delete identityFlow[prop];
  });
}

/**
 * Appends properties to identify flow
 * @param {EventDataDefault} identityData properties to be added to identify flow. Format for each key is enforced and must be snake_case
 * @return {void}
 */
export function identifyFlow(identityData: IdentityFlow) {
  //  filter for blocked words
  const filteredProps: IdentityFlow = Object.entries(identityData).reduce(
    (acc, entry) => {
      const [key, value] = entry;
      return {
        ...acc,
        [key]: value,
      };
    },
    {} as IdentityFlow
  );

  Object.assign(identityFlow, filteredProps);
}

/**
 * DANGEROUS: use `removeFromIdentifyFlow` instead.
 * Clears all entries from identify flow. Make sure you know what you are doing becuase you may remove someone's properties
 * @return {void}
 */
export function clearIdentifyFlow() {
  removeFromIdentifyFlow(Object.keys(identityFlow) as IdentityFlowProps[]);
}

/**
 * Enriches validated event data with identity flow properties
 * @param {AnalyticsValidatedData} validatedEvent
 * @return {void}
 */
export function setIdentityFlowEnrichment(validatedEvent: Event) {
  if (Object.keys(identityFlow).length > 0) {
    Object.assign(validatedEvent, identityFlow);
  }
}

export function isIdentifyFlowEmpty() {
  return !Object.keys(identityFlow).length;
}