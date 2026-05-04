import { useEffect, useRef, useState } from "react";
import { Instagram } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer";
import { supabase } from "@/integrations/supabase/client";

// Fallback data used while DB loads or if empty
const fallbackPosts = [
  { image: "/images/community/member-1.jpeg", testimonial: "Best decision I made this year. The coaches actually care about your form.", name: "Sarah K.", age: 26 },
  { image: "/images/community/member-2.jpeg", testimonial: "The energy here is unmatched. Every session pushes you to be better.", name: "Mike & Jordan", age: 28 },
  { image: "/images/community/member-3.jpeg", testimonial: "Finally found a gym where I actually look forward to showing up.", name: "The Crew", age: null },
  { image: "/images/community/member-4.jpeg", testimonial: "Made more gains in 2 months than my last year at a big-box gym.", name: "Emma L.", age: 25 },
  { image: "/images/community/member-5.jpeg", testimonial: "The community here is everything. We push each other every day.", name: "Taylor & Nicole", age: 27 },
  { image: "/images/community/member-6.jpeg", testimonial: "From couch to HYROX competitor in 6 months. This place is magic.", name: "The Squad", age: null },
];

type CommunityPost = {
  image: string;
  testimonial: string;
  name: string;
  age: number | null;
};

const Community = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>(fallbackPosts);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("community_photos").select("*").order("sort_order");
      if (data && data.length > 0) {
        setPosts(
          data.map((p) => ({
            image: p.image_url,
            testimonial: p.testimonial,
            name: p.name,
            age: p.age,
          }))
        );
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-padding bg-gradient-to-b from-background via-secondary/20 to-background"
      aria-label="Community testimonials"
    >
      <div className="container mx-auto px-6 sm:px-8">
        <div className="text-center mb-12 sm:mb-16 flex flex-col items-center">
          <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase leading-none mb-4 text-center whitespace-nowrap ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
            The <span className="text-primary">Sculpt</span> Community
          </h2>
          <p className={`text-xs sm:text-sm md:text-base max-w-2xl mx-auto text-center px-2 uppercase tracking-wider whitespace-nowrap text-muted-foreground ${isVisible ? "animate-fade-up delay-100" : "opacity-0"}`} style={{ animationFillMode: 'forwards' }}>
            The results speak for themselves
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6" role="list" aria-label="Community testimonials">
          {posts.map((post, index) => (
            <figure
              key={post.name}
              className={`group ${isVisible ? `animate-fade-up delay-${(index + 2) * 100}` : "opacity-0"}`}
              style={{ animationFillMode: 'forwards' }}
              onClick={() => setSelectedPost(post)}
              role="listitem"
            >
              <div className="relative overflow-hidden aspect-square cursor-pointer mb-2 sm:mb-3">
                <img
                  src={post.image}
                  alt={`${post.name}${post.age ? `, age ${post.age}` : ''}, member at Project Sculpt Fort Lauderdale fitness studio`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <blockquote className="text-foreground text-xs sm:text-sm mb-1 line-clamp-2">
                "{post.testimonial}"
              </blockquote>
              <figcaption className="text-primary text-xs sm:text-sm font-semibold">
                {post.name}{post.age ? `, ${post.age}` : ''}
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Instagram CTA */}
        <div className={`mt-12 text-center ${isVisible ? "animate-fade-up delay-500" : "opacity-0"}`} style={{ animationFillMode: 'forwards' }}>
          <a
            href="https://instagram.com/projectsculpt_turf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 border border-border hover:border-primary transition-colors duration-300 group"
          >
            <Instagram className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">
              Follow @projectsculpt_turf
            </span>
          </a>
        </div>
      </div>

      {/* Image Drawer */}
      <Drawer open={!!selectedPost} onOpenChange={(open) => !open && setSelectedPost(null)}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerTitle className="sr-only">
            {selectedPost?.name} Testimonial
          </DrawerTitle>
          {selectedPost && (
            <div className="p-4 pb-8 overflow-y-auto">
              <div className="max-w-2xl mx-auto">
                <img
                  src={selectedPost.image}
                  alt={`${selectedPost.name} training at Project Sculpt`}
                  className="w-full aspect-square object-cover rounded-lg mb-4"
                />
                <p className="text-foreground text-base sm:text-lg mb-2">
                  "{selectedPost.testimonial}"
                </p>
                <p className="text-primary font-semibold">
                  {selectedPost.name}{selectedPost.age ? `, ${selectedPost.age}` : ''}
                </p>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </section>
  );
};

export default Community;
