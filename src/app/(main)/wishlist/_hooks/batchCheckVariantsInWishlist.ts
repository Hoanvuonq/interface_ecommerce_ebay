export async function batchCheckVariantsInWishlist(
  checkVariantsInWishlist: (ids: string[]) => Promise<Map<string, boolean>>,
  variantIds: string[],
  batchSize = 20,
  delayMs = 200 
): Promise<Map<string, boolean>> {
  const result = new Map<string, boolean>();
  for (let i = 0; i < variantIds.length; i += batchSize) {
    const batch = variantIds.slice(i, i + batchSize);
    const batchResult = await checkVariantsInWishlist(batch);
    batchResult.forEach((v, k) => result.set(k, v));
    if (i + batchSize < variantIds.length) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  return result;
}