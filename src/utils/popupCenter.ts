/**
 * Opens a new centered popup window with the given URL and title.
 * @param url {string} - The URL to open in the popup window.
 * @param title {string} - The title of the popup window.
 */
export const popupCenter = (url: string, title: string): void => {
  // Get the left and top positions of the current window
  const dualScreenLeft = window.screenLeft ?? window.screenX;
  const dualScreenTop = window.screenTop ?? window.screenY;

  // Get the width and height of the current window
  const width =
    window.innerWidth ?? document.documentElement.clientWidth ?? screen.width;
  const height =
    window.innerHeight ??
    document.documentElement.clientHeight ??
    screen.height;

  // Calculate the system zoom level based on the width of the window
  const systemZoom = width / window.screen.availWidth;

  // Calculate the left and top positions for the popup window
  const left = (width - 500) / 2 / systemZoom + dualScreenLeft;
  const top = (height - 550) / 2 / systemZoom + dualScreenTop;

  // Open the popup window with the calculated dimensions and positions
  const newWindow = window.open(
    url,
    title,
    `width=${500 / systemZoom},height=${
      550 / systemZoom
    },top=${top},left=${left}`
  );

  // Focus the popup window if it was opened successfully
  newWindow?.focus();
};
