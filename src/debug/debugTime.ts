const BJ_OFFSET_MS = 8 * 60 * 60 * 1000;

export function parseDebugTime(search: string): number | null {
  const params = new URLSearchParams(search);
  const debugTime = params.get('debugTime');
  if (!debugTime) {
    return null;
  }

  const normalized = debugTime.includes('T') ? debugTime : `${debugTime}T00:00:00`;
  const utcMs = Date.parse(`${normalized}+08:00`);
  if (Number.isNaN(utcMs)) {
    return null;
  }

  return utcMs;
}

export function formatDebugClock(ms: number): string {
  const bj = new Date(ms + BJ_OFFSET_MS);
  return bj.toISOString().replace('Z', '+08:00');
}
