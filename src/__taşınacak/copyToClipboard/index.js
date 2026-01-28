export const copyToClipboard = async (text, successFn, errorFn) => {
   if (!text) return;

   try {
      await navigator?.clipboard?.writeText?.(text);
      successFn?.();
   } catch (err) {
      console.error("Failed to copy text: ", err);
      errorFn?.();
   }
};
