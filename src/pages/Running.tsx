import LandingPage from "@/components/LandingPage";

const Running = () => (
  <LandingPage
    path="/running"
    metaTitle="Running Gym & Running Club in Fort Lauderdale | Project Sculpt"
    metaDescription="Fort Lauderdale's running gym. Coached run + strength programming for 5K, 10K, half marathon, HYROX, and the A1A. Drop in for a class or join the weekend run club."
    metaKeywords="running gyms, running gym fort lauderdale, running club fort lauderdale, run coach fort lauderdale, strength training for runners, hyrox run training, a1a marathon training"
    eyebrow="Running Club"
    h1={
      <>
        Fort Lauderdale's <span className="text-primary">Running Gym</span>
      </>
    }
    lead="Coached running paired with the strength work that keeps you injury-free. Train for a 5K, the A1A Half, your first HYROX, or just stop hating mile three."
    benefits={[
      {
        title: "Run + Strength, Not One Or The Other",
        body: "Runners who only run break down. We pair structured run blocks with the posterior-chain, core, and single-leg work that keeps your stride efficient all year.",
      },
      {
        title: "Coached Workouts",
        body: "Tempo, threshold, VO₂, and long runs — with actual pacing guidance. Not a Strava screenshot and a wave goodbye.",
      },
      {
        title: "HYROX-Ready Running",
        body: "The HYROX 1K-run-between-stations pattern is its own skill. Our hybrid programming makes those transitions feel automatic.",
      },
    ]}
    breakdownTitle="Why your running deserves a gym, not just a road"
    breakdownBody={
      <>
        <p>
          If you're searching for a running gym in Fort Lauderdale, you probably already know that
          miles alone aren't enough. The runners who stay healthy and actually get faster are the ones
          who lift, mobilize, and train at intent — not just log steady-state distance.
        </p>
        <p>
          At Project Sculpt we program running as a skill. Coached intervals on the SkiErg and
          treadmill, tempo and threshold work, long-run guidance, and the accessory strength
          (hamstrings, glutes, single-leg stability, trunk) that lets you train hard without blowing
          out a knee.
        </p>
        <p>
          Whether your goal is your first 5K along the A1A, a half marathon PR, a HYROX qualifier, or
          simply running down Las Olas without your calves locking up — we have a track for you.
        </p>
      </>
    }
    faqs={[
      {
        question: "Is there a running club in Fort Lauderdale I can join?",
        answer:
          "Yes — Project Sculpt runs coached run-focused classes and weekend community runs open to members and drop-ins. Bring your code FTL for a free first class.",
      },
      {
        question: "Do I need to be a fast runner to join?",
        answer:
          "No. Pace is individual — every workout prescribes effort, not a universal split. Beginners and sub-20 5K runners train in the same class and both get the right stimulus.",
      },
      {
        question: "Can you help me train for the A1A Half or Fort Lauderdale 5K?",
        answer:
          "Yes. We build seasonal run blocks for the local race calendar. Come talk to a coach and we'll map out the eight to sixteen weeks ahead of your goal race.",
      },
      {
        question: "How does running tie into HYROX training?",
        answer:
          "HYROX is eight 1K runs stitched between functional stations. Running under fatigue is a skill — our hybrid programming trains exactly that, so the transitions on race day feel familiar.",
      },
      {
        question: "What should I bring?",
        answer:
          "Running shoes you trust, a water bottle, and training clothes you can lift in. We'll provide the rest.",
      },
    ]}
    internalLinks={[
      { label: "Weekly Schedule", to: "/schedule" },
      { label: "HYROX Training", to: "/hyrox" },
      { label: "Group Fitness", to: "/group-fitness" },
      { label: "Personal Training", to: "/personal-training" },
      { label: "Meet the Coaches", to: "/team" },
    ]}
  />
);

export default Running;
