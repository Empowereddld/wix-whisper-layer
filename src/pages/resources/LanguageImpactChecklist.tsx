import { useEffect, useMemo } from "react";
import logoImage from "@/assets/empowered-logo.webp";
import { Link } from "react-router-dom";

const DEEP_PURPLE = "#1f1147";
const YELLOW = "#f5c542";
const YELLOW_HOVER = "#f0b929";
const OFF_WHITE = "#faf8f3";
const TEXT_DARK = "#1a1a1a";
const TEXT_MUTED = "#5a5a5a";

const PDF_PATH = "/downloads/language-impact-checklist.pdf";

const LanguageImpactChecklist = () => {
  const downloadHref = useMemo(() => {
    const search = typeof window !== "undefined" ? window.location.search : "";
    const utmParams = new URLSearchParams(search);
    const utmString = Array.from(utmParams.entries())
      .filter(([k]) => k.startsWith("utm_"))
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join("&");
    return `${PDF_PATH}${utmString ? `?${utmString}` : ""}`;
  }, []);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Language Impact Checklist | Empowered DLD";

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
        "A free clinical tool for identifying how language difficulties show up across a student's school day.",
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

  const handleDownload = () => {
    try {
      const search = typeof window !== "undefined" ? window.location.search : "";
      const utmParams = new URLSearchParams(search);
      const detail: Record<string, string> = {
        resource: "language-impact-checklist",
        page: "/resources/language-impact-checklist",
      };
      utmParams.forEach((v, k) => {
        if (k.startsWith("utm_")) detail[k] = v;
      });
      // dataLayer push for GTM/GA4 if present
      const w = window as unknown as { dataLayer?: Array<Record<string, unknown>> };
      if (Array.isArray(w.dataLayer)) {
        w.dataLayer.push({ event: "download", ...detail });
      }
      // Custom DOM event for any listeners
      window.dispatchEvent(new CustomEvent("lid_download", { detail }));
    } catch {
      // noop
    }
  };

  return (
    <div style={{ fontFamily: fontBody, color: TEXT_DARK, background: "#fff", lineHeight: 1.6 }}>
      <style>{`
        .lic-page * { box-sizing: border-box; }
        .lic-page a { color: inherit; }
        .lic-container { max-width: 880px; margin: 0 auto; padding: 0 24px; }

        .lic-header {
          padding: 20px 0; border-bottom: 1px solid #eee;
          position: sticky; top: 0; background: #fff; z-index: 10;
        }

        .lic-hero {
          position: relative; overflow: hidden; padding: 96px 0 72px;
          text-align: center;
        }
        .lic-hero::before {
          content: ""; position: absolute; left: 50%; top: -10%;
          transform: translateX(-50%);
          width: 900px; height: 600px;
          background: radial-gradient(ellipse, rgba(120,80,200,0.16), transparent 65%);
          z-index: 0; pointer-events: none;
        }
        .lic-hero-inner { position: relative; z-index: 1; }

        .lic-pill {
          display: inline-block; padding: 8px 16px; border-radius: 999px;
          background: #f0eaff; color: ${DEEP_PURPLE};
          font-family: ${fontDisplay}; font-weight: 600; font-size: 13px;
          letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 24px;
        }
        .lic-h1 {
          font-family: ${fontDisplay}; font-weight: 800;
          font-size: clamp(36px, 5vw, 56px); line-height: 1.05;
          letter-spacing: -0.02em; margin: 0 0 20px; color: ${DEEP_PURPLE};
        }
        .lic-sub {
          font-family: ${fontDisplay}; font-weight: 500;
          font-size: clamp(18px, 2vw, 22px); color: ${DEEP_PURPLE};
          max-width: 640px; margin: 0 auto 24px; line-height: 1.4;
        }
        .lic-desc {
          font-size: 17px; color: ${TEXT_MUTED}; max-width: 640px; margin: 0 auto 40px;
        }

        .lic-btn {
          display: inline-block; padding: 20px 40px; border-radius: 10px;
          font-family: ${fontDisplay}; font-weight: 700; font-size: 17px;
          text-decoration: none; transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
          background: ${YELLOW}; color: ${DEEP_PURPLE};
          box-shadow: 0 12px 28px -10px rgba(245,197,66,0.55);
        }
        .lic-btn:hover {
          transform: translateY(-2px); background: ${YELLOW_HOVER};
          box-shadow: 0 18px 36px -12px rgba(245,197,66,0.65);
        }

        .lic-credit {
          margin-top: 28px; font-size: 14px; color: ${TEXT_MUTED};
          max-width: 560px; margin-left: auto; margin-right: auto;
        }

        .lic-also {
          background: ${OFF_WHITE}; padding: 56px 0; text-align: center;
          border-top: 1px solid #eee;
        }
        .lic-also p { margin: 0; font-size: 16px; color: ${TEXT_MUTED}; }
        .lic-also a {
          color: ${DEEP_PURPLE}; font-family: ${fontDisplay}; font-weight: 600;
          text-decoration: underline; text-underline-offset: 4px;
        }

        .lic-footer {
          padding: 40px 0; border-top: 1px solid #eee;
          text-align: center; font-size: 14px; color: ${TEXT_MUTED};
        }
        .lic-footer a { margin: 0 12px; text-decoration: none; }

        @media (max-width: 700px) {
          .lic-hero { padding: 56px 0 40px; }
          .lic-btn { width: 100%; text-align: center; padding: 18px 24px; }
        }
      `}</style>

      <div className="lic-page">
        <header className="lic-header">
          <div className="lic-container" style={{ display: "flex", alignItems: "center" }}>
            <Link to="/" aria-label="Empowered DLD home">
              <img src={logoImage} alt="Empowered DLD" style={{ height: 38, width: "auto", display: "block" }} />
            </Link>
          </div>
        </header>

        <section className="lic-hero">
          <div className="lic-container">
            <div className="lic-hero-inner">
              <span className="lic-pill">Free clinical resource</span>
              <h1 className="lic-h1">Language Impact Checklist</h1>
              <p className="lic-sub">
                A free clinical tool for identifying how language difficulties show up
                across a student's school day.
              </p>
              <p className="lic-desc">
                This printable checklist helps SLTs and teachers map where DLD is affecting
                a child's day. Use it in your next assessment, your next IEP meeting, or
                your next parent conversation.
              </p>

              <a
                className="lic-btn"
                href={downloadHref}
                download="language-impact-checklist.pdf"
                onClick={handleDownload}
              >
                Download the Checklist (PDF)
              </a>

              <p className="lic-credit">
                Created by Jinean Cheng, MSc.A S-LP (RADLD Ambassador) and Camesha Russell,
                B.Ed. Co-founders, Empowered DLD.
              </p>
            </div>
          </div>
        </section>

        <section className="lic-also">
          <div className="lic-container">
            <p>
              <Link to="/preview/dan-and-the-paper-airplane">
                Read a sample of Dan and the Paper Airplane, our DLD book series
              </Link>
            </p>
          </div>
        </section>

        <footer className="lic-footer">
          <div className="lic-container">
            <div style={{ marginBottom: 8 }}>
              © {new Date().getFullYear()} Empowered DLD. All rights reserved.
            </div>
            <div>
              <Link to="/privacy-policy">Privacy</Link>
              <Link to="/terms-and-conditions">Terms</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LanguageImpactChecklist;
