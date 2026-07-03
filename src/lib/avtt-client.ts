const AVTT_BASE_URL = "http://localhost:3000";

async function postToAVTT(path: string, payload: unknown): Promise<void> {
  await fetch(`${AVTT_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export async function sendAVTTCommand(command: Record<string, unknown>): Promise<void> {
  await postToAVTT("/command", {
    ...command,
    time: Date.now()
  });
}

export async function sendAVTTRoll(roll: Record<string, unknown>): Promise<void> {
  await postToAVTT("/roll", roll);
}

export async function sendAVTTGameLog(message: Record<string, unknown>): Promise<void> {
  await postToAVTT("/gamelog", message);
}

export async function getAVTTCombatState(): Promise<any> {
  const response = await fetch(`${AVTT_BASE_URL}/combat-state`);
  return response.json();
}
