import LandingPage from "@/components/LandingPage";

const Hyrox = () => (
  <LandingPage
    path="/hyrox"
    metaTitle="HYROX Training in Fort Lauderdale | Project Sculpt"
    metaDescription="HYROX gym in Fort Lauderdale. Train the 8 HYROX stations — SkiErg, sled push/pull, burpee broad jumps, rowing, farmer's carry, lunges, wall balls — between 1K runs, with certified coaches. First class free."
    metaKeywords="hyrox, hyrox gyms in fort lauderdale, hyrox training florida, hyrox fort lauderdale, hyrox gym near me, hybrid fitness, functional fitness Fort Lauderdale"
    eyebrow="HYROX Training"
    h1={
      <>
        Fort Lauderdale's <span className="text-primary">HYROX Gym</span>
      </>
    }
    lead="Purpose-built HYROX programming: the eight stations, 1K runs in between, and the pacing strategy it takes to finish strong. Coached in small groups so you're never guessing the standard."
    benefits={[
      {
        title: "Every Station, Every Week",
        body: "SkiErg, sled push, sled pull, burpee broad jumps, rowing, farmers carry, sandbag lunges, wall balls — programmed on rotation so race day is never a surprise.",
      },
      {
        title: "Run + Lift Hybrid",
        body: "Structured run blocks paired with compromised-strength work — the exact adaptation HYROX demands. No more gassing out at the 2K mark.",
      },
      {
        title: "Coached Standards",
        body: "Our coaches know competition movement standards. You'll get cleaned up on depth, rep count, and transition efficiency before you show up to a race.",
      },
    ]}
    breakdownTitle="What HYROX training at Project Sculpt looks like"
    breakdownBody={
      <>
        <p>
          HYROX is a hybrid fitness race: eight 1-kilometer runs, each followed by a functional fitness
          station. Training for it means training like a runner and a lifter on the same day — which
          most commercial gyms in Fort Lauderdale aren't built for.
        </p>
        <p>
          Our weekly split rotates through every HYROX station: SkiErg intervals, weighted sled pushes
          and pulls, burpee broad jumps with run-ins, rowing threshold work, farmer's carries at
          competition loads, sandbag lunges, and wall ball accuracy reps. Between blocks, you run. The
          goal is a body that can move a heavy sled under fatigue and still split a sub-5:00 kilometer.
        </p>
        <p>
          Whether you're chasing a sub-60 solo, stepping onto a Doubles or Relay squad, or just want
          the fittest HYROX-style training in Broward County without the race — you're in the right
          room.
        </p>
      </>
    }
    faqs={[
      {
        question: "Is there a HYROX gym in Fort Lauderdale?",
        answer:
          "Yes — Project Sculpt at 207 SW 5th St is Fort Lauderdale's HYROX-focused training studio. We run dedicated HYROX-style classes multiple times per week and coach every station to competition standard.",
      },
      {
        question: "Do I need to be a HYROX athlete to join?",
        answer:
          "No. Most of our members aren't racing — they just want the best hybrid fitness training in Fort Lauderdale. Every class scales from first-timer up to competitive athlete.",
      },
      {
        question: "What are the 8 HYROX stations?",
        answer:
          "SkiErg 1000m, Sled Push 50m, Sled Pull 50m, Burpee Broad Jumps 80m, Rowing 1000m, Farmer's Carry 200m, Sandbag Lunges 100m, Wall Balls 75/100 reps. We rotate all of these into weekly programming.",
      },
      {
        question: "How much does HYROX training cost?",
        answer:
          "Your first class is free with code FTL. Memberships start with drop-in options and unlimited plans — ask us at info@projectsculpt-turf.com and we'll walk you through it.",
      },
      {
        question: "Where are you located?",
        answer:
          "207 SW 5th St, Fort Lauderdale, FL 33301 — two minutes from Las Olas Boulevard and easy drive-in from Victoria Park, Wilton Manors, and Flagler Village.",
      },
    ]}
    internalLinks={[
      { label: "Weekly Schedule", to: "/schedule" },
      { label: "Group Fitness", to: "/group-fitness" },
      { label: "Running Club", to: "/running" },
      { label: "Personal Training", to: "/personal-training" },
      { label: "Meet the Coaches", to: "/team" },
    ]}
  />
);

export default Hyrox;
