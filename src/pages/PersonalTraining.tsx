import LandingPage from "@/components/LandingPage";

const PersonalTraining = () => (
  <LandingPage
    path="/personal-training"
    metaTitle="Personal Training in Fort Lauderdale | Project Sculpt"
    metaDescription="Personal training in Fort Lauderdale with certified coaches. Small-group and 1-on-1 programming for strength, fat loss, HYROX prep, and return-to-training. First class free — code FTL."
    metaKeywords="personal training fort lauderdale, personal trainer fort lauderdale, 1 on 1 training fort lauderdale, private coaching, strength coach fort lauderdale, personal training near me"
    eyebrow="Personal Training"
    h1={
      <>
        Personal Training <span className="text-primary">in Fort Lauderdale</span>
      </>
    }
    lead="Real coaching — not hand-claps. Small-group programming with personal-trainer attention, plus 1-on-1 options for athletes who need a dedicated plan."
    benefits={[
      {
        title: "Personal-Trainer Attention",
        body: "Every class stays small on purpose. Coaches cue your form, load the right weight, and scale each movement to your body and your history.",
      },
      {
        title: "Built on Assessment",
        body: "We start with a movement screen and a clear goal — strength, body composition, HYROX, or just feeling like yourself again. Then we program backward from there.",
      },
      {
        title: "Progress You Can See",
        body: "Weights go up, runs get faster, recovery gets easier. We track the numbers so your sessions compound instead of spinning.",
      },
    ]}
    breakdownTitle="Group energy, personal-trainer precision"
    breakdownBody={
      <>
        <p>
          Most Fort Lauderdale gyms force you to choose: pay a premium for 1-on-1 personal training,
          or save money with a class where the coach can't see you. Project Sculpt was built to
          collapse that trade-off.
        </p>
        <p>
          Class sizes are capped so every athlete gets their form cued, their load adjusted, and their
          workout modified when the day calls for it. If you're rehabbing a shoulder, training through
          pregnancy, or walking in after years away — we meet you where you are, in the same room as
          everyone else.
        </p>
        <p>
          Need more than small-group? We offer private 1-on-1 personal training with our head coaches
          for HYROX race prep, athletic development, and targeted rehab. Email
          <span className="text-primary"> info@projectsculpt-turf.com</span> to scope a plan.
        </p>
      </>
    }
    faqs={[
      {
        question: "Do you offer 1-on-1 personal training in Fort Lauderdale?",
        answer:
          "Yes. Our head coaches take a limited number of private clients for HYROX race prep, strength and physique work, return-to-training, and sport-specific programming. Reach out through the Contact page to schedule.",
      },
      {
        question: "How is this different from a commercial gym personal trainer?",
        answer:
          "Our personal trainers are coaches first — certified, experienced, and bought into a real programming methodology. You're not being sold extra packages; you're being coached toward an actual outcome.",
      },
      {
        question: "Can I try before I commit?",
        answer:
          "Yes — your first class is free with code FTL. It's the best way to see what small-group, coached training at Project Sculpt actually feels like.",
      },
      {
        question: "What neighborhoods do you serve?",
        answer:
          "We're centrally located in downtown Fort Lauderdale — close to Las Olas, Victoria Park, Flagler Village, Rio Vista, Wilton Manors, and Oakland Park.",
      },
      {
        question: "Is personal training right for me if I'm brand new to fitness?",
        answer:
          "Absolutely. Our coaches scale every movement and cue you from rep one. Members regularly tell us this is the first gym where they actually felt coached rather than left alone.",
      },
    ]}
    internalLinks={[
      { label: "Weekly Schedule", to: "/schedule" },
      { label: "HYROX Training", to: "/hyrox" },
      { label: "Group Fitness", to: "/group-fitness" },
      { label: "Running Club", to: "/running" },
      { label: "Meet the Coaches", to: "/team" },
    ]}
  />
);

export default PersonalTraining;
