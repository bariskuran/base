
export const computeDragScrollFromPointers = (startClient, currentClient, startScroll) => ({
    scrollLeft: startScroll.scrollLeft - (currentClient.x - startClient.x),
    scrollTop: startScroll.scrollTop - (currentClient.y - startClient.y),
});
