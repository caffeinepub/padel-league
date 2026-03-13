import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Crosshair,
  Globe,
  Plus,
  Shield,
  Star,
  Trash2,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { samplePlayers } from "../data/sampleData";
import {
  useCreatePlayer,
  useDeletePlayer,
  useIsAdmin,
  usePlayers,
} from "../hooks/useQueries";

function getRatingColor(r: number): string {
  if (r >= 90) return "text-yellow-400 border-yellow-400/40 bg-yellow-400/10";
  if (r >= 85) return "text-primary border-primary/40 bg-primary/10";
  if (r >= 80) return "text-blue-400 border-blue-400/40 bg-blue-400/10";
  return "text-muted-foreground border-border bg-muted";
}

const flagEmoji: Record<string, string> = {
  Spain: "🇪🇸",
  UAE: "🇦🇪",
  Denmark: "🇩🇰",
  Italy: "🇮🇹",
  Japan: "🇯🇵",
  Argentina: "🇦🇷",
  France: "🇫🇷",
  Germany: "🇩🇪",
  Brazil: "🇧🇷",
  UK: "🇬🇧",
};

export default function Players() {
  const { data: players, isLoading } = usePlayers();
  const { data: isAdmin } = useIsAdmin();
  const createPlayer = useCreatePlayer();
  const deletePlayer = useDeletePlayer();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    nationality: "",
    overallRating: "",
    attackRating: "",
    defenseRating: "",
    serveRating: "",
  });

  const displayPlayers =
    players && players.length > 0 ? players : samplePlayers;

  async function handleCreate() {
    try {
      await createPlayer.mutateAsync({
        id: BigInt(Date.now()),
        name: form.name,
        nationality: form.nationality,
        overallRating: BigInt(form.overallRating || 75),
        attackRating: BigInt(form.attackRating || 75),
        defenseRating: BigInt(form.defenseRating || 75),
        serveRating: BigInt(form.serveRating || 75),
      });
      toast.success("Player added!");
      setDialogOpen(false);
      setForm({
        name: "",
        nationality: "",
        overallRating: "",
        attackRating: "",
        defenseRating: "",
        serveRating: "",
      });
    } catch {
      toast.error("Failed to add player");
    }
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Star className="w-6 h-6 text-primary" />
            <h2 className="font-display text-3xl font-bold tracking-tight">
              Player Ratings
            </h2>
          </div>
          <p className="text-muted-foreground text-sm">
            Current season performance ratings
          </p>
        </div>
        {isAdmin && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground gap-2 lime-glow"
                data-ocid="players.open_modal_button"
              >
                <Plus className="w-4 h-4" /> Add Player
              </Button>
            </DialogTrigger>
            <DialogContent
              className="bg-card border-border"
              data-ocid="players.dialog"
            >
              <DialogHeader>
                <DialogTitle className="font-display">Add Player</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Name</Label>
                    <Input
                      data-ocid="players.input"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="Full name"
                      className="mt-1 bg-input"
                    />
                  </div>
                  <div>
                    <Label>Nationality</Label>
                    <Input
                      value={form.nationality}
                      onChange={(e) =>
                        setForm({ ...form, nationality: e.target.value })
                      }
                      placeholder="e.g. Spain"
                      className="mt-1 bg-input"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      "overallRating",
                      "attackRating",
                      "defenseRating",
                      "serveRating",
                    ] as const
                  ).map((field) => (
                    <div key={field}>
                      <Label>
                        {field
                          .replace(/Rating$/, "")
                          .replace(/^./, (c) => c.toUpperCase())}{" "}
                        Rating
                      </Label>
                      <Input
                        type="number"
                        min="1"
                        max="99"
                        value={form[field]}
                        onChange={(e) =>
                          setForm({ ...form, [field]: e.target.value })
                        }
                        placeholder="75"
                        className="mt-1 bg-input"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  data-ocid="players.cancel_button"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  data-ocid="players.submit_button"
                  onClick={handleCreate}
                  disabled={!form.name || createPlayer.isPending}
                  className="bg-primary text-primary-foreground"
                >
                  {createPlayer.isPending ? "Adding..." : "Add"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
              <Skeleton
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton loader
                key={i}
                className="h-56 rounded-xl bg-muted"
                data-ocid="players.loading_state"
              />
            ))
          : displayPlayers.map((player, idx) => {
              const overall = Number(player.overallRating);
              const ratingClass = getRatingColor(overall);
              const flag = flagEmoji[player.nationality] || "";
              return (
                <motion.div
                  key={player.id.toString()}
                  data-ocid={`players.item.${idx + 1}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.07 }}
                  className="group"
                >
                  <Card className="bg-card border-border hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden h-full">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{flag}</span>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Globe className="w-3 h-3" />
                              <span>{player.nationality}</span>
                            </div>
                          </div>
                          <h3 className="font-display font-bold text-lg tracking-tight text-foreground">
                            {player.name}
                          </h3>
                        </div>
                        <div
                          className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl border-2 font-display font-black text-2xl ${ratingClass}`}
                        >
                          {overall}
                        </div>
                      </div>

                      {/* Stat bars */}
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                              <Zap className="w-3 h-3 text-primary" /> Attack
                            </span>
                            <span className="font-semibold text-foreground">
                              {player.attackRating.toString()}
                            </span>
                          </div>
                          <Progress
                            value={Number(player.attackRating)}
                            max={99}
                            className="h-1.5 bg-secondary [&>div]:bg-primary"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                              <Shield className="w-3 h-3 text-blue-400" />{" "}
                              Defense
                            </span>
                            <span className="font-semibold text-foreground">
                              {player.defenseRating.toString()}
                            </span>
                          </div>
                          <Progress
                            value={Number(player.defenseRating)}
                            max={99}
                            className="h-1.5 bg-secondary [&>div]:bg-blue-400"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                              <Crosshair className="w-3 h-3 text-yellow-400" />{" "}
                              Serve
                            </span>
                            <span className="font-semibold text-foreground">
                              {player.serveRating.toString()}
                            </span>
                          </div>
                          <Progress
                            value={Number(player.serveRating)}
                            max={99}
                            className="h-1.5 bg-secondary [&>div]:bg-yellow-400"
                          />
                        </div>
                      </div>

                      {isAdmin && (
                        <button
                          type="button"
                          data-ocid={`players.delete_button.${idx + 1}`}
                          onClick={() => deletePlayer.mutate(player.id)}
                          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
      </div>

      {!isLoading && displayPlayers.length === 0 && (
        <div
          data-ocid="players.empty_state"
          className="text-center py-16 text-muted-foreground"
        >
          <Star className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No players added yet.</p>
        </div>
      )}
    </section>
  );
}
