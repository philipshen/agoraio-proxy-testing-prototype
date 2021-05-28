/**
 * @fileoverview API calls to the local server
 */
export async function fetchClientData() {
  const response = await fetch("client-data")
  return response.json()
}

export async function fetchSendReceiveTestData() {
  const response = await fetch("send-receive-test")
  return response.json()
}