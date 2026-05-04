import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import NoIndex from "@/components/NoIndex";

const AdminGuide = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <NoIndex title="Admin Guide | Project Sculpt" />
      <header className="border-b border-border px-4 sm:px-6 py-4 flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Button>
        <h1 className="font-display text-2xl tracking-wide">Admin Guide</h1>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-3xl prose prose-invert prose-sm">
        {/* LOGIN */}
        <section className="mb-10">
          <h2 className="font-display text-xl mb-3 text-foreground">🔐 Logging In</h2>
          <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
            <li>
              Go to{" "}
              <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-xs">
                projectsculpt-turf.com/admin/login
              </code>
            </li>
            <li>Enter your admin email and password.</li>
            <li>
              Click <strong className="text-foreground">Sign In</strong>. You'll be taken to the Admin Dashboard.
            </li>
            <li>
              To log out, click <strong className="text-foreground">Sign Out</strong> in the top-right corner.
            </li>
          </ol>
          <p className="text-xs text-muted-foreground mt-2 italic">
            Only authorized accounts can log in. There is no public registration.
          </p>
        </section>

        {/* DASHBOARD OVERVIEW */}
        <section className="mb-10">
          <h2 className="font-display text-xl mb-3 text-foreground">📋 Dashboard Overview</h2>
          <p className="text-muted-foreground mb-3">
            The dashboard has <strong className="text-foreground">three tabs</strong> at the top:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>
              <strong className="text-foreground">Schedule</strong> — Manage the weekly class timetable.
            </li>
            <li>
              <strong className="text-foreground">Community</strong> — Manage member photos & testimonials.
            </li>
            <li>
              <strong className="text-foreground">Coaches</strong> — Manage the coaching staff shown on the Team page.
            </li>
          </ul>
          <p className="text-muted-foreground mt-3">
            All changes you make are <strong className="text-foreground">saved automatically</strong> and appear on the
            live website <strong className="text-foreground">in real time</strong> — no need to publish or refresh.
          </p>
        </section>

        {/* SCHEDULE */}
        <section className="mb-10">
          <h2 className="font-display text-xl mb-3 text-foreground">📅 Managing the Schedule</h2>
          <div className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="text-foreground font-semibold text-sm mb-1">Adding a Class</h3>
              <ol className="list-decimal pl-5 space-y-1">
                <li>
                  Click <strong className="text-foreground">Add Class</strong>.
                </li>
                <li>Fill in the day, title, time, end time, coach name, and optional day tag.</li>
                <li>
                  Click <strong className="text-foreground">Add</strong> to save.
                </li>
              </ol>
            </div>
            <div>
              <h3 className="text-foreground font-semibold text-sm mb-1">Editing a Class</h3>
              <p>
                Click the <strong className="text-foreground">pencil icon</strong> next to any class to edit its
                details.
              </p>
            </div>
            <div>
              <h3 className="text-foreground font-semibold text-sm mb-1">Deleting a Class</h3>
              <p>
                Click the <strong className="text-foreground">trash icon</strong> next to any class to remove it.
              </p>
            </div>
          </div>
        </section>

        {/* COMMUNITY */}
        <section className="mb-10">
          <h2 className="font-display text-xl mb-3 text-foreground">🤝 Managing Community Photos</h2>
          <div className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="text-foreground font-semibold text-sm mb-1">Adding a Photo</h3>
              <ol className="list-decimal pl-5 space-y-1">
                <li>
                  Click <strong className="text-foreground">Add Photo</strong>.
                </li>
                <li>
                  Upload an image using the <strong className="text-foreground">Upload</strong> button (or paste a URL).
                </li>
                <li>Enter the member's name, age (optional), and testimonial quote.</li>
                <li>
                  Click <strong className="text-foreground">Add</strong> to save.
                </li>
              </ol>
            </div>
            <div>
              <h3 className="text-foreground font-semibold text-sm mb-1">Editing & Deleting</h3>
              <p>
                Hover over any photo card to reveal the <strong className="text-foreground">edit</strong> and{" "}
                <strong className="text-foreground">delete</strong> buttons.
              </p>
            </div>
          </div>
        </section>

        {/* COACHES */}
        <section className="mb-10">
          <h2 className="font-display text-xl mb-3 text-foreground">🏋️ Managing Coaches</h2>
          <div className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="text-foreground font-semibold text-sm mb-1">Adding a Coach</h3>
              <ol className="list-decimal pl-5 space-y-1">
                <li>
                  Click <strong className="text-foreground">Add Coach</strong>.
                </li>
                <li>Enter name, role, and certifications.</li>
                <li>
                  Upload a photo using the <strong className="text-foreground">Upload</strong> button (opens your camera
                  on mobile) or paste an image URL.
                </li>
                <li>Write a short bio.</li>
                <li>
                  Click <strong className="text-foreground">Add</strong> to save.
                </li>
              </ol>
            </div>
            <div>
              <h3 className="text-foreground font-semibold text-sm mb-1">Reordering Coaches</h3>
              <p>
                Use the <strong className="text-foreground">up/down arrows</strong> on the left side of each coach card
                to change the display order on the Team page.
              </p>
            </div>
            <div>
              <h3 className="text-foreground font-semibold text-sm mb-1">Editing & Deleting</h3>
              <p>
                Click the <strong className="text-foreground">pencil icon</strong> to edit or the{" "}
                <strong className="text-foreground">trash icon</strong> to delete a coach.
              </p>
            </div>
          </div>
        </section>

        {/* WEBSITE PAGES */}
        <section className="mb-10">
          <h2 className="font-display text-xl mb-3 text-foreground">🌐 Website Pages</h2>
          <p className="text-muted-foreground mb-3">Your website has the following public pages:</p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              <strong className="text-foreground">Home</strong> — Hero video, weekly schedule, how it works, community
              section, and call-to-action.
            </li>
            <li>
              <strong className="text-foreground">Team</strong> — Displays all coaches you manage from the dashboard.
            </li>
            <li>
              <strong className="text-foreground">Contact</strong> — Contact information for visitors.
            </li>
          </ul>
        </section>

        {/* TIPS */}
        <section className="mb-10">
          <h2 className="font-display text-xl mb-3 text-foreground">💡 Tips</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              You can use the <strong className="text-foreground">View Site</strong> button in the dashboard header to
              preview the live site.
            </li>
            <li>
              On mobile, the <strong className="text-foreground">Upload</strong> button lets you take a photo directly
              with your camera.
            </li>
            <li>Changes appear instantly — no need to hit "publish" or refresh the page.</li>
            <li>If you accidentally delete something, it cannot be undone, so double-check before deleting.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AdminGuide;
