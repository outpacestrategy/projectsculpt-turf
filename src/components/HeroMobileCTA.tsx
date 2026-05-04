const HeroMobileCTA = () => {
  return (
    <section className="sm:hidden bg-background py-8 px-6">
      <div className="flex flex-col items-center text-center">
        <p className="body-lg max-w-xl mx-auto mb-6 text-center">
          Personal training attention. Group energy. Real results.
        </p>
        
        <a href="#schedule" className="btn-hero inline-flex flex-col items-center">
          <span>First Class Free</span>
          <span className="text-sm font-normal tracking-wider">Use Code <span className="font-bold">FTL</span></span>
        </a>
      </div>
    </section>
  );
};

export default HeroMobileCTA;
