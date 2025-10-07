import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface HealthCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export default function HealthCard({ title, description, icon: Icon, onClick }: HealthCardProps) {
  return (
    <Card 
      className="hover-elevate cursor-pointer transition-all" 
      onClick={() => {
        onClick?.();
        console.log('Health card clicked:', title);
      }}
      data-testid={`card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-base font-heading">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
