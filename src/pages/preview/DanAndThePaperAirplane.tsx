import { useEffect, useMemo } from "react";
import bookCover from "@/assets/preview/dan-airplane/book-cover.jpg";
import lifestyleBoy from "@/assets/preview/dan-airplane/lifestyle-boy-reading.webp";
import lifestyleClassroom from "@/assets/preview/dan-airplane/lifestyle-classroom.webp";
import scene1Left from "@/assets/preview/dan-airplane/scene1-instructions-left.jpg";
import scene1Right from "@/assets/preview/dan-airplane/scene1-instructions-right.jpg";
import scene2Left from "@/assets/preview/dan-airplane/scene2-dld-explained-left.jpg";
import scene2Right from "@/assets/preview/dan-airplane/scene2-dld-explained-right.jpg";
import scene3Left from "@/assets/preview/dan-airplane/scene3-one-step-left.jpg";
import scene3Right from "@/assets/preview/dan-airplane/scene3-one-step-right.jpg";
import scene4Left from "@/assets/preview/dan-airplane/scene4-glossary-left.jpg";
import scene4Right from "@/assets/preview/dan-airplane/scene4-glossary-right.jpg";

const css = `
:root {
  --purple-deep: #1F1640;
  --purple-mid: #3A2A6E;
  --purple-primary: #6B4FA0;
  --purple-soft: #EDE7F8;
  --purple-softer: #F6F2FB;
  --yellow-warm: #F4C84A;
  --yellow-warm-hover: #E0B73D;
  --navy: #14102A;
  --charcoal: #2D2D3D;
  --text-body: #3F3F52;
  --text-muted: #6B6B7B;
  --bg-white: #FFFFFF;
  --bg-off-white: #FAFAFB;
  --border-soft: #E8E5EE;
}
.dan-page * { box-sizing: border-box; }
.dan-page { font-family: 'Inter', system-ui, -apple-system, sans-serif; font-size: 17px; line-height: 1.65; color: var(--text-body); background-color: var(--bg-white); -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
.dan-page h1, .dan-page h2, .dan-page h3, .dan-page h4, .dan-page h5 { font-family: 'Poppins', system-ui, sans-serif; color: var(--navy); letter-spacing: -0.015em; font-weight: 700; margin: 0; }
.dan-page p { margin: 0; }
.dan-page a { color: inherit; }
.dan-page .container { max-width: 1140px; margin: 0 auto; padding: 0 32px; }
.dan-page .container-narrow { max-width: 880px; margin: 0 auto; padding: 0 32px; }

.dan-page .hero { padding: 96px 0 88px; background: var(--bg-white); }
.dan-page .hero-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: 80px; align-items: center; }
.dan-page .eyebrow { display: inline-block; font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: var(--purple-primary); background-color: var(--purple-soft); padding: 8px 16px; border-radius: 100px; margin-bottom: 28px; }
.dan-page .hero h1 { font-size: 56px; font-weight: 800; line-height: 1.08; margin-bottom: 24px; color: var(--navy); }
.dan-page .hero h1 em { font-style: italic; font-weight: 700; color: var(--purple-mid); }
.dan-page .hero-subtitle { font-size: 19px; line-height: 1.6; color: var(--text-muted); max-width: 520px; }
.dan-page .hero-subtitle em { font-style: italic; }
.dan-page .hero-cover-wrap { position: relative; display: flex; justify-content: center; align-items: center; }
.dan-page .hero-cover-wrap::before { content: ""; position: absolute; inset: -20px; background: radial-gradient(ellipse at center, var(--purple-soft) 0%, transparent 65%); z-index: 0; border-radius: 50%; }
.dan-page .hero-cover { position: relative; z-index: 1; max-width: 420px; width: 100%; height: auto; filter: drop-shadow(0 24px 48px rgba(31, 22, 64, 0.22)); }

.dan-page .story-block { padding: 80px 0; background-color: var(--bg-off-white); }
.dan-page .story-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: stretch; }
.dan-page .story-block .image-side { height: 100%; }
.dan-page .story-block .image-side img { width: 100%; height: 100%; object-fit: cover; object-position: center 30%; border-radius: 12px; box-shadow: 0 18px 50px rgba(31, 22, 64, 0.12); }
.dan-page .story-block h2 { font-size: 36px; line-height: 1.2; margin-bottom: 20px; }
.dan-page .story-block p { margin-bottom: 16px; font-size: 17px; color: var(--text-body); }
.dan-page .story-block p:last-child { margin-bottom: 0; }

.dan-page .lifestyle-band { background-color: var(--bg-white); padding: 0; }
.dan-page .lifestyle-image-wrap { position: relative; width: 100%; max-height: 520px; overflow: hidden; }
.dan-page .lifestyle-image-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; max-height: 520px; }
.dan-page .lifestyle-overlay { position: absolute; inset: 0; display: flex; align-items: flex-end; justify-content: center; padding: 48px; background: linear-gradient(180deg, transparent 50%, rgba(31, 22, 64, 0.55) 100%); }
.dan-page .lifestyle-text { font-family: 'Poppins', sans-serif; font-size: 28px; font-weight: 600; color: white; letter-spacing: -0.01em; text-align: center; text-shadow: 0 2px 12px rgba(0, 0, 0, 0.4); }

.dan-page .why-section { padding: 96px 0; background-color: var(--purple-deep); color: white; }
.dan-page .why-section h2 { color: white; text-align: center; font-size: 36px; line-height: 1.2; margin-bottom: 56px; max-width: 720px; margin-left: auto; margin-right: auto; }
.dan-page .why-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
.dan-page .why-card { background-color: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 36px 32px; }
.dan-page .why-card h3 { color: var(--yellow-warm); font-size: 14px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 24px; font-family: 'Poppins', sans-serif; }
.dan-page .why-card ul { list-style: none; padding: 0; margin: 0; }
.dan-page .why-card li { padding: 12px 0; padding-left: 28px; position: relative; color: rgba(255, 255, 255, 0.92); line-height: 1.55; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
.dan-page .why-card li:last-child { border-bottom: none; }
.dan-page .why-card li::before { content: ""; position: absolute; left: 0; top: 22px; width: 14px; height: 2px; background-color: var(--yellow-warm); border-radius: 2px; }

.dan-page .glossary-section { padding: 96px 0; background-color: var(--purple-softer); }
.dan-page .glossary-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: 80px; align-items: center; }
.dan-page .glossary-section h2 { font-size: 36px; line-height: 1.2; margin-bottom: 20px; }
.dan-page .glossary-section p { font-size: 17px; margin-bottom: 16px; color: var(--text-body); }
.dan-page .glossary-section .image-side img { width: 100%; height: auto; border-radius: 12px; box-shadow: 0 18px 50px rgba(31, 22, 64, 0.12); border: 1px solid var(--border-soft); }
.dan-page .glossary-section .image-side .img-caption { display: block; text-align: center; font-size: 13px; color: var(--text-muted); margin-top: 12px; font-style: italic; }

.dan-page .pages-section { padding: 96px 0; background-color: var(--bg-white); }
.dan-page .pages-section .section-head { text-align: center; margin-bottom: 64px; }
.dan-page .pages-section h2 { font-size: 36px; line-height: 1.2; margin-bottom: 16px; }
.dan-page .pages-section .section-head p { color: var(--text-muted); font-size: 17px; max-width: 520px; margin: 0 auto; }
.dan-page .scene-card { background-color: var(--bg-off-white); border-radius: 16px; padding: 40px; margin-bottom: 32px; border: 1px solid var(--border-soft); }
.dan-page .scene-card:last-child { margin-bottom: 0; }
.dan-page .scene-header { display: flex; align-items: baseline; gap: 20px; margin-bottom: 28px; flex-wrap: wrap; }
.dan-page .scene-number { font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--purple-primary); background-color: var(--purple-soft); padding: 6px 14px; border-radius: 100px; flex-shrink: 0; }
.dan-page .scene-caption { font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 600; color: var(--navy); line-height: 1.35; }
.dan-page .spread-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; border-radius: 12px; overflow: hidden; box-shadow: 0 14px 40px rgba(31, 22, 64, 0.12); background-color: white; }
.dan-page .spread-grid img { width: 100%; height: auto; display: block; }

.dan-page .cta-section { padding: 96px 0; background-color: var(--purple-soft); text-align: center; }
.dan-page .cta-section h2 { font-size: 36px; line-height: 1.2; margin-bottom: 20px; }
.dan-page .cta-section .lead { font-size: 18px; color: var(--text-body); max-width: 600px; margin: 0 auto 16px; }
.dan-page .cta-section .small { font-size: 15px; color: var(--text-muted); max-width: 580px; margin: 0 auto 40px; }
.dan-page .cta-buttons { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
.dan-page .btn { display: inline-flex; align-items: center; justify-content: center; padding: 16px 32px; font-family: 'Poppins', sans-serif; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 8px; transition: all 0.2s ease; letter-spacing: 0.005em; min-height: 54px; }
.dan-page .btn-primary { background-color: var(--purple-deep); color: white; }
.dan-page .btn-primary:hover { background-color: var(--purple-mid); transform: translateY(-1px); box-shadow: 0 12px 28px rgba(31, 22, 64, 0.25); }
.dan-page .btn-secondary { background-color: var(--yellow-warm); color: var(--navy); }
.dan-page .btn-secondary:hover { background-color: var(--yellow-warm-hover); transform: translateY(-1px); box-shadow: 0 12px 28px rgba(244, 200, 74, 0.4); }

.dan-page .signoff-section { padding: 96px 0 112px; background-color: var(--bg-white); }
.dan-page .signoff { max-width: 680px; margin: 0 auto; text-align: center; }
.dan-page .signoff h2 { font-size: 32px; margin-bottom: 24px; line-height: 1.25; }
.dan-page .signoff > p { font-size: 18px; line-height: 1.7; color: var(--text-body); margin-bottom: 36px; }
.dan-page .signature { display: inline-block; text-align: center; padding-top: 36px; border-top: 1px solid var(--border-soft); }
.dan-page .signature-greeting { font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 500; color: var(--text-muted); letter-spacing: 0.04em; margin-bottom: 24px; text-transform: uppercase; }
.dan-page .signature-grid { display: flex; gap: 56px; justify-content: center; flex-wrap: wrap; margin-bottom: 24px; }
.dan-page .signature-name { font-family: 'Poppins', sans-serif; font-size: 18px; font-weight: 700; color: var(--navy); margin-bottom: 4px; }
.dan-page .signature-cred { font-size: 14px; color: var(--text-muted); line-height: 1.4; }
.dan-page .signature-role { font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 600; color: var(--purple-primary); letter-spacing: 0.1em; text-transform: uppercase; }

@media (max-width: 900px) {
  .dan-page .hero { padding: 64px 0 56px; }
  .dan-page .hero-grid { grid-template-columns: 1fr; gap: 48px; }
  .dan-page .hero h1 { font-size: 38px; }
  .dan-page .hero-cover { max-width: 280px; }
  .dan-page .story-block, .dan-page .why-section, .dan-page .glossary-section, .dan-page .pages-section, .dan-page .cta-section, .dan-page .signoff-section { padding: 64px 0; }
  .dan-page .story-grid, .dan-page .why-grid, .dan-page .glossary-grid { grid-template-columns: 1fr; gap: 40px; }
  .dan-page .story-block h2, .dan-page .why-section h2, .dan-page .glossary-section h2, .dan-page .pages-section h2, .dan-page .cta-section h2 { font-size: 28px; }
  .dan-page .scene-card { padding: 28px 20px; }
  .dan-page .spread-grid { grid-template-columns: 1fr; }
  .dan-page .cta-buttons { flex-direction: column; align-items: stretch; }
  .dan-page .btn { width: 100%; }
  .dan-page .signature-grid { flex-direction: column; gap: 28px; }
  .dan-page .lifestyle-image-wrap, .dan-page .lifestyle-image-wrap img { max-height: 320px; }
  .dan-page .lifestyle-text { font-size: 20px; }
  .dan-page .lifestyle-overlay { padding: 24px; }
}
@media (max-width: 540px) {
  .dan-page .container, .dan-page .container-narrow { padding: 0 20px; }
  .dan-page .hero h1 { font-size: 32px; }
}
`;

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
      mailtoHref:
        "mailto:hello@empowereddld.com?subject=Wholesale%20enquiry%20%E2%80%94%20Dan%20and%20the%20Paper%20Airplane",
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

  return (
    <div className="dan-page">
      <style>{css}</style>

      <header className="hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <span className="eyebrow">A Sample From Empowered DLD</span>
              <h1>
                A first look at <em>Dan and the Paper Airplane</em>
              </h1>
              <p className="hero-subtitle">
                Book one in the <em>Living Life with DLD</em> series, written for children with DLD and the people who support them.
              </p>
            </div>
            <div className="hero-cover-wrap">
              <img className="hero-cover" src={bookCover} alt="Dan and the Paper Airplane book" />
            </div>
          </div>
        </div>
      </header>

      <section className="story-block">
        <div className="container">
          <div className="story-grid">
            <div className="image-side">
              <img src={lifestyleBoy} alt="A child reading Dan and the Paper Airplane on a park bench" />
            </div>
            <div>
              <h2>What this story gives a child</h2>
              <p>Dan loves making paper airplanes. At school, he keeps getting in trouble for not following Mr. Mac's instructions. At recess, the words won't come out right. He doesn't have language for what's happening to him.</p>
              <p>Then he meets Ms. Lopez, a speech and language therapist who explains DLD in a way Dan can understand. By the end of the story, Dan has a name for his experience, a strategy he can use, and the words to ask his friends for what he needs.</p>
              <p>It's a story about a child finding language for himself.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="lifestyle-band">
        <div className="lifestyle-image-wrap">
          <img src={lifestyleClassroom} alt="A speech and language therapist reading Dan and the Paper Airplane with two children" />
          <div className="lifestyle-overlay">
            <span className="lifestyle-text">In homes. In clinics. In classrooms.</span>
          </div>
        </div>
      </section>

      <section className="why-section">
        <div className="container">
          <h2>Why we think it belongs in your work</h2>
          <div className="why-grid">
            <div className="why-card">
              <h3>For your sessions</h3>
              <ul>
                <li>Models the strategies you teach: asking for one step at a time, repairing after a communication breakdown, and naming what's hard.</li>
                <li>Opens conversations about identity and self-advocacy that are difficult to script.</li>
                <li>Weaves vocabulary into a real story, not isolated drills.</li>
              </ul>
            </div>
            <div className="why-card">
              <h3>For the families you work with</h3>
              <ul>
                <li>Gives parents language for the diagnosis when they need it most.</li>
                <li>Gives children a character who looks like them and lives what they live.</li>
                <li>Reads aloud well, so it can be shared at bedtime, in the car, or during a quiet afternoon.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="glossary-section">
        <div className="container">
          <div className="glossary-grid">
            <div>
              <span className="eyebrow">Inside The Book</span>
              <h2>A note on the glossary</h2>
              <p>Each book in the series includes a glossary at the back. Every key word has its definition, the context it appears in, and similar words children may encounter elsewhere.</p>
              <p>This is the part SLTs tell us they reach for most. It turns the book into a working language tool, not just a story.</p>
            </div>
            <div className="image-side">
              <div className="spread-grid">
                <img src={scene4Left} alt="The back-of-book glossary with word, meaning, context, and similar words columns" />
                <img src={scene4Right} alt="Use the word in a sentence practice page with character icons next to each line" />
              </div>
              <span className="img-caption">The glossary spread at the back of the book.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="pages-section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Read A Sample</span>
            <h2>Four scenes from the book</h2>
            <p>The story moves through these moments in order. <br />The full book is 28 pages.</p>
          </div>

          <div className="scene-card">
            <div className="scene-header">
              <span className="scene-number">Scene One</span>
              <span className="scene-caption">Dan tries to follow Mr. Mac's multi-step instructions.</span>
            </div>
            <div className="spread-grid">
              <img src={scene1Left} alt="Mr. Mac giving the class multi-step instructions" />
              <img src={scene1Right} alt="Dan feeling overwhelmed by too many words to remember" />
            </div>
          </div>

          <div className="scene-card">
            <div className="scene-header">
              <span className="scene-number">Scene Two</span>
              <span className="scene-caption">Ms. Lopez explains DLD to Dan.</span>
            </div>
            <div className="spread-grid">
              <img src={scene2Left} alt="Ms. Lopez explaining what DLD is" />
              <img src={scene2Right} alt="Dan realising why words have been hard for him" />
            </div>
          </div>

          <div className="scene-card">
            <div className="scene-header">
              <span className="scene-number">Scene Three</span>
              <span className="scene-caption">Dan begins to advocate for himself.</span>
            </div>
            <div className="spread-grid">
              <img src={scene3Left} alt="Dan asking Molly to give instructions one step at a time" />
              <img src={scene3Right} alt="Dan and his friends building the airplane together" />
            </div>
          </div>

          <div className="scene-card">
            <div className="scene-header">
              <span className="scene-number">Scene Four</span>
              <span className="scene-caption">A look at the back-of-book glossary spread.</span>
            </div>
            <div className="spread-grid">
              <img src={scene4Left} alt="Glossary table with word, meaning, context, and similar words" />
              <img src={scene4Right} alt="Use the word in a sentence practice page with character icons next to each line" />
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container-narrow">
          <h2>When you're ready</h2>
          <p className="lead text-base">The full book is available on Amazon for personal copies and quick orders.</p>
          <p className="small text-lg font-light">For SLTs, clinics, schools, and bulk orders, we'd love to hear from you. We can offer better pricing at our wholesale rate.</p>
          <div className="cta-buttons">
            <a className="btn btn-primary" href={amazonHref} target="_blank" rel="noopener noreferrer">Buy on Amazon</a>
            <a className="btn btn-secondary" href={mailtoHref}>Email hello@empowereddld.com</a>
          </div>
        </div>
      </section>

      <section className="signoff-section">
        <div className="container-narrow">
          <div className="signoff">
            <h2>A note from us</h2>
            <p>We wrote this series because we kept seeing the same gap: children who were struggling without understanding why, and adults around them without the right words to help. We hope this book is useful for the families in your care.</p>

            <div className="signature">
              <div className="signature-greeting">With care,</div>

              <div className="signature-grid">
                <div>
                  <div className="signature-name">Camesha Russell</div>
                  <div className="signature-cred">Educator<br />14+ years</div>
                </div>
                <div>
                  <div className="signature-name">Jinean Cheng</div>
                  <div className="signature-cred">Speech-Language Pathologist<br />15+ years</div>
                </div>
              </div>

              <div className="signature-role">Co-founders, Empowered DLD</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DanAndThePaperAirplane;
