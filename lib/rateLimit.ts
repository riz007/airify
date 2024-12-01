const RATE_LIMIT = 5; // 5 requests per second
let lastRequestTime = 0;

export const rateLimit = async () => {
  const now = Date.now();
  const timeElapsed = now - lastRequestTime;
  if (timeElapsed < RATE_LIMIT) {
    await new Promise((resolve) =>
      setTimeout(resolve, RATE_LIMIT - timeElapsed)
    );
  }
  lastRequestTime = Date.now();
};
