import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import bookCover from "@/assets/book-dan-paper-airplane.webp";
import lifestyleBoy from "@/assets/preview/dan-airplane/lifestyle-boy-reading.webp";
import lifestyleClassroom from "@/assets/preview/dan-airplane/lifestyle-classroom.webp";

const DEEP_PURPLE = "#1f1147";
const SOFT_PURPLE = "#2a1a5e";
const LIGHTER_PURPLE = "#3a2470";
const YELLOW = "#f5c542";
const OFF_WHITE = "#faf8f3";
const TEXT_DARK = "#1a1a1a";
const TEXT_MUTED = "#5a5a5a";

const DanAndThePaperAirplane = () => {
  const { amazonHref, mailtoHref } = useMemo(() => {
    const search = typeof window !== "undefined" ? window.location.search : "";
    const utmParams = new URLSearchParams(search);
    const utmString = Array.from(utmParams.entries())
      .filter(([k]) => k.startsWith("utm_"))
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join("&");
    return {
      amazonHref: `https://amzn.eu/d/0bpPo1FJ${utmString ? `?${utmString}` : ""}`,
      mailtoHref: `mailto:hello@empowereddld.com?subject=${encodeURIComponent(
        "Wholesale enquiry - Dan and the Paper Airplane"
      )}${utmString ? `&body=${encodeURIComponent("Source: " + utmString)}` : ""}`,
    };
  }, []);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Dan and the Paper Airplane | Sample Pages | Empowered DLD";

    const tags: HTMLElement[] = [];
    const addTag = (tag: string, attrs: Record<string, string>) => {
      const el = document.createElement(tag);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      document.head.appendChild(el);
      tags.push(el);
    };
    addTag("meta", { name: "robots", content: "noindex, follow" });
    addTag("meta", {
      name: "description",
      content:
        "Read a free sample of Dan and the Paper Airplane, the first book in the Living Life with DLD series. Written by an SLP and an educator for children with DLD.",
    });
    addTag("link", { rel: "preconnect", href: "https://fonts.googleapis.com" });
    addTag("link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" });
    addTag("link", {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap",
    });

    return () => {
      document.title = prevTitle;
      tags.forEach((t) => t.remove());
    };
  }, []);

  const fontBody = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
  const fontDisplay = "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif";

  return (
    <div style={{ fontFamily: fontBody, color: TEXT_DARK, background: "#fff", lineHeight: 1.6 }}>
      <style>{`
        .dan-page * { box-sizing: border-box; }
        .dan-page a { color: inherit; }
        .dan-container { max-width: 1140px; margin: 0 auto; padding: 0 24px; }
        .dan-header {
          padding: 20px 0; border-bottom: 1px solid #eee;
          position: sticky; top: 0; background: #fff; z-index: 10;
        }
        .dan-header img { height: 36px; width: auto; }
        .dan-hero {
          position: relative; overflow: hidden; padding: 80px 0 60px;
        }
        .dan-hero::before {
          content: ""; position: absolute; right: -10%; top: 10%;
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(120,80,200,0.18), transparent 60%);
          z-index: 0; pointer-events: none;
        }
        .dan-hero-grid {
          display: grid; grid-template-columns: 1.1fr 1fr; gap: 60px; align-items: center;
          position: relative; z-index: 1;
        }
        .dan-pill {
          display: inline-block; padding: 8px 16px; border-radius: 999px;
          background: #f0eaff; color: ${DEEP_PURPLE};
          font-family: ${fontDisplay}; font-weight: 600; font-size: 13px;
          letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 24px;
        }
        .dan-h1 {
          font-family: ${fontDisplay}; font-weight: 800;
          font-size: clamp(36px, 5vw, 56px); line-height: 1.05;
          letter-spacing: -0.02em; margin: 0 0 20px; color: ${DEEP_PURPLE};
        }
        .dan-h1 em { font-style: italic; font-weight: 700; }
        .dan-sub { font-size: 18px; color: ${TEXT_MUTED}; max-width: 520px; margin: 0; }
        .dan-cover-wrap { display: flex; justify-content: center; }
        .dan-cover-wrap img {
          max-width: 100%; height: auto; border-radius: 8px;
          box-shadow: 0 30px 60px -15px rgba(31,17,71,0.35);
        }

        .dan-section { padding: 80px 0; }
        .dan-bg-offwhite { background: ${OFF_WHITE}; }
        .dan-bg-deep { background: ${DEEP_PURPLE}; color: #fff; }
        .dan-bg-soft { background: ${SOFT_PURPLE}; color: #fff; }
        .dan-bg-light { background: #f4eeff; }

        .dan-2col {
          display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;
        }
        .dan-2col img {
          width: 100%; height: 100%; max-height: 420px;
          object-fit: cover; border-radius: 12px;
        }
        .dan-section h2 {
          font-family: ${fontDisplay}; font-weight: 700;
          font-size: clamp(28px, 3.5vw, 40px); line-height: 1.15;
          letter-spacing: -0.01em; margin: 0 0 24px;
        }
        .dan-section p { font-size: 17px; color: ${TEXT_MUTED}; margin: 0 0 16px; }
        .dan-bg-deep p, .dan-bg-soft p { color: rgba(255,255,255,0.85); }
        .dan-bg-deep h2, .dan-bg-soft h2 { color: #fff; }

        .dan-lifestyle {
          position: relative; width: 100%; aspect-ratio: 16 / 9; max-height: 640px; overflow: hidden; background: #1a1033;
        }
        .dan-lifestyle img { width: 100%; height: 100%; object-fit: contain; object-position: center; }
        .dan-lifestyle-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.65));
          display: flex; align-items: flex-end; justify-content: center;
          padding: 60px 24px;
        }
        .dan-lifestyle-cap {
          font-family: ${fontDisplay}; font-weight: 600; color: #fff;
          font-size: clamp(22px, 3vw, 32px); text-align: center;
          letter-spacing: -0.01em; text-shadow: 0 2px 12px rgba(0,0,0,0.4);
        }

        .dan-glass-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-top: 40px;
        }
        .dan-glass {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 16px; padding: 32px;
        }
        .dan-glass h3 {
          font-family: ${fontDisplay}; font-weight: 700;
          color: ${YELLOW}; text-transform: uppercase;
          letter-spacing: 0.12em; font-size: 13px; margin: 0 0 20px;
        }
        .dan-glass ul { list-style: none; padding: 0; margin: 0; }
        .dan-glass li {
          position: relative; padding-left: 24px; margin-bottom: 14px;
          color: rgba(255,255,255,0.9); font-size: 16px; line-height: 1.55;
        }
        .dan-glass li::before {
          content: ""; position: absolute; left: 0; top: 11px;
          width: 14px; height: 2px; background: ${YELLOW};
        }

        .dan-scenes {
          display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-top: 48px;
        }
        .dan-scene {
          background: ${OFF_WHITE}; border: 1px solid #eae3d5;
          border-radius: 16px; padding: 28px; display: flex; flex-direction: column;
        }
        .dan-scene-title {
          font-family: ${fontDisplay}; font-weight: 700;
          font-size: 20px; color: ${DEEP_PURPLE}; margin: 0 0 16px;
        }
        .dan-scene-spread {
          display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
          background: #fff; border-radius: 8px; padding: 16px; margin-bottom: 16px;
          aspect-ratio: 16/9; align-items: center; justify-items: center;
        }
        .dan-scene-single {
          background: #fff; border-radius: 8px; padding: 24px; margin-bottom: 16px;
          aspect-ratio: 16/9; display: flex; align-items: center; justify-content: center;
        }
        .dan-scene-ph {
          width: 100%; height: 100%; min-height: 140px;
          background: linear-gradient(135deg, #f0eaff, #e4d8ff);
          border-radius: 6px; display: flex; align-items: center; justify-content: center;
          color: ${DEEP_PURPLE}; font-family: ${fontDisplay}; font-weight: 600;
          font-size: 13px; text-align: center; padding: 12px;
        }
        .dan-scene p { font-size: 15px; margin: 0; color: ${TEXT_MUTED}; }

        .dan-cta-row {
          display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;
          margin-top: 36px;
        }
        .dan-btn {
          display: inline-block; padding: 18px 36px; border-radius: 8px;
          font-family: ${fontDisplay}; font-weight: 600; font-size: 16px;
          text-decoration: none; transition: transform 0.2s, box-shadow 0.2s;
        }
        .dan-btn:hover { transform: translateY(-2px); }
        .dan-btn-primary { background: ${DEEP_PURPLE}; color: #fff; }
        .dan-btn-secondary { background: ${YELLOW}; color: ${DEEP_PURPLE}; }

        .dan-signoff { text-align: center; padding: 80px 24px; }
        .dan-signoff h2 {
          font-family: ${fontDisplay}; font-weight: 700;
          font-size: 32px; color: ${DEEP_PURPLE}; margin: 0 0 24px;
        }
        .dan-signatures {
          display: grid; grid-template-columns: 1fr 1fr; gap: 40px;
          max-width: 600px; margin: 40px auto 16px;
        }
        .dan-sig-name {
          font-family: ${fontDisplay}; font-weight: 600;
          font-size: 18px; color: ${DEEP_PURPLE};
        }
        .dan-sig-tag { font-size: 13px; color: ${TEXT_MUTED}; letter-spacing: 0.04em; }

        .dan-footer {
          padding: 40px 0; border-top: 1px solid #eee;
          text-align: center; font-size: 14px; color: ${TEXT_MUTED};
        }
        .dan-footer a { margin: 0 12px; text-decoration: none; }
        .dan-footer img { height: 28px; margin-bottom: 16px; }

        @media (max-width: 900px) {
          .dan-hero { padding: 48px 0 32px; }
          .dan-hero-grid, .dan-2col, .dan-glass-grid, .dan-scenes, .dan-signatures {
            grid-template-columns: 1fr; gap: 32px;
          }
          .dan-section { padding: 56px 0; }
          .dan-lifestyle { aspect-ratio: 4 / 3; height: auto; }
          .dan-cta-row .dan-btn { width: 100%; text-align: center; }
        }
      `}</style>

      <div className="dan-page">
        {/* Header */}
        <header className="dan-header">
          <div className="dan-container" style={{ display: "flex", alignItems: "center" }}>
            <Link to="/" aria-label="Empowered DLD home">
              <span style={{
                fontFamily: fontDisplay, fontWeight: 700, fontSize: 18,
                color: DEEP_PURPLE, letterSpacing: "-0.01em",
              }}>
                Empowered DLD
              </span>
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section className="dan-hero">
          <div className="dan-container">
            <div className="dan-hero-grid">
              <div>
                <span className="dan-pill">Sample pages from</span>
                <h1 className="dan-h1">
                  <em>Dan and the Paper Airplane</em>
                </h1>
                <p className="dan-sub">
                  The first book in the Living Life with DLD series. Written for children
                  with Developmental Language Disorder by an SLP and an educator who live
                  it every day.
                </p>
              </div>
              <div className="dan-cover-wrap">
                <img src={bookCover} alt="Dan and the Paper Airplane book cover" />
              </div>
            </div>
          </div>
        </section>

        {/* What this story gives a child */}
        <section className="dan-section dan-bg-offwhite">
          <div className="dan-container">
            <div className="dan-2col">
              <img src={lifestyleBoy} alt="Child reading Dan and the Paper Airplane at home" />
              <div>
                <h2>What this story gives a child</h2>
                <p>
                  A character who thinks the way they do. Dan finds words hard. He gets
                  stuck. He tries again. For a child with DLD, that mirror matters more
                  than any lesson.
                </p>
                <p>
                  Short sentences. One idea per line. Pictures that carry meaning so the
                  story stays accessible, even on a tired day.
                </p>
                <p>
                  And a quiet ending that says: you are not the only one. You are not
                  broken. You are figuring it out, like Dan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Lifestyle band */}
        <div className="dan-lifestyle">
          <img src={lifestyleClassroom} alt="The book in classroom and clinic settings" />
          <div className="dan-lifestyle-overlay">
            <div className="dan-lifestyle-cap">In homes. In clinics. In classrooms.</div>
          </div>
        </div>

        {/* Why it belongs in your work */}
        <section className="dan-section dan-bg-deep">
          <div className="dan-container">
            <h2>Why it belongs in your work</h2>
            <p style={{ maxWidth: 720 }}>
              Built by clinicians and educators, designed for the children you actually
              see. Use it in a session, send it home, or read it as a class.
            </p>
            <div className="dan-glass-grid">
              <div className="dan-glass">
                <h3>For SLTs &amp; SLPs</h3>
                <ul>
                  <li>Targets narrative structure with short, repeatable sentences</li>
                  <li>One-step instructions modelled inside the story</li>
                  <li>Built-in glossary to pre-teach vocabulary</li>
                  <li>Works as a session book or a home programme handout</li>
                </ul>
              </div>
              <div className="dan-glass">
                <h3>For educators</h3>
                <ul>
                  <li>Accessible reading for students with language difficulties</li>
                  <li>Opens a class conversation about how brains learn differently</li>
                  <li>Pairs with simple comprehension and prediction tasks</li>
                  <li>Quietly raises DLD awareness without singling a child out</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Glossary callout */}
        <section className="dan-section dan-bg-soft">
          <div className="dan-container">
            <div className="dan-2col">
              <div>
                <h2>A glossary built into the story</h2>
                <p>
                  Tricky words are pulled out and explained in child-friendly language at
                  the back of the book. Pre-teach them, or look them up together as you
                  read. Either way, no child gets lost on the page.
                </p>
              </div>
              <div className="dan-scene-single" style={{ background: "rgba(255,255,255,0.08)", aspectRatio: "4/3" }}>
                <div className="dan-scene-ph" style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}>
                  Glossary spread
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Read a Sample */}
        <section className="dan-section">
          <div className="dan-container">
            <h2 style={{ textAlign: "center" }}>Read a sample</h2>
            <p style={{ textAlign: "center", maxWidth: 600, margin: "0 auto" }}>
              Four pages from inside the book.
            </p>
            <div className="dan-scenes">
              <div className="dan-scene">
                <div className="dan-scene-title">The Giant Plane</div>
                <div className="dan-scene-spread">
                  <div className="dan-scene-ph">Spread page 1</div>
                  <div className="dan-scene-ph">Spread page 2</div>
                </div>
                <p>Dan dreams up a paper airplane bigger than he is.</p>
              </div>
              <div className="dan-scene">
                <div className="dan-scene-title">DLD, explained for a child</div>
                <div className="dan-scene-spread">
                  <div className="dan-scene-ph">Spread page 1</div>
                  <div className="dan-scene-ph">Spread page 2</div>
                </div>
                <p>A simple page that names what is happening, without labels that scare.</p>
              </div>
              <div className="dan-scene">
                <div className="dan-scene-title">One step at a time</div>
                <div className="dan-scene-spread">
                  <div className="dan-scene-ph">Spread page 1</div>
                  <div className="dan-scene-ph">Spread page 2</div>
                </div>
                <p>Instructions broken down the way Dan needs them, modelling the strategy.</p>
              </div>
              <div className="dan-scene">
                <div className="dan-scene-title">Glossary</div>
                <div className="dan-scene-single">
                  <div className="dan-scene-ph">Single page</div>
                </div>
                <p>Hard words made easy, right at the back.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="dan-section dan-bg-light">
          <div className="dan-container" style={{ textAlign: "center" }}>
            <h2>Get the book</h2>
            <p style={{ maxWidth: 560, margin: "0 auto" }}>
              Order a copy on Amazon UK, or get in touch about wholesale and bulk orders
              for clinics, schools, and organisations.
            </p>
            <div className="dan-cta-row">
              <a className="dan-btn dan-btn-primary" href={amazonHref} target="_blank" rel="noopener noreferrer">
                Buy on Amazon UK
              </a>
              <a className="dan-btn dan-btn-secondary" href={mailtoHref}>
                Wholesale enquiries
              </a>
            </div>
          </div>
        </section>

        {/* Sign-off */}
        <section className="dan-signoff">
          <div className="dan-container">
            <h2>A note from us</h2>
            <p style={{ maxWidth: 600, margin: "0 auto" }}>
              We wrote this for the kids we know, and the parents who needed a book that
              spoke their language. Thank you for reading it.
            </p>
            <div className="dan-signatures">
              <div>
                <div className="dan-sig-name">Camesha Russell</div>
                <div className="dan-sig-tag">Co-founder</div>
              </div>
              <div>
                <div className="dan-sig-name">Jinean Cheng</div>
                <div className="dan-sig-tag">Co-founder</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="dan-footer">
          <div className="dan-container">
            <div style={{ fontFamily: fontDisplay, fontWeight: 700, color: DEEP_PURPLE, marginBottom: 8 }}>
              Empowered DLD
            </div>
            <div>
              © 2026 Empowered DLD
              <Link to="/privacy-policy">Privacy</Link>
              <Link to="/terms-and-conditions">Terms</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DanAndThePaperAirplane;
