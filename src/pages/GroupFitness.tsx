import LandingPage from "@/components/LandingPage";

const GroupFitness = () => (
  <LandingPage
    path="/group-fitness"
    metaTitle="Group Fitness Classes in Fort Lauderdale | Project Sculpt"
    metaDescription="Group fitness training in Fort Lauderdale. Small-group strength, conditioning, and HYROX-style classes with real coaching. 5:30 AM to 8 PM weekdays. First class free."
    metaKeywords="group fitness fort lauderdale, group fitness training, group fitness classes fort lauderdale, small group training, strength and conditioning classes, workout classes las olas"
    eyebrow="Group Fitness"
    h1={
      <>
        Group Fitness That <span className="text-primary">Actually Coaches You</span>
      </>
    }
    lead="The energy of a group class, the structure of a real training program, the attention of a personal trainer. Fort Lauderdale's small-group fitness home."
    benefits={[
      {
        title: "Small-Group By Design",
        body: "Classes stay small so coaches can see every rep. You won't get lost in a packed room or stuck guessing the workout.",
      },
      {
        title: "Programmed, Not Random",
        body: "Every week follows a structured split — strength days, conditioning days, HYROX days. You'll see measurable progress, not just a good sweat.",
      },
      {
        title: "All Levels Welcome",
        body: "Every movement scales. Day-one beginners train alongside veteran athletes — everyone gets the right stimulus for their body.",
      },
    ]}
    breakdownTitle="What group fitness training looks like at Project Sculpt"
    breakdownBody={
      <>
        <p>
          Most group fitness classes in Fort Lauderdale fall into one of two camps: random beat-down
          workouts that leave you exhausted without a plan, or choreographed cardio with a coach at
          the front of the room who never corrects your form.
        </p>
        <p>
          We program differently. Every week runs on a purpose-built strength and conditioning split
          with dedicated HYROX-style days mixed in. Coaches demo every movement, cue your form on the
          floor, and scale loads to match your training age. The energy is high, but every rep counts.
        </p>
        <p>
          Classes run from 5:30 AM into the evening weekdays and Saturday/Sunday mornings — easy to
          plug into whether you're commuting from downtown Fort Lauderdale, Las Olas, Victoria Park,
          or Wilton Manors.
        </p>
      </>
    }
    faqs={[
      {
        question: "What is small-group training?",
        answer:
          "Small-group training caps class size so the coach can see and coach every athlete through every rep. You get the accountability and energy of a group with the attention of a personal trainer.",
      },
      {
        question: "What types of classes do you offer?",
        answer:
          "Strength days, conditioning days, HYROX-style hybrid days, and running-focused work. The schedule rotates through all of them every week.",
      },
      {
        question: "Do I need experience to join?",
        answer:
          "No. Every movement scales and our coaches adjust in real time. Most members are working professionals and not former athletes — you'll fit right in.",
      },
      {
        question: "How early and late do classes run?",
        answer:
          "Weekdays from 5:30 AM to 8:00 PM, and Saturday/Sunday mornings from 7:00 AM to 12:00 PM. See the homepage schedule for the current week.",
      },
      {
        question: "Is my first class really free?",
        answer:
          "Yes — use code FTL when you reserve. No card required to try your first workout.",
      },
    ]}
    internalLinks={[
      { label: "Weekly Schedule", to: "/schedule" },
      { label: "HYROX Training", to: "/hyrox" },
      { label: "Running Club", to: "/running" },
      { label: "Personal Training", to: "/personal-training" },
      { label: "Meet the Coaches", to: "/team" },
    ]}
  />
);

export default GroupFitness;
