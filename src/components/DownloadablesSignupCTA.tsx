import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";

const DownloadablesSignupCTA = () => {
  const fade = useScrollFadeIn();

  return (
    <section className="bg-muted py-16 md:py-20">
      <div
        ref={fade.ref}
        className={`container px-6 md:px-8 max-w-3xl mx-auto text-center flex flex-col items-center gap-6 ${fade.className}`}
      >
        <h2 className="text-[26px] md:text-[34px] lg:text-[40px] font-black text-foreground leading-[1.1]">
          Ready to Access Everything?
        </h2>
        <p className="text-[15px] text-muted-foreground max-w-md">
          Create a free account and get instant, lifetime access to our full
          resource library.
        </p>
        <Button
          asChild
          size="lg"
          className="rounded-full h-14 px-10 text-base font-semibold"
        >
          <Link to="/hub/preview">Create Free Account</Link>
        </Button>
      </div>
    </section>
  );
};

export default DownloadablesSignupCTA;
