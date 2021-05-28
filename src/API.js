/**
 * @fileoverview API calls to the local server
 */
export async function fetchSendReceiveTestData() {
  const response = await fetch("send-receive-test")
  return response.json()
}