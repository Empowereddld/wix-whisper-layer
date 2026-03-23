import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    if (hash) {
      // Wait for the page to render, then scroll to the element
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else if (navType !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash, navType]);

  return null;
};

export default ScrollToTop;
