/**
 * Ask Wikimedia for an image the size we are actually going to draw.
 *
 * The picks were loading their full-resolution originals — 42.8 MB across
 * eleven pictures, one of them 13.8 MB and another 10.5 MB — and then drawing
 * them into cards a couple of hundred points wide. The download is the smaller
 * half of the problem: decoding a 13.8 MB JPEG blocks the main thread, and a
 * main thread that is busy decoding cannot also be animating. That is what
 * made the intro stutter, and why it was worst on the last pane, whose picture
 * had had the least time to arrive.
 *
 * Commons serves pre-rendered thumbnails, but only at a fixed set of widths —
 * anything else is a 400. So the request is snapped up to the nearest allowed
 * size rather than passed through, which is also why callers can ask for the
 * width they want without knowing the list.
 */

/** The widths upload.wikimedia.org will actually render. */
const BUCKETS = [120, 250, 330, 500, 960, 1280, 1920];

const COMMONS = /^(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons)\/([0-9a-f])\/([0-9a-f]{2})\/(.+)$/;

/**
 * A Commons URL resized to roughly `width` points.
 *
 * Anything that is not a Commons original — a Supabase upload, a local file,
 * an already-thumbed URL — comes back untouched.
 */
export function thumb(url: string, width: number): string {
  if (!url) return url;
  // Already a thumbnail; resizing a resize would be a second round trip.
  if (url.includes("/thumb/")) return url;

  const m = COMMONS.exec(url);
  if (!m) return url;

  const [, base, a, b, name] = m;

  // Screens are mostly 2x or 3x, so ask for more pixels than points. Capped:
  // past 1280 the file grows faster than the picture improves on a phone.
  const want = Math.min(width * 2, 1280);
  const size = BUCKETS.find((w) => w >= want) ?? BUCKETS[BUCKETS.length - 1];

  return `${base}/thumb/${a}/${b}/${name}/${size}px-${name}`;
}
