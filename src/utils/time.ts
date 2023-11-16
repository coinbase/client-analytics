import { TimeStone } from '../types/time';

// Gets the time value in milliseconds
export function getNow(): number {
  return new Date().getTime();
}

/**
 * The TimeStone will hold the power to understand the past, present and future
 * of the user experience. In a few words we are getting a little smarter
 * on understanding how much time a user is spending for each pagePath and session.
 *
 * Also for not colliding with any default naming system,
 * I decided to call this timeStone in honor of Doctor Strange.
 */
export const timeStone: TimeStone = {
  timeStart: getNow(),
  timeOnPagePath: 0,
  prevTimeOnPagePath: 0,
  // TODO re-visit if we need to keep storing
  // sessionDuration and sessionEnd here, it seems we don't
  // need to persist this information.
  sessionDuration: 0,
  sessionEnd: 0,
  sessionStart: 0,
  prevSessionDuration: 0,
};
