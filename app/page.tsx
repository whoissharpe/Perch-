import Link from "next/link";
import Reveal from "@/components/landing/Reveal";
import { Arrow, Footer, Nav } from "@/components/landing/Chrome";

export default function Home() {
  return (
    <>
      <Reveal />
      <Nav />

      <main id="main">
        {/* ---------------- HERO ---------------- */}
        <section className="hero">
          <div className="shell">
            <div className="hero__head reveal">
              <span className="eyebrow">Lisbon first &middot; seeded from OpenStreetMap</span>
              <h1 className="display d-hero mt-md">
                Every good place
                <br />
                <em className="italic-swap">to sit down.</em>
              </h1>
              <p className="lede mt-md">
                Not every bench. The ones with the view, the shade and the
                quiet &mdash; rated by the people who actually sat there.
              </p>
              <div className="row wrap gap-sm mt-lg">
                <a className="btn btn--primary" href="#waitlist">
                  Join the waitlist
                  <Arrow />
                </a>
                <Link className="btn btn--ghost" href="/map">
                  Open the Lisbon map
                  <Arrow />
                </Link>
              </div>
            </div>
          </div>

          {/* Image sits in a tray, with a real product card breaking its edge */}
          <div className="hero__plate reveal" style={{ "--i": 1 } as React.CSSProperties}>
            <div className="shell">
              <div className="bezel">
                <div className="bezel__core hero__frame">
                  <img
                    src="/hero-overlook.webp"
                    alt="A weathered wooden bench on a stone terrace, looking down over a terracotta-roofed coastal old town at golden hour."
                    width={2752}
                    height={1536}
                    fetchPriority="high"
                  />
                </div>
              </div>

              <aside className="bench-card" aria-label="Example bench rating">
                <div className="row gap-xs" style={{ justifyContent: "space-between" }}>
                  <span className="meta">Miradouro terrace</span>
                  <span className="meta">38.7139, &minus;9.1394</span>
                </div>
                <p className="bench-card__name">The one with the whole city in it</p>
                <dl className="axes">
                  <div className="axis">
                    <dt>View</dt>
                    <dd><Dots filled={5} /></dd>
                  </div>
                  <div className="axis">
                    <dt>Shade</dt>
                    <dd><Dots filled={2} /></dd>
                  </div>
                  <div className="axis">
                    <dt>Comfort</dt>
                    <dd><Dots filled={4} /></dd>
                  </div>
                </dl>
                <div className="bench-card__foot">
                  <span className="tag tag--moss">Backrest</span>
                  <span className="tag">Step-free approach</span>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* ---------------- FACT STRIP ---------------- */}
        <section className="strip">
          <div className="shell">
            <ul className="strip__list">
              {[
                ["Three axes", "View, shade, comfort. Not five meaningless stars."],
                ["Open data", "Seeded from OpenStreetMap, ODbL. Never an empty map."],
                ["One city", "Lisbon, properly. Then wherever you are."],
              ].map(([title, body], i) => (
                <li key={title} className="reveal" style={{ "--i": i } as React.CSSProperties}>
                  {/* No numerals here — these are three parallel facts, not a
                      sequence. Numbering them would imply an order that is not
                      real. The steps in #how are numbered because those are. */}
                  <h3 className="strip__title">{title}</h3>
                  <p className="body-muted">{body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------- THE REST LAYER ---------------- */}
        <section className="section" id="rest">
          <div className="shell">
            <div className="split">
              <div className="split__lead reveal">
                <span className="eyebrow">The thesis</span>
                <h2 className="display d-1 mt-md">
                  A bench is not the point.
                  <br />
                  <em className="italic-swap">Stopping is.</em>
                </h2>
              </div>
              <div className="split__body reveal" style={{ "--i": 1 } as React.CSSProperties}>
                <p className="lede">
                  Nobody has ever wanted a bench. They wanted to stop walking.
                </p>
                <p className="body-muted mt-md">
                  Which is why the interesting map is not &ldquo;where are the
                  benches&rdquo; &mdash; open data mostly answers that already.
                  It is <em>where can a person actually stop</em>: with a back to
                  lean on, shade at two in the afternoon, a step-free approach,
                  and something worth looking at.
                </p>
                <p className="body-muted mt-md">
                  Those attributes exist almost nowhere. That is the gap Perch
                  fills, and the reason the map gets more valuable every time
                  somebody sits down.
                </p>
                <div className="quiet-stats mt-lg">
                  <div>
                    <span className="quiet-stats__n">2bn</span>
                    <span className="body-muted">
                      people over 60 by 2050, most of whom plan a walk around
                      where they can rest.
                    </span>
                  </div>
                  <div>
                    <span className="quiet-stats__n">0</span>
                    <span className="body-muted">
                      major mapping products that will route you along a path
                      with places to sit.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- BENTO ---------------- */}
        <section className="section" id="features" style={{ paddingTop: 0 }}>
          <div className="shell">
            <div className="bento bento--wide-left">
              <article className="bezel bezel--interactive reveal">
                <div className="bezel__core card-photo">
                  <img
                    src="/bench-plaza.webp"
                    alt="A bench under a large plane tree, dappled light falling across mosaic paving."
                    width={2400}
                    height={1792}
                    loading="lazy"
                  />
                  <div className="pad-lg">
                    <span className="eyebrow eyebrow--plain">Never empty</span>
                    <h3 className="display d-2 mt-sm">The map arrives full</h3>
                    <p className="body-muted mt-sm">
                      Day one, every bench OpenStreetMap knows about is already
                      on it. You are not asked to build a database before the
                      product does anything for you &mdash; you are asked to
                      tell us which ones are good.
                    </p>
                  </div>
                </div>
              </article>

              <article className="bezel bezel--interactive reveal" style={{ "--i": 1 } as React.CSSProperties}>
                <div className="bezel__core pad-lg">
                  <h3 className="display d-2">Rate what matters</h3>
                  <p className="body-muted mt-sm">
                    Three axes, because three things decide whether a bench is
                    worth walking to.
                  </p>
                  <dl className="axes mt-md">
                    <div className="axis"><dt>View</dt><dd><Dots filled={4} /></dd></div>
                    <div className="axis"><dt>Shade</dt><dd><Dots filled={3} /></dd></div>
                    <div className="axis"><dt>Comfort</dt><dd><Dots filled={5} /></dd></div>
                  </dl>
                </div>
              </article>

              <article className="bezel bezel--interactive reveal" style={{ "--i": 2 } as React.CSSProperties}>
                <div className="bezel__core pad-lg">
                  <h3 className="display d-2">Collections</h3>
                  <p className="body-muted mt-sm">
                    Sequences worth walking. Built by people who live there, not
                    generated from a template.
                  </p>
                  <ul className="collection-list mt-md">
                    <li><span>Sunset benches, Alfama</span><span className="meta">11</span></li>
                    <li><span>Shade at 2pm, Baixa</span><span className="meta">18</span></li>
                    <li><span>Step-free river walk</span><span className="meta">7</span></li>
                  </ul>
                </div>
              </article>

              <article className="bezel bezel--interactive reveal" style={{ "--i": 3 } as React.CSSProperties}>
                <div className="bezel__core pad-lg">
                  <h3 className="display d-2">Offline</h3>
                  <p className="body-muted mt-sm">
                    The map you need when you are tired is the one that works
                    with two bars and 4% battery.
                  </p>
                </div>
              </article>

              <article className="bezel bezel--interactive reveal" style={{ "--i": 4 } as React.CSSProperties}>
                <div className="bezel__core pad-lg">
                  <h3 className="display d-2">Add what the data misses</h3>
                  <p className="body-muted mt-sm">
                    Open data knows a bench exists. It rarely knows whether it
                    has a backrest, an armrest to push up from, or a kerb in the
                    way. One tap each, and the map becomes something no
                    satellite can produce.
                  </p>
                  <div className="row wrap gap-xs mt-md">
                    {["Backrest", "Armrests", "Step-free", "Shaded 2pm", "Water nearby", "Quiet"].map((t) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ---------------- HOW ---------------- */}
        <section className="section" id="how">
          <div className="shell">
            <div className="reveal" style={{ maxWidth: "40ch" }}>
              <span className="eyebrow">How it works</span>
              <h2 className="display d-1 mt-md">Three taps, then you sit.</h2>
            </div>
            <ol className="steps mt-xl">
              {[
                ["Find one near you", "Open the map. Everything within a short walk is already there, with whatever is known about it."],
                ["Sit down", "This is the part the app cannot help with. It is also the point."],
                ["Say if it was any good", "Three dots for view, shade and comfort. A photo if the light was doing something. Ten seconds."],
              ].map(([title, body], i) => (
                <li key={title} className="reveal" style={{ "--i": i } as React.CSSProperties}>
                  <span className="steps__n">{`0${i + 1}`}</span>
                  <h3 className="display d-2">{title}</h3>
                  <p className="body-muted mt-sm">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------------- ACCESSIBILITY ---------------- */}
        <section className="section band" id="access">
          <div className="shell">
            <div className="feature-split">
              <div className="bezel reveal">
                <div className="bezel__core">
                  <img
                    src="/bench-coast.webp"
                    alt="A plain wooden bench alone on a coastal clifftop path at dusk, facing calm water."
                    width={2400}
                    height={1792}
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="reveal" style={{ "--i": 1 } as React.CSSProperties}>
                <span className="eyebrow">Rest routing</span>
                <h2 className="display d-1 mt-md">
                  &ldquo;Can I make it
                  <br />
                  <em className="italic-swap">that far?&rdquo;</em>
                </h2>
                <p className="body-muted mt-md">
                  For a lot of people that question decides whether they leave
                  the house. Bad knees, a heart condition, a late pregnancy,
                  eighty-three years old. The distance between places to sit is
                  the difference between a walk and a day indoors.
                </p>
                <p className="body-muted mt-md">
                  Perch Pro plans a route by rest, not by speed &mdash; never
                  more than your chosen distance between one bench and the next,
                  with the step-free approaches marked. It is the feature this
                  whole map is really for.
                </p>
                <a className="btn btn--ghost mt-lg" href="#pricing">
                  See what Pro costs
                  <Arrow />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- PRICING ---------------- */}
        <section className="section" id="pricing">
          <div className="shell">
            <div className="reveal" style={{ maxWidth: "42ch" }}>
              <span className="eyebrow">Pricing</span>
              <h2 className="display d-1 mt-md">Free to sit. Pay to plan.</h2>
              <p className="body-muted mt-md">
                No ads on a map about quiet places. The people who need rest
                routing are the people who will pay for it.
              </p>
            </div>

            <div className="prices mt-xl">
              <div className="bezel reveal">
                <div className="bezel__core pad-lg stack">
                  <span className="meta">Perch</span>
                  <p className="price">Free</p>
                  <p className="body-muted">Forever. This is the part that fills the map.</p>
                  <ul className="ticks mt-md">
                    {["The whole map", "Rate and photograph any bench", "Follow people and collections", "Add missing benches and attributes"].map((t) => (
                      <li key={t}><Tick />{t}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bezel bezel--feature reveal" style={{ "--i": 1 } as React.CSSProperties}>
                <div className="bezel__core pad-lg stack">
                  <div className="row gap-xs" style={{ justifyContent: "space-between" }}>
                    <span className="meta">Perch Pro</span>
                    <span className="tag tag--moss">Launch price</span>
                  </div>
                  <p className="price">
                    &euro;3.50<span className="price__per">/month</span>
                  </p>
                  <p className="body-muted">Or &euro;29 a year. Cancel in two taps.</p>
                  <ul className="ticks mt-md">
                    {[
                      "Rest routing — never walk further than you can",
                      "Offline maps for the whole city",
                      "Shade forecasting by time of day",
                      "Private collections and saved walks",
                      "Step-free approach filters",
                    ].map((t) => (
                      <li key={t}><Tick />{t}</li>
                    ))}
                  </ul>
                  <a className="btn btn--primary mt-lg" href="#waitlist">
                    Join the waitlist
                    <Arrow />
                  </a>
                </div>
              </div>

              <div className="bezel reveal" style={{ "--i": 2 } as React.CSSProperties}>
                <div className="bezel__core pad-lg stack">
                  <span className="meta">For cities</span>
                  <p className="price">Later</p>
                  <p className="body-muted">
                    Parks departments and heat officers keep asking where people
                    can rest in shade. We will have the answer before we sell
                    it &mdash; not the other way round.
                  </p>
                  <ul className="ticks mt-md">
                    {["Rest-point inventories", "Shade gap analysis", "Accessibility audit exports"].map((t) => (
                      <li key={t}><Tick />{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- DEDICATIONS ---------------- */}
        <section className="section band" id="dedications">
          <div className="shell">
            <div className="feature-split feature-split--flip">
              <div className="reveal">
                <span className="eyebrow">Memorial benches</span>
                <h2 className="display d-1 mt-md">
                  Handled carefully,
                  <br />
                  <em className="italic-swap">or not at all.</em>
                </h2>
                <p className="body-muted mt-md">
                  A plaque on a bench is the most-read piece of writing most
                  people ever leave behind. Perch will show you where they are
                  and let families add the story the brass had no room for.
                </p>
                <p className="body-muted mt-md">
                  What Perch will never do is sell you a claim on a bench it
                  does not own. Dedications are council property under a real
                  contract with a real family. We build this <em>with</em> parks
                  departments, on their terms, or we do not build it.
                </p>
                <p className="meta mt-lg">Not in v1. Documented so it is not quietly forgotten.</p>
              </div>
              <div className="bezel reveal" style={{ "--i": 1 } as React.CSSProperties}>
                <div className="bezel__core">
                  <img
                    src="/bench-memorial.webp"
                    alt="A weathered park bench with a small blank brass plaque set into the top rail, in early morning light."
                    width={2400}
                    height={1792}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- WAITLIST ---------------- */}
        <section className="section" id="waitlist">
          <div className="shell">
            <div className="bezel reveal">
              <div className="bezel__core cta">
                <span className="eyebrow">Lisbon, then everywhere</span>
                <h2 className="display d-1 mt-md">
                  Tell us your city.
                  <br />
                  <em className="italic-swap">We will start there next.</em>
                </h2>
                <form className="waitlist-form mt-lg" action="#" method="post">
                  <label className="sr-only" htmlFor="email">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                  <label className="sr-only" htmlFor="city">City</label>
                  <input id="city" name="city" type="text" placeholder="Your city" />
                  <button className="btn btn--primary" type="submit">
                    Join
                    <Arrow />
                  </button>
                </form>
                <p className="meta mt-md">
                  One email when your city opens. Nothing else.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

/* ---------- small presentational bits ---------- */

function Dots({ filled }: { filled: number }) {
  return (
    <span className="dots" aria-label={`${filled} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <i key={i} className={i < filled ? "on" : undefined} aria-hidden="true" />
      ))}
    </span>
  );
}

function Tick() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M3 8.5l3.2 3.2L13 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
