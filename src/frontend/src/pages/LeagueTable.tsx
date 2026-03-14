import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Medal, Plus, Trash2, TrendingUp, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { LeagueEntry } from "../backend";
import { sampleLeagueEntries } from "../data/sampleData";
import {
  useCreateLeagueEntry,
  useDeleteLeagueEntry,
  useIsAdmin,
  useLeagueEntries,
} from "../hooks/useQueries";

const rankColors: Record<number, string> = {
  1: "text-yellow-400",
  2: "text-zinc-300",
  3: "text-amber-600",
};

const rankBg: Record<number, string> = {
  1: "bg-yellow-400/10 border-yellow-400/30",
  2: "bg-zinc-300/10 border-zinc-300/30",
  3: "bg-amber-600/10 border-amber-600/30",
};

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-400" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-zinc-300" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
  return (
    <span className="text-muted-foreground font-mono text-sm w-5 text-center">
      {rank}
    </span>
  );
}

export default function LeagueTable() {
  const { data: entries, isLoading } = useLeagueEntries();
  const { data: isAdmin } = useIsAdmin();
  const createEntry = useCreateLeagueEntry();
  const deleteEntry = useDeleteLeagueEntry();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    playerName: "",
    wins: "",
    draws: "",
    losses: "",
    points: "",
    rank: "",
  });

  const displayEntries = (
    entries && entries.length > 0 ? entries : sampleLeagueEntries
  )
    .slice()
    .sort((a, b) => Number(a.rank) - Number(b.rank));

  const played = (e: LeagueEntry) =>
    Number(e.wins) + Number(e.draws) + Number(e.losses);

  async function handleCreate() {
    try {
      await createEntry.mutateAsync({
        id: BigInt(Date.now()),
        rank: BigInt(form.rank || displayEntries.length + 1),
        playerName: form.playerName,
        wins: BigInt(form.wins || 0),
        draws: BigInt(form.draws || 0),
        losses: BigInt(form.losses || 0),
        points: BigInt(form.points || 0),
      });
      toast.success("Player added to league!");
      setDialogOpen(false);
      setForm({
        playerName: "",
        wins: "",
        draws: "",
        losses: "",
        points: "",
        rank: "",
      });
    } catch {
      toast.error("Failed to add player");
    }
  }

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative mb-12 overflow-hidden rounded-2xl"
      >
        <div
          className="h-56 md:h-72 bg-cover bg-center relative"
          style={{
            backgroundImage:
              "url('/assets/generated/padel-hero.dim_1600x600.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4 text-center px-4">
            <Badge className="bg-primary/20 text-primary border-primary/40 text-xs tracking-widest uppercase font-semibold">
              Season 2026
            </Badge>
            <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tighter text-white">
              SMASH{" "}
              <span className="text-gradient-lime lime-glow-text">LEAGUE</span>
            </h1>
            <p className="text-white/80 text-lg max-w-md">
              The most competitive padel league in the city. Battle for glory.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Table header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2 className="font-display text-2xl font-bold tracking-tight">
            Standings
          </h2>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground gap-2 lime-glow"
              data-ocid="league.open_modal_button"
            >
              <Plus className="w-4 h-4" /> Add Player
            </Button>
          </DialogTrigger>
          <DialogContent
            className="bg-card border-border"
            data-ocid="league.dialog"
          >
            <DialogHeader>
              <DialogTitle className="font-display">
                Add League Entry
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label>Player Name</Label>
                <Input
                  data-ocid="league.input"
                  value={form.playerName}
                  onChange={(e) =>
                    setForm({ ...form, playerName: e.target.value })
                  }
                  placeholder="Player name"
                  className="mt-1 bg-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Rank</Label>
                  <Input
                    type="number"
                    value={form.rank}
                    onChange={(e) => setForm({ ...form, rank: e.target.value })}
                    placeholder="1"
                    className="mt-1 bg-input"
                  />
                </div>
                <div>
                  <Label>Points</Label>
                  <Input
                    type="number"
                    value={form.points}
                    onChange={(e) =>
                      setForm({ ...form, points: e.target.value })
                    }
                    placeholder="0"
                    className="mt-1 bg-input"
                  />
                </div>
                <div>
                  <Label>Wins</Label>
                  <Input
                    type="number"
                    value={form.wins}
                    onChange={(e) => setForm({ ...form, wins: e.target.value })}
                    placeholder="0"
                    className="mt-1 bg-input"
                  />
                </div>
                <div>
                  <Label>Draws</Label>
                  <Input
                    type="number"
                    value={form.draws}
                    onChange={(e) =>
                      setForm({ ...form, draws: e.target.value })
                    }
                    placeholder="0"
                    className="mt-1 bg-input"
                  />
                </div>
                <div>
                  <Label>Losses</Label>
                  <Input
                    type="number"
                    value={form.losses}
                    onChange={(e) =>
                      setForm({ ...form, losses: e.target.value })
                    }
                    placeholder="0"
                    className="mt-1 bg-input"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                data-ocid="league.cancel_button"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                data-ocid="league.submit_button"
                onClick={handleCreate}
                disabled={!form.playerName || createEntry.isPending}
                className="bg-primary text-primary-foreground"
              >
                {createEntry.isPending ? "Adding..." : "Add"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* League Table */}
      <div className="space-y-2">
        {/* Column Headers */}
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto_auto] gap-4 px-4 py-2 text-xs text-muted-foreground uppercase tracking-widest font-semibold">
          <span className="w-8">#</span>
          <span>Player</span>
          <span className="w-10 text-center">P</span>
          <span className="w-10 text-center">W</span>
          <span className="w-10 text-center">D</span>
          <span className="w-10 text-center">L</span>
          <span className="w-14 text-center">PTS</span>
        </div>

        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
              <Skeleton
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton loader
                key={i}
                className="h-16 rounded-xl bg-muted"
                data-ocid="league.loading_state"
              />
            ))
          : displayEntries.map((entry, idx) => {
              const rank = Number(entry.rank);
              const isTop3 = rank <= 3;
              return (
                <motion.div
                  key={entry.id.toString()}
                  data-ocid={`league.item.${idx + 1}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className={`relative grid grid-cols-[auto_1fr_auto_auto_auto_auto_auto] gap-4 items-center px-4 py-4 rounded-xl border transition-all duration-200 hover:border-primary/40 group overflow-hidden ${
                    isTop3
                      ? rankBg[rank]
                      : "bg-card border-border hover:bg-secondary/50"
                  }`}
                >
                  {/* Giant background rank number */}
                  <span
                    className={`absolute right-4 top-1/2 -translate-y-1/2 font-display text-7xl font-black opacity-5 select-none rank-overlay ${
                      isTop3 ? rankColors[rank] : "text-foreground"
                    }`}
                  >
                    {rank}
                  </span>

                  <div className="w-8 flex items-center justify-center z-10">
                    <RankIcon rank={rank} />
                  </div>
                  <div className="z-10">
                    <p
                      className={`font-display font-bold text-base tracking-tight ${
                        isTop3 ? rankColors[rank] : "text-foreground"
                      }`}
                    >
                      {entry.playerName}
                    </p>
                  </div>
                  <span className="w-10 text-center text-sm text-muted-foreground z-10">
                    {played(entry)}
                  </span>
                  <span className="w-10 text-center text-sm font-semibold text-foreground z-10">
                    {entry.wins.toString()}
                  </span>
                  <span className="w-10 text-center text-sm text-muted-foreground z-10">
                    {entry.draws.toString()}
                  </span>
                  <span className="w-10 text-center text-sm text-muted-foreground z-10">
                    {entry.losses.toString()}
                  </span>
                  <div className="w-14 text-center z-10">
                    <span
                      className={`font-display font-black text-lg ${
                        isTop3 ? rankColors[rank] : "text-foreground"
                      }`}
                    >
                      {entry.points.toString()}
                    </span>
                  </div>

                  {isAdmin && (
                    <button
                      type="button"
                      data-ocid={`league.delete_button.${idx + 1}`}
                      onClick={() => deleteEntry.mutate(entry.id)}
                      className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive/80 z-20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </motion.div>
              );
            })}

        {!isLoading && displayEntries.length === 0 && (
          <div
            data-ocid="league.empty_state"
            className="text-center py-16 text-muted-foreground"
          >
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No league entries yet. Add the first player!</p>
          </div>
        )}
      </div>
    </section>
  );
}
