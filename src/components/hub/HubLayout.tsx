import HubHeader from "./HubHeader";

const HubLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <HubHeader />
      <main>{children}</main>
    </div>
  );
};

export default HubLayout;
