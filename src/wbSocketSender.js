
/* Author: Nahed Al Awlaki */


import { sendWebSocketMessage } from './wbserver.js';

/**
 * Sends a JSON message over WebSocket to all connected clients.
 *
 * @param {Object} jsonMessage - The message to send.
 */
export function sendWebSocketJson(jsonMessage) {
  console.log("Sending WebSocket message:", jsonMessage);
  sendWebSocketMessage(jsonMessage);
}
