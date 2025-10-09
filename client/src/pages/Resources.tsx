import { useState, useEffect, useRef } from "react";
import { Search, Mic, Brain, Heart, Dumbbell, Book } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import gsap from "gsap";
import AnimatedPage from "@/components/AnimatedPage";

export default function Resources() {
  const [search, setSearch] = useState("");
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

  // todo: remove mock functionality
  const personalizedArticles = [
    {
      id: "1",
      title: "Understanding Headaches",
      description: "Common causes of headaches",
      icon: Brain,
      color: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    },
    {
      id: "2",
      title: "Healthy Eating Habits",
      description: "Nutrition guide for better health",
      icon: Heart,
      color: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    },
    {
      id: "3",
      title: "Managing Stress",
      description: "Relaxation techniques",
      icon: Dumbbell,
      color: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    },
  ];

  const popularArticles = [
    { id: "1", title: "The Importance of Sleep", category: "Wellness" },
    { id: "2", title: "Exercise Benefits", category: "Fitness" },
    { id: "3", title: "Beginner's Yoga Guide", category: "Mental Health" },
    { id: "4", title: "First Aid Basics", category: "Emergency" },
  ];

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

        <div className="mb-8" ref={personalizedRef}>
          <h2 className="font-heading font-semibold text-xl mb-4">Personalized for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {personalizedArticles.map((article) => {
              const Icon = article.icon;
              return (
                <Card key={article.id} className="card-item hover-elevate cursor-pointer" data-testid={`card-article-${article.id}`}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center gap-4">
                      <div className={`w-16 h-16 rounded-full ${article.color} flex items-center justify-center`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold mb-1">{article.title}</h3>
                        <p className="text-sm text-muted-foreground">{article.description}</p>
                      </div>
                      <Button size="sm" data-testid={`button-read-${article.id}`}>
                        Read Article
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div ref={popularRef}>
          <h2 className="font-heading font-semibold text-xl mb-4">Popular Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popularArticles.map((article) => (
              <Card key={article.id} className="card-item hover-elevate cursor-pointer" data-testid={`card-popular-${article.id}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Book className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">{article.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {article.category}
                        </Badge>
                      </div>
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
