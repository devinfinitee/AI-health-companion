import { useState, useEffect, useRef, useMemo } from "react";
import { Search, Mic, Book } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import gsap from "gsap";
import AnimatedPage from "@/components/AnimatedPage";
import { get } from "@/lib/api";

export default function Resources() {
  const [search, setSearch] = useState("");
  const [diseases, setDiseases] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const personalizedRef = useRef<HTMLDivElement>(null);
  const popularRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          opacity: 0,
          y: -30,
          duration: 0.6,
          ease: "power2.out"
        });
      }

      const personalizedCards = personalizedRef.current?.querySelectorAll(".card-item");
      if (personalizedCards && personalizedCards.length > 0) {
        gsap.from(personalizedCards, {
          opacity: 0,
          y: 30,
          stagger: 0.15,
          duration: 0.6,
          delay: 0.2,
          ease: "power2.out"
        });
      }

      const popularCards = popularRef.current?.querySelectorAll(".card-item");
      if (popularCards && popularCards.length > 0) {
        gsap.from(popularCards, {
          opacity: 0,
          y: 30,
          stagger: 0.1,
          duration: 0.6,
          delay: 0.4,
          ease: "power2.out"
        });
      }
    });

    return () => ctx.revert();
  }, []);
  useEffect(() => {
    const loadDiseases = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await get("/health/diseases");
        const list = res?.data?.diseases || [];
        setDiseases(list);
      } catch (err: any) {
        console.error("Failed to fetch diseases:", err);
        setError(err?.message || "Failed to load health resources.");
      } finally {
        setLoading(false);
      }
    };

    loadDiseases();
  }, []);

  const filteredDiseases = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return diseases;
    return diseases.filter((d) => {
      const name = d.name?.toLowerCase?.() || "";
      const category = d.category?.toLowerCase?.() || "";
      const description = d.description?.toLowerCase?.() || "";
      return (
        name.includes(term) ||
        category.includes(term) ||
        description.includes(term)
      );
    });
  }, [diseases, search]);

  return (
    <AnimatedPage className="min-h-[calc(100vh-8rem)] md:min-h-[calc(100vh-4rem)] pb-20 md:pb-8">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8" ref={headerRef}>
          <h1 className="font-heading font-bold text-3xl md:text-4xl mb-3">Health Resources</h1>
          <p className="text-muted-foreground mb-6">Knowledge for a healthier you</p>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for topics..."
                className="pl-9"
                data-testid="input-search-resources"
              />
            </div>
            <Button size="icon" variant="outline" data-testid="button-voice-search">
              <Mic className="w-4 h-4" />
            </Button>
            <Button variant="outline" data-testid="button-personalized">
              Personalized for you
            </Button>
          </div>
        </div>
        {error && (
          <div className="mb-4 text-sm text-destructive">{error}</div>
        )}

        <div ref={popularRef}>
          <h2 className="font-heading font-semibold text-xl mb-4">Common Conditions</h2>
          {loading && (
            <p className="text-sm text-muted-foreground mb-4">Loading health information...</p>
          )}
          {!loading && filteredDiseases.length === 0 && (
            <p className="text-sm text-muted-foreground mb-4">No conditions found. Try a different search.</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDiseases.map((disease) => (
              <Card
                key={disease._id || disease.slug}
                className="card-item hover-elevate cursor-pointer"
                data-testid={`card-disease-${disease.slug}`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Book className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">{disease.name}</h3>
                          {disease.category && (
                            <Badge variant="secondary" className="text-xs">
                              {disease.category}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-3">
                        {disease.description}
                      </p>
                      {Array.isArray(disease.symptoms) && disease.symptoms.length > 0 && (
                        <p className="text-xs text-muted-foreground mb-1">
                          <span className="font-semibold">Common symptoms:</span> {disease.symptoms.slice(0, 4).join(", ")}
                          {disease.symptoms.length > 4 ? "..." : ""}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
