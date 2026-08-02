const PLAYER_TRACKER_BASE_URL =
  "http://localhost:3001";

export type PlayerInfoPopupCommand = {
  image: string;
  title: string;
};

export async function sendPlayerInfoPopupCommand(
  command: PlayerInfoPopupCommand
): Promise<void> {
  const response =
    await fetch(
      `${PLAYER_TRACKER_BASE_URL}/api/info-popup-command`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(command)
      }
    );

  if (!response.ok) {
    const responseText =
      await response.text();

    throw new Error(
      `Player Tracker returned ${response.status}: ${
        responseText || response.statusText
      }`
    );
  }
}
