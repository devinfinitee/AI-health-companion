import HealthCard from '../HealthCard';
import { Heart, Calendar, Book } from 'lucide-react';

export default function HealthCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <HealthCard
        title="My Health Summary"
        description="View recent activity"
        icon={Heart}
      />
      <HealthCard
        title="Book an Appointment"
        description="Schedule next visit, get reminders via WhatsApp"
        icon={Calendar}
      />
      <HealthCard
        title="Health Resources"
        description="Explore articles & tips"
        icon={Book}
      />
    </div>
  );
}
