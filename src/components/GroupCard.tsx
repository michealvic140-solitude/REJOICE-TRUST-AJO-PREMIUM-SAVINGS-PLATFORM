import { Group, useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { Users, Calendar, Lock } from "lucide-react";

interface GroupCardProps {
  group: Group;
}

export default function GroupCard({ group }: GroupCardProps) {
  const { isLoggedIn } = useApp();
  const navigate = useNavigate();
  const remaining = group.totalSlots - group.filledSlots;
  const fillPercent = (group.filledSlots / group.totalSlots) * 100;

  const cycleColors = {
    daily: "text-emerald-400",
    weekly: "text-sky-400",
    monthly: "text-purple-400",
  };

  const handleViewGroup = () => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: `/groups/${group.id}`, message: "Please sign in to view this savings group." } });
      return;
    }
    navigate(`/groups/${group.id}`);
  };

  return (
    <div className="glass-card p-6 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="gold-gradient-text text-lg font-cinzel font-bold leading-tight">{group.name}</h3>
          <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{group.description}</p>
        </div>
        {group.isLive && (
          <span className="live-badge ml-3 shrink-0">● LIVE</span>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-muted-foreground text-[11px] uppercase tracking-widest">Contribution</p>
          <p className="text-foreground font-bold text-xl">₦{group.contributionAmount.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-muted-foreground text-[11px] uppercase tracking-widest">Cycle</p>
          <p className={`font-semibold capitalize text-sm ${cycleColors[group.cycleType]}`}>
            <Calendar size={12} className="inline mr-1" />
            {group.cycleType}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground flex items-center gap-1">
            <Users size={11} /> {group.filledSlots} / {group.totalSlots} slots
          </span>
          <span className="text-gold">{remaining} remaining</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${fillPercent}%`,
              background: fillPercent > 80
                ? "linear-gradient(90deg, #ef4444, #dc2626)"
                : "linear-gradient(90deg, hsl(45,93%,47%), hsl(45,100%,60%))"
            }}
          />
        </div>
      </div>

      <button
        onClick={handleViewGroup}
        className="btn-gold w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold"
      >
        {!isLoggedIn && <Lock size={13} />}
        {isLoggedIn ? "View Group" : "Sign In to View"}
      </button>
    </div>
  );
}
