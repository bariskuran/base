/**
 * “El ile sürükle” kaydırma: içerik imleci takip eder; delta ters işaretlenir.
 * @param {{ x: number; y: number }} startClient
 * @param {{ x: number; y: number }} currentClient
 * @param {{ scrollLeft: number; scrollTop: number }} startScroll
 */
export const computeDragScrollFromPointers = (startClient, currentClient, startScroll) => ({
    scrollLeft: startScroll.scrollLeft - (currentClient.x - startClient.x),
    scrollTop: startScroll.scrollTop - (currentClient.y - startClient.y),
});
