import { ChevronRight } from "lucide-react";

const PartnershipPackagesSection = () => {
  return (
    <section className="py-10 md:py-16 lg:py-[120px]">
      <div className="container px-6 md:px-8">
        <div className="mb-8 md:mb-10 lg:mb-14 text-center">
          <h2 className="text-[28px] md:text-[38px] lg:text-[46px] font-black text-foreground leading-[1.1] mb-3">
            Partnership Packages to Support Your Community
          </h2>
          <p className="text-[13px] md:text-[14px] lg:text-[16px] text-muted-foreground leading-[1.7] max-w-[700px] mx-auto">
            Choose the level of support that fits your organization's budget and community needs. Our programs can be funded through family support, mental health, or community development grants.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 lg:gap-8 max-w-[900px] mx-auto">
          {/* Package 1 */}
          <div className="border border-border rounded-lg overflow-hidden flex flex-col">
            <div className="bg-deep-purple text-deep-purple-foreground px-6 py-5 text-center">
              <h3 className="text-[18px] md:text-[20px] font-black">Community Workshop Package</h3>
            </div>
            <div className="p-6 md:p-8 flex flex-col flex-1">
              <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7] mb-5 text-center">
                <span className="font-bold text-foreground">Best for:</span> Organizations with grant funding for community education and family support programs
              </p>

              <p className="text-[13px] md:text-[14px] font-semibold text-foreground mb-3">What's included:</p>

              <p className="text-[13px] md:text-[14px] font-bold text-foreground mb-1">Workshop & Training:</p>
              <ul className="list-disc pl-5 space-y-1 text-[13px] md:text-[14px] text-muted-foreground leading-[1.7] mb-4">
                <li>2-hour parent workshop (virtual or in-person)</li>
                <li>Digital workshop materials for attendees</li>
              </ul>

              <p className="text-[13px] md:text-[14px] font-bold text-foreground mb-1">Resources:</p>
              <ul className="list-disc pl-5 space-y-1 text-[13px] md:text-[14px] text-muted-foreground leading-[1.7] mb-4">
                <li>15 copies of Dan & Daria books</li>
                <li>Parent Guidebook for every attending family (max 50 copies, practical strategies for home support)</li>
                <li>3-month digital resource library access for all participants</li>
              </ul>

              <p className="text-[13px] md:text-[14px] font-bold text-foreground mb-1">Support:</p>
              <ul className="list-disc pl-5 space-y-1 text-[13px] md:text-[14px] text-muted-foreground leading-[1.7] mb-8">
                <li>30-minute implementation planning call</li>
                <li>Position your organization as a leader in supporting families with language challenges</li>
              </ul>

              <div className="mt-auto text-center">
                <p className="text-[28px] md:text-[32px] font-black text-foreground mb-4">$1500</p>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-1 h-12 px-8 border border-foreground text-foreground text-[11px] md:text-[12px] font-bold uppercase tracking-[0.12em] hover:bg-foreground hover:text-background transition-colors duration-200"
                >
                  CONTACT US <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Package 2 */}
          <div className="border border-border rounded-lg overflow-hidden flex flex-col">
            <div className="bg-deep-purple text-deep-purple-foreground px-6 py-5 text-center">
              <h3 className="text-[18px] md:text-[20px] font-black">Staff + Family Training</h3>
            </div>
            <div className="p-6 md:p-8 flex flex-col flex-1">
              <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7] mb-5 text-center">
                <span className="font-bold text-foreground">Best for:</span> Organizations committed to evidence-based programs for diverse communities
              </p>

              <p className="text-[13px] md:text-[14px] font-semibold text-foreground mb-3">What's included:</p>

              <p className="text-[13px] md:text-[14px] font-bold text-foreground mb-1">Everything from Tier 1, PLUS:</p>

              <p className="text-[13px] md:text-[14px] font-bold text-foreground mt-3 mb-1">Additional Training:</p>
              <ul className="list-disc pl-5 space-y-1 text-[13px] md:text-[14px] text-muted-foreground leading-[1.7] mb-4">
                <li>2.5-hour staff training for up to 30 participants</li>
                <li>Certificate of attendance provided</li>
                <li>Build your organization's capacity to recognize and support DLD in the populations you serve</li>
              </ul>

              <p className="text-[13px] md:text-[14px] font-bold text-foreground mb-1">Additional Resources:</p>
              <ul className="list-disc pl-5 space-y-1 text-[13px] md:text-[14px] text-muted-foreground leading-[1.7] mb-4">
                <li>25 copies of Dan & Daria books</li>
                <li>DLD Recognition Toolkit for your team</li>
                <li>Customized implementation plan for your organization</li>
                <li>Bulletin board display kit (print-ready materials)</li>
                <li>One year of downloadable family resources</li>
              </ul>

              <p className="text-[13px] md:text-[14px] font-bold text-foreground mb-1">Extended Support:</p>
              <ul className="list-disc pl-5 space-y-1 text-[13px] md:text-[14px] text-muted-foreground leading-[1.7] mb-8">
                <li>60-day email support</li>
                <li>30-day follow-up check-in call</li>
              </ul>

              <div className="mt-auto text-center">
                <p className="text-[28px] md:text-[32px] font-black text-foreground mb-4">$3000</p>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-1 h-12 px-8 border border-foreground text-foreground text-[11px] md:text-[12px] font-bold uppercase tracking-[0.12em] hover:bg-foreground hover:text-background transition-colors duration-200"
                >
                  CONTACT US <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnershipPackagesSection;
