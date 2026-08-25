import Link from "next/link";
import Reveal from "@/components/landing/Reveal";
import { Bookmark, Footer, Nav, Play, Tick } from "@/components/landing/Chrome";

/* Sample marks used to show the core object of the product. */
const MARKS = [
  {
    img: "/hero-overlook.webp",
    alt: "A wooden bench on a stone terrace above a terracotta-roofed old town at golden hour.",
    kind: "Bench",
    name: "The one with the whole city in it",
    coords: "38.7139°N 9.1394°W",
    who: "marta.r",
    saves: 214,
    video: false,
  },
  {
    img: "/spot-ridge.webp",
    alt: "A weathered bench on a grassy mountain ridge looking over layered valleys.",
    kind: "Viewpoint",
    name: "Ridge bench, last light",
    coords: "46.5619°N 7.9822°E",
    who: "fellrunner",
    saves: 168,
    video: true,
  },
  {
    img: "/spot-summit.webp",
    alt: "A flat rock ledge on a mountaintop overlooking a valley filled with low cloud.",
    kind: "Trail rest",
    name: "Flat rock above the cloud",
    coords: "45.9237°N 6.8694°E",
    who: "tomaslx",
    saves: 91,
    video: false,
  },
  {
    img: "/spot-river.webp",
    alt: "A metal bench on a riverside promenade at dusk with streetlights coming on.",
    kind: "Bench",
    name: "River wall, after work",
    coords: "51.5072°N 0.1276°W",
    who: "ade.walks",
    saves: 77,
    video: false,
  },
  {
    img: "/spot-fog.webp",
    alt: "A lone wooden bench half-swallowed in mist on a ridge trail.",
    kind: "Viewpoint",
    name: "Nothing to see, worth it anyway",
    coords: "54.4609°N 3.0886°W",
    who: "hollyfoot",
    saves: 143,
    video: true,
  },
  {
    img: "/spot-autumn.webp",
    alt: "A green park bench under a tree dropping yellow leaves.",
    kind: "Bench",
    name: "Leaf bench, third week of October",
    coords: "52.3676°N 4.9041°E",
    who: "j.okonkwo",
    saves: 58,
    video: false,
  },
];

