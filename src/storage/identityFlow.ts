import { IdentityFlow, IdentityFlowProps } from "../types/identityFlow";
import { getConfig } from "./storage";
import { OptionalData } from "../types/event";

import { isEventKeyFormatValid } from "../utils/strings";

const BLOCKED_PROPS = ['action', 'component_type', 'component_name', 'context', 'logging_id'];

// num_non_hardware_accounts valid values: small | medium | large | x-large
const ALLOWED_PROPERTIES: string[] = ['num_non_hardware_accounts', 'ujs'];

const UJS_PREFIX = 'ujs_';

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
      if (ALLOWED_PROPERTIES.includes(prop)) {
        delete identityFlow[prop];
      }
    });
  }

/**
 * Appends properties to identify flow
 * @param {EventDataDefault} identityData properties to be added to identify flow. Format for each key is enforced and must be snake_case
 * @return {void}
 */
export function identifyFlow(identityData: IdentityFlow) {
    //  filter for blocked words
    const filteredProps: IdentityFlow = Object.entries(identityData).reduce((acc, entry) => {
      const [key, value] = entry;
      if (!BLOCKED_PROPS.includes(key) && ALLOWED_PROPERTIES.includes(key)) {
        //  check for snake case otherwise error_out
        if (isEventKeyFormatValid(key)) {
          return {
            ...acc,
            [key]: value,
          };
        }
        getConfig().onError(new Error(`IdentityFlow property names must have snake case format`), {
          [key]: value,
        });
        return acc;
      }
      return acc;
    }, {} as OptionalData);
  
    if (filteredProps.ujs?.length) {
      filteredProps.ujs = filteredProps.ujs.map((value: string) => `${UJS_PREFIX}${value}`);
    }
  
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