const StoryBuildersStatBand = () => {
  return (
    <section className="bg-foreground text-background">
      <div className="container max-w-5xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-12 px-6 md:px-8">
        <h2 className="text-[22px] sm:text-[32px] md:text-[52px] font-bold leading-[1.1] max-w-[480px]">You can see your child struggling with language...
        </h2>
        <div className="max-w-md flex flex-col gap-4 text-[13px] md:text-[17px] text-background/85 leading-[1.65] border-l-2 border-background/20 pl-8">
          <div>
            <p className="font-semibold text-background mb-1">They may have trouble:</p>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li>following stories</li>
              <li>answering questions</li>
              <li>explaining what happened at school</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-background mb-1">You might be:</p>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li>waiting for speech therapy</li>
              <li>trying to support learning between sessions</li>
            </ul>
          </div>
          <p className="text-[15px] md:text-[19px] italic">And still wondering where to start.</p>
        </div>
      </div>
    </section>
  );
};

export default StoryBuildersStatBand;
