import { useState, useEffect, useRef } from "react";
import { Clock, User, Dumbbell, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { trackSchedule, trackEvent } from "@/lib/analytics";
import { BOOKING_URL, PRICING_URL } from "@/lib/links";

type ClassSession = {
  id: string;
  time: string;
  end_time: string;
  title: string;
  coach: string;
};

type DaySchedule = {
  day: string;
  shortDay: string;
  tag: string;
  classes: ClassSession[];
};

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_SHORTS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const getDuration = (start: string, end: string): string => {
  const parseTime = (t: string) => {
    const [time, period] = t.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    let h = hours;
    if (period === "PM" && hours !== 12) h += 12;
    if (period === "AM" && hours === 12) h = 0;
    return h * 60 + minutes;
  };
  const diff = parseTime(end) - parseTime(start);
  return `${diff} min`;
};

const WeeklySchedule = () => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [scheduleData, setScheduleData] = useState<DaySchedule[]>(
    DAY_NAMES.map((d, i) => ({ day: d, shortDay: DAY_SHORTS[i], tag: "", classes: [] }))
  );
  const sectionRef = useRef<HTMLElement>(null);

  const openBooking = (session: ClassSession, day: string) => {
    trackSchedule("weekly_schedule_book", {
      day,
      title: session.title,
      time: session.time,
    });
    window.open(BOOKING_URL, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    const today = new Date().getDay();
    setSelectedDay(today === 0 ? 6 : today - 1);
  }, []);

  useEffect(() => {
    const fetchSchedule = async () => {
      const { data } = await supabase
        .from("schedule_classes")
        .select("*")
        .order("day_of_week")
        .order("sort_order");
      if (data && data.length > 0) {
        const grouped: DaySchedule[] = DAY_NAMES.map((d, i) => ({
          day: d,
          shortDay: DAY_SHORTS[i],
          tag: "",
          classes: [],
        }));
        data.forEach((cls) => {
          const day = grouped[cls.day_of_week];
          if (day) {
            if (cls.day_tag) day.tag = cls.day_tag;
            day.classes.push({
              id: cls.id,
              time: cls.time,
              end_time: cls.end_time,
              title: cls.title,
              coach: cls.coach,
            });
          }
        });
        setScheduleData(grouped);
      }
    };
    fetchSchedule();
  }, []);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleDaySelect = (index: number) => {
    if (index === selectedDay) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedDay(index);
      setIsTransitioning(false);
    }, 100);
  };

  const getTodayIndex = () => {
    const today = new Date().getDay();
    return today === 0 ? 6 : today - 1;
  };

  const todayIndex = getTodayIndex();
  const currentDayData = scheduleData[selectedDay];

  return (
    <section ref={sectionRef} id="schedule" className="section-padding bg-background" aria-label="Weekly class schedule">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Header */}
        <div className={`text-center mb-8 md:mb-14 ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4 md:mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] md:text-xs font-medium text-primary uppercase tracking-wider">
              Book your first class free
            </span>
          </div>
          <h2 className="heading-lg mb-3 md:mb-4">
            Weekly <span className="text-primary">Schedule</span>
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-xl mx-auto">
            Structured programming for consistent progress
          </p>
        </div>

        {/* Week-at-a-Glance Pills */}
        <div
          className={`mb-5 md:mb-10 ${isVisible ? "animate-fade-up delay-100" : "opacity-0"}`}
          style={{ animationFillMode: "forwards" }}
        >
          {/* Mobile */}
          <div className="md:hidden grid grid-cols-7 gap-1.5">
            {scheduleData.map((day, index) => (
              <button
                key={day.shortDay}
                onClick={() => handleDaySelect(index)}
                className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-lg border transition-all duration-200 active:scale-95 ${
                  selectedDay === index
                    ? "bg-primary text-primary-foreground border-primary shadow-[0_0_12px_hsla(195,100%,50%,0.25)]"
                    : "bg-card border-border/60"
                } ${index === todayIndex && selectedDay !== index ? "border-primary/40" : ""}`}
              >
                {index === todayIndex && selectedDay !== index && (
                  <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
                <span className={`text-[10px] font-bold tracking-wide ${selectedDay === index ? "" : "text-foreground"}`}>
                  {day.shortDay}
                </span>
              </button>
            ))}
          </div>

          {/* Desktop */}
          <div className="hidden md:grid grid-cols-7 gap-3">
            {scheduleData.map((day, index) => (
              <button
                key={day.shortDay}
                onClick={() => handleDaySelect(index)}
                className={`relative flex flex-col items-center justify-center py-4 px-3 rounded-xl border transition-all duration-300 group ${
                  selectedDay === index
                    ? "bg-primary text-primary-foreground border-primary shadow-[0_0_24px_hsla(195,100%,50%,0.35)]"
                    : "bg-card border-border hover:border-primary/50 hover:bg-card/80"
                }`}
              >
                {index === todayIndex && (
                  <span
                    className={`absolute -top-1.5 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      selectedDay === index ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary text-primary-foreground"
                    }`}
                  >
                    Today
                  </span>
                )}
                <span className={`text-sm font-bold tracking-wider ${selectedDay === index ? "" : "text-foreground group-hover:text-primary"}`}>
                  {day.shortDay}
                </span>
                <span className={`text-[11px] mt-1 font-medium ${selectedDay === index ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {day.tag}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Day Title */}
        <div className={`mb-4 md:mb-6 ${isVisible ? "animate-fade-up delay-200" : "opacity-0"}`} style={{ animationFillMode: "forwards" }}>
          <div className="md:hidden flex items-center gap-2">
            <h3 className="font-display text-xl tracking-wide">{currentDayData.day}</h3>
            <span className="text-muted-foreground">·</span>
            <span className="text-sm text-muted-foreground">
              {currentDayData.classes.length} {currentDayData.classes.length === 1 ? "class" : "classes"}
            </span>
          </div>
          <div className="hidden md:block">
            <h3 className="font-display text-3xl tracking-wide">{currentDayData.day}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {currentDayData.classes.length} {currentDayData.classes.length === 1 ? "class" : "classes"} available
            </p>
          </div>
        </div>

        {/* Class Cards */}
        <div
          className={`space-y-3 md:space-y-4 transition-opacity duration-100 ${isTransitioning ? "opacity-0" : "opacity-100"} ${
            isVisible ? "animate-fade-up delay-300" : "opacity-0"
          }`}
          style={{ animationFillMode: "forwards" }}
        >
          {currentDayData.classes.length > 0 ? (
            currentDayData.classes.map((session, index) => (
              <div
                key={session.id || `${currentDayData.day}-${index}`}
                className="group relative bg-card border border-border/50 md:border-border rounded-lg md:rounded-xl p-4 md:p-6 transition-all duration-200 active:scale-[0.99] md:active:scale-100 md:hover:border-primary/50 md:hover:shadow-[0_4px_20px_hsla(0,0%,0%,0.3)]"
              >
                {/* Mobile Layout */}
                <div className="md:hidden relative">
                  <div className="absolute top-0 right-0 flex flex-col items-end">
                    <Button
                      size="sm"
                      className="btn-primary py-2 px-5 text-xs font-bold tracking-wider active:scale-95"
                      onClick={() => openBooking(session, currentDayData.day)}
                    >
                      BOOK
                    </Button>
                    <span className="text-xs text-primary font-medium mt-1">28 spots</span>
                  </div>
                  <div className="pr-24">
                    <div className="flex items-center gap-2 mb-1">
                      <time dateTime={session.time} className="text-sm font-semibold text-foreground">{session.time}</time>
                      <span className="text-xs text-muted-foreground">· {getDuration(session.time, session.end_time)}</span>
                    </div>
                    <h4 className="font-display text-lg tracking-wide mb-1">{session.title}</h4>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <User className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{session.coach}</span>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:flex md:flex-row md:items-center gap-6">
                  <div className="flex items-center gap-3 min-w-[140px]">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary">
                      <Clock className="w-4 h-4 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <time dateTime={session.time} className="text-sm font-semibold text-foreground block">{session.time}</time>
                      <time dateTime={session.end_time} className="text-xs text-muted-foreground block">{session.end_time}</time>
                    </div>
                  </div>
                  <div className="w-px h-10 bg-border" />
                  <div className="flex-1">
                    <h4 className="font-display text-xl tracking-wide mb-1">{session.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{session.coach}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-primary font-medium">28 spots</span>
                    <Button
                      size="sm"
                      className="btn-primary py-2 px-5 text-sm"
                      onClick={() => openBooking(session, currentDayData.day)}
                    >
                      Book
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 md:py-16 px-4 md:px-6 bg-card border border-border/50 md:border-border rounded-lg md:rounded-xl">
              <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                <Dumbbell className="w-6 h-6 md:w-7 md:h-7 text-muted-foreground" />
              </div>
              <h4 className="font-display text-lg md:text-xl mb-2">No Classes Today</h4>
              <p className="text-sm text-muted-foreground mb-5 md:mb-6 max-w-sm mx-auto">
                Rest days are important too. Check out tomorrow's classes.
              </p>
              <Button className="btn-primary active:scale-95">Join Our Next Class</Button>
            </div>
          )}
        </div>

        {/* See all pricing */}
        <div
          className={`mt-8 md:mt-10 flex flex-col items-center gap-3 ${
            isVisible ? "animate-fade-up delay-500" : "opacity-0"
          }`}
          style={{ animationFillMode: "forwards" }}
        >
          <a
            href={PRICING_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("pricing_link_click", { source: "weekly_schedule" })}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:border-primary hover:bg-primary/5 transition-colors text-sm font-semibold tracking-wide"
          >
            See all pricing &amp; memberships
            <ArrowUpRight className="w-4 h-4 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </a>
          <p className="text-xs text-muted-foreground">
            First class free — use code <span className="font-bold text-primary">FTL</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default WeeklySchedule;
