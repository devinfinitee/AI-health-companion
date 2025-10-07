import BottomNav from '../BottomNav';

export default function BottomNavExample() {
  return (
    <div className="h-[400px] relative">
      <div className="absolute inset-0 bg-muted/20 flex items-center justify-center">
        <p className="text-muted-foreground">Main content area</p>
      </div>
      <BottomNav />
    </div>
  );
}