export default function Home() {
  return (
    <>
      <Reveal />
      <div className="gridfield" aria-hidden="true" />
      <Nav />

      <main>
        {/* ---------------- HERO ---------------- */}
        <section className="hero">
          <div className="shell">
            <div className="hero__grid">
              <div className="reveal">
                <img
                  className="hero__mark"
                  src="/logo.webp"
                  alt=""
                  width={128}
                  height={128}
                  fetchPriority="high"
                />
                <span className="eyebrow">iPhone &amp; Android &middot; free</span>
                <h1 className="display d-hero mt-sm">
                  Somebody already
                  <br />
                  found <span className="tint">the good spot.</span>
                </h1>
                <p className="lede mt-md">
                  A bench with the whole city in it. A flat rock above the cloud.
                  Someone marks it with a photo, drops a pin, and everyone else
                  gets to sit there too.
                </p>
                <div className="stores mt-lg">
                  <a className="store" href="#join">
                    <AppleGlyph />
                    <span>
                      <span className="store__sub">Download for</span>
                      <span className="store__name">iPhone</span>
                    </span>
                  </a>
                  <a className="store" href="#join">
                    <AndroidGlyph />
                    <span>
                      <span className="store__sub">Get it on</span>
                      <span className="store__name">Android</span>
                    </span>
                  </a>
                </div>
                <p className="meta mt-sm">
                  Or <Link className="link" href="/map">browse the map on the web</Link>
                </p>

                <div className="hero__stats">
                  <div className="hero__stat">
                    <span className="n">Photo or video</span>
                    <span className="meta">Every mark carries one</span>
                  </div>
                  <div className="hero__stat">
                    <span className="n">Five kinds</span>
                    <span className="meta">Not only benches</span>
                  </div>
                  <div className="hero__stat">
                    <span className="n">Free to mark</span>
                    <span className="meta">Always</span>
                  </div>
                </div>
              </div>

              {/* The product itself */}
              <div className="phone-stage reveal" style={{ "--i": 1 } as React.CSSProperties}>
                <PhoneMock />
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- LIVE FEED ---------------- */}
        <section className="section" style={{ paddingBottom: 0 }}>
          <div className="shell">
            <div className="row between wrap gap-sm reveal">
              <h2 className="display d-2">Marked this week</h2>
              <Link className="link" href="/map">See them on the map</Link>
            </div>
            <div className="feed-scroll mt-md reveal" style={{ "--i": 1 } as React.CSSProperties}>
              {MARKS.map((m) => (
                <SpotCard key={`feed-${m.name}`} {...m} />
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- WHAT IT IS ---------------- */}
        <section className="section" id="what">
          <div className="shell">
            <div className="split split--lead">
              <div className="reveal">
                <span className="eyebrow">What it is</span>
                <h2 className="display d-1 mt-sm">
                  Like a map everyone
                  <br />
                  <span className="tint">writes on.</span>
                </h2>
              </div>
              <div className="reveal" style={{ "--i": 1 } as React.CSSProperties}>
                <p className="lede">
                  Every map already knows where the benches are. None of them
                  know which ones are any good.
                </p>
                <p className="body-copy mt-md">
                  That part only exists in people&rsquo;s heads &mdash; the one
                  your neighbour walks to on a Sunday, the ledge your climbing
                  partner stops at every time. Perch is where that gets written
                  down: you drop a pin, add a photo or a short video, and it
                  joins a map anyone can open.
                </p>
                <p className="body-copy mt-md">
                  Follow the people whose taste you trust and their finds turn
                  up in your feed. Save the ones you want to reach. The map gets
                  better every time somebody sits down.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- HOW ---------------- */}
        <section className="section band" id="how">
          <div className="shell">
            <div className="reveal" style={{ maxWidth: "36ch" }}>
              <span className="eyebrow">How it works</span>
              <h2 className="display d-1 mt-sm">Three taps, then you sit.</h2>
            </div>
            <ol className="steps mt-xl">
              {[
                [
                  "Find one nearby",
                  "Open the map. Every spot people have marked around you, with the photo they took from it.",
                ],
                [
                  "Go and stop there",
                  "This is the part the app cannot do for you. It is also the entire point.",
                ],
                [
                  "Mark it",
                  "Drop a pin, take a photo or a few seconds of video, name it. Ten seconds and it is on the map for everyone.",
                ],
              ].map(([title, body], i) => (
                <li key={title} className="reveal" style={{ "--i": i } as React.CSSProperties}>
                  <span className="steps__n">{`STEP ${i + 1}`}</span>
                  <h3 className="display d-2">{title}</h3>
                  <p className="body-muted mt-sm">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------------- KINDS ---------------- */}
        <section className="section" id="kinds">
          <div className="shell">
            <div className="reveal" style={{ maxWidth: "44ch" }}>
              <span className="eyebrow">What counts as a perch</span>
              <h2 className="display d-1 mt-sm">
                A rock is a bench if the view is good enough.
              </h2>
              <p className="body-muted mt-md">
                Benches are where this started, but nobody on a ridge cares
                whether the thing they are sitting on was installed by a council.
              </p>
            </div>

            <div className="cols cols--3 mt-xl">
              {[
                ["Bench", "Parks, promenades, bus stops, churchyards. The classic.", "bench"],
                ["Viewpoint", "Anywhere the reason to stop is what you can see.", "viewpoint"],
                ["Trail rest", "A log, a boulder, a wall halfway up the climb.", "trail_rest"],
                ["Picnic table", "Somewhere to put lunch down.", "picnic"],
                ["Shelter", "Bothies, bus shelters, anything with a roof when it turns.", "shelter"],
                ["Something else", "Mark it anyway and tell us what it is.", null],
              ].map(([title, body], i) => (
                <article
                  key={title as string}
                  className="card card--hover pad reveal"
                  style={{ "--i": i % 3 } as React.CSSProperties}
                >
                  <h3 className="display d-3">{title}</h3>
                  <p className="body-muted mt-xs" style={{ fontSize: "0.9375rem" }}>
                    {body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- HIKERS ---------------- */}
        <section className="section band" id="trails">
          <div className="shell">
            <div className="split">
              <div className="card reveal" style={{ overflow: "hidden", padding: 0 }}>
                <img
                  src="/spot-ridge.webp"
                  alt="A weathered bench on a grassy mountain ridge looking out over layered valleys at late afternoon."
                  width={2400}
                  height={1792}
                  loading="lazy"
                  style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover" }}
                />
              </div>
              <div className="reveal" style={{ "--i": 1 } as React.CSSProperties}>
                <span className="eyebrow">For hikers</span>
                <h2 className="display d-1 mt-sm">
                  The map ends where
                  <br />
                  <span className="tint">the trail starts.</span>
                </h2>
                <p className="body-copy mt-md">
                  Trail apps route you to a summit. They will not tell you there
                  is a flat rock forty minutes up with the whole valley in front
                  of it, or that the bench at the col is the only shelter for an
                  hour in either direction.
                </p>
                <p className="body-copy mt-md">
                  Marks work offline &mdash; take the photo with no signal, and
                  it uploads when you drop back into service. Save a route&rsquo;s
                  spots before you set off and they are on your phone at the top.
                </p>
                <div className="row wrap gap-xs mt-lg">
                  <span className="tag tag--pine">Offline capture</span>
                  <span className="tag tag--pine">Saved for the walk</span>
                  <span className="tag">Elevation on every spot</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- PRICING ---------------- */}
        <section className="section" id="pricing">
          <div className="shell">
            <div className="reveal" style={{ maxWidth: "40ch" }}>
              <span className="eyebrow">Pricing</span>
              <h2 className="display d-1 mt-sm">Free to sit. Pay to plan.</h2>
              <p className="body-muted mt-md">
                No ads on a map about quiet places. Marking is free forever,
                because marking is what makes the map worth opening.
              </p>
            </div>

            <div className="prices mt-xl">
              <div className="card pad-lg stack reveal">
                <span className="meta">Perch</span>
                <p className="price">Free</p>
                <p className="body-muted">Everything that fills the map.</p>
                <ul className="ticks mt-md">
                  {[
                    "The whole map, everywhere",
                    "Mark spots with photo or video",
                    "Follow people and save spots",
                    "Comment and add attributes",
                  ].map((t) => (
                    <li key={t}><Tick />{t}</li>
                  ))}
                </ul>
              </div>

              <div className="card card--feature pad-lg stack reveal" style={{ "--i": 1 } as React.CSSProperties}>
                <div className="row between gap-xs">
                  <span className="meta">Perch Pro</span>
                  <span className="tag tag--clay">Launch price</span>
                </div>
                <p className="price">
                  &euro;3.50<span className="price__per">/month</span>
                </p>
                <p className="body-muted">Or &euro;29 a year.</p>
                <ul className="ticks mt-md">
                  {[
                    "Offline maps and saved spots for a whole region",
                    "Rest routing — never walk further than you can",
                    "Shade and sun by time of day",
                    "Private collections and trip planning",
                    "Full-resolution video marks",
                  ].map((t) => (
                    <li key={t}><Tick />{t}</li>
                  ))}
                </ul>
                <a className="btn btn--primary mt-lg" href="#join">Start free for 30 days</a>
              </div>

              <div className="card pad-lg stack reveal" style={{ "--i": 2 } as React.CSSProperties}>
                <span className="meta">For parks &amp; trails</span>
                <p className="price">Later</p>
                <p className="body-muted">
                  Councils and trail associations keep asking where people
                  actually stop. We will have the answer before we sell it.
                </p>
                <ul className="ticks mt-md">
                  {["Rest-point inventories", "Shade gap analysis", "Accessibility exports"].map((t) => (
                    <li key={t}><Tick />{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- JOIN ---------------- */}
        <section className="section" id="join">
          <div className="shell">
            <div className="card reveal">
              <div className="cta">
                <span className="eyebrow">Early access</span>
                <h2 className="display d-1 mt-sm">
                  Where&rsquo;s your spot?
                  <br />
                  <span className="tint">Put it on the map.</span>
                </h2>
                <p className="body-muted mt-md" style={{ maxWidth: "44ch" }}>
                  Tell us where you walk and we will open your area next. First
                  hundred people in each city get Pro for a year.
                </p>
                <form className="form-row mt-lg" action="#" method="post">
                  <label className="sr-only" htmlFor="email">Email address</label>
                  <input id="email" name="email" type="email" required placeholder="you@example.com" autoComplete="email" />
                  <label className="sr-only" htmlFor="city">Where you walk</label>
                  <input id="city" name="city" type="text" placeholder="Where you walk" />
                  <button className="btn btn--clay" type="submit">Join</button>
                </form>
                <p className="meta mt-md">One email when your area opens. Nothing else.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

/* ---------- the app, on a phone ---------- */

function PhoneMock() {
  return (
    <div className="phone" role="img" aria-label="The Perch app showing a map of marked spots in Lisbon, with a spot card open.">
      <div className="phone__screen">
        <div className="phone__notch" aria-hidden="true" />
        <div className="phone__map">
          {/* solid pins have photos, hollow ones are waiting */}
          <span className="phone__pin" style={{ top: "22%", left: "26%" }} />
          <span className="phone__pin" style={{ top: "34%", left: "62%" }} />
          <span className="phone__pin" style={{ top: "46%", left: "38%" }} />
          <span className="phone__pin phone__pin--hollow" style={{ top: "28%", left: "76%" }} />
          <span className="phone__pin phone__pin--hollow" style={{ top: "52%", left: "17%" }} />
          <span className="phone__pin phone__pin--hollow" style={{ top: "18%", left: "48%" }} />

          <div className="phone__chips">
            <span className="phone__chip phone__chip--on">Everything</span>
            <span className="phone__chip">Bench</span>
            <span className="phone__chip">Viewpoint</span>
          </div>

          <div className="phone__card">
            <img src="/hero-overlook.webp" alt="" width={2752} height={1536} loading="lazy" />
            <div className="phone__cardbody">
              <p className="phone__cardtitle">The one with the whole city in it</p>
              <p className="phone__cardmeta">38.7139°N 9.1394°W · @marta.r</p>
            </div>
          </div>
        </div>

        <div className="phone__tabs" aria-hidden="true">
          <TabGlyph name="map" on />
          <TabGlyph name="feed" />
          <span className="phone__capture">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5.5v13M5.5 12h13" />
            </svg>
          </span>
          <TabGlyph name="bookmark" />
          <TabGlyph name="person" />
        </div>
      </div>
    </div>
  );
}

function TabGlyph({ name, on }: { name: string; on?: boolean }) {
  const paths: Record<string, React.ReactNode> = {
    map: (
      <>
        <path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20z" />
        <path d="M9 4v13.5M15 6.5V20" />
      </>
    ),
    feed: <path d="M4 5.5h16M4 12h16M4 18.5h10" />,
    bookmark: <path d="M6 3.5h12v17l-6-4.5-6 4.5z" />,
    person: (
      <>
        <circle cx="12" cy="8" r="3.6" />
        <path d="M4.8 20.2a7.4 7.4 0 0 1 14.4 0" />
      </>
    ),
  };

  return (
    <svg
      className={`phone__tab${on ? " phone__tab--on" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

/* Simple platform glyphs — deliberately not reproductions of the official
   App Store / Google Play badge artwork. */
function AppleGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.4 12.7c0-2.2 1.8-3.3 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.8-3.4.8s-1.8-.8-2.9-.8c-1.5 0-2.9.9-3.7 2.2-1.6 2.7-.4 6.8 1.1 9 .7 1.1 1.6 2.3 2.7 2.2 1.1 0 1.5-.7 2.8-.7s1.7.7 2.9.7 2-1.1 2.7-2.1c.8-1.2 1.2-2.4 1.2-2.5-.1 0-2.2-.9-2.2-3.4zM14.2 5.9c.6-.7 1-1.7.9-2.7-.9 0-2 .6-2.6 1.3-.6.6-1.1 1.6-.9 2.6 1 .1 2-.5 2.6-1.2z" />
    </svg>
  );
}

function AndroidGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <path d="M4.5 10.5v6.2h15V10.5" />
      <path d="M4.5 10.5a7.5 7.5 0 0 1 15 0z" />
      <path d="M7.6 4.2l1.5 2.4M16.4 4.2l-1.5 2.4" />
      <circle cx="9.2" cy="8.2" r=".85" fill="currentColor" stroke="none" />
      <circle cx="14.8" cy="8.2" r=".85" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ---------- the core object ---------- */

function SpotCard({
  img,
  alt,
  kind,
  name,
  coords,
  who,
  saves,
  video,
}: {
  img: string;
  alt: string;
  kind: string;
  name: string;
  coords: string;
  who: string;
  saves: number;
  video: boolean;
}) {
  return (
    <article className="spot">
      <div className="spot__media">
        <img src={img} alt={alt} width={2400} height={1792} loading="lazy" />
        <span className="spot__kind">{kind}</span>
        {video && (
          <span className="spot__play" aria-label="Video mark">
            <Play />
          </span>
        )}
      </div>
      <div className="spot__body">
        <h3 className="display d-3">{name}</h3>
        <p className="meta mt-xs">{coords}</p>
        <div className="spot__row mt-sm">
          <span className="spot__who">
            <span className="avatar" aria-hidden="true">
              {who.slice(0, 1).toUpperCase()}
            </span>
            @{who}
          </span>
          <span className="spot__saves">
            <Bookmark />
            {saves}
          </span>
        </div>
      </div>
    </article>
  );
}
