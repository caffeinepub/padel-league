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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, MapPin, Plus, Swords, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { sampleFixtures } from "../data/sampleData";
import {
  useCreateFixture,
  useDeleteFixture,
  useFixtures,
  useIsAdmin,
} from "../hooks/useQueries";

const statusConfig: Record<string, { label: string; className: string }> = {
  upcoming: {
    label: "Upcoming",
    className: "bg-primary/20 text-primary border-primary/40",
  },
  scheduled: {
    label: "Scheduled",
    className: "bg-blue-500/20 text-blue-400 border-blue-500/40",
  },
  live: {
    label: "LIVE",
    className: "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse",
  },
  completed: {
    label: "Completed",
    className: "bg-muted text-muted-foreground border-border",
  },
};

function formatDateTime(dt: string) {
  try {
    const d = new Date(dt);
    return {
      date: d.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
      time: d.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  } catch {
    return { date: dt, time: "" };
  }
}

export default function Fixtures() {
  const { data: fixtures, isLoading } = useFixtures();
  const { data: isAdmin } = useIsAdmin();
  const createFixture = useCreateFixture();
  const deleteFixture = useDeleteFixture();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    homePlayer: "",
    awayPlayer: "",
    dateTime: "",
    court: "",
    status: "upcoming",
  });

  const displayFixtures =
    fixtures && fixtures.length > 0 ? fixtures : sampleFixtures;

  async function handleCreate() {
    try {
      await createFixture.mutateAsync({
        id: BigInt(Date.now()),
        homePlayer: form.homePlayer,
        awayPlayer: form.awayPlayer,
        dateTime: form.dateTime,
        court: form.court,
        status: form.status,
      });
      toast.success("Fixture created!");
      setDialogOpen(false);
      setForm({
        homePlayer: "",
        awayPlayer: "",
        dateTime: "",
        court: "",
        status: "upcoming",
      });
    } catch {
      toast.error("Failed to create fixture");
    }
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Calendar className="w-6 h-6 text-primary" />
            <h2 className="font-display text-3xl font-bold tracking-tight">
              Fixtures
            </h2>
          </div>
          <p className="text-muted-foreground text-sm">
            Upcoming & scheduled matches
          </p>
        </div>
        {isAdmin && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground gap-2 lime-glow"
                data-ocid="fixtures.open_modal_button"
              >
                <Plus className="w-4 h-4" /> Add Fixture
              </Button>
            </DialogTrigger>
            <DialogContent
              className="bg-card border-border"
              data-ocid="fixtures.dialog"
            >
              <DialogHeader>
                <DialogTitle className="font-display">New Fixture</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Home Player</Label>
                    <Input
                      data-ocid="fixtures.input"
                      value={form.homePlayer}
                      onChange={(e) =>
                        setForm({ ...form, homePlayer: e.target.value })
                      }
                      placeholder="Home player"
                      className="mt-1 bg-input"
                    />
                  </div>
                  <div>
                    <Label>Away Player</Label>
                    <Input
                      value={form.awayPlayer}
                      onChange={(e) =>
                        setForm({ ...form, awayPlayer: e.target.value })
                      }
                      placeholder="Away player"
                      className="mt-1 bg-input"
                    />
                  </div>
                </div>
                <div>
                  <Label>Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={form.dateTime}
                    onChange={(e) =>
                      setForm({ ...form, dateTime: e.target.value })
                    }
                    className="mt-1 bg-input"
                  />
                </div>
                <div>
                  <Label>Court</Label>
                  <Input
                    value={form.court}
                    onChange={(e) =>
                      setForm({ ...form, court: e.target.value })
                    }
                    placeholder="Court name"
                    className="mt-1 bg-input"
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) => setForm({ ...form, status: v })}
                  >
                    <SelectTrigger
                      className="mt-1 bg-input"
                      data-ocid="fixtures.select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  data-ocid="fixtures.cancel_button"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  data-ocid="fixtures.submit_button"
                  onClick={handleCreate}
                  disabled={
                    !form.homePlayer ||
                    !form.awayPlayer ||
                    createFixture.isPending
                  }
                  className="bg-primary text-primary-foreground"
                >
                  {createFixture.isPending ? "Creating..." : "Create"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
              <Skeleton
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton loader
                key={i}
                className="h-44 rounded-xl bg-muted"
                data-ocid="fixtures.loading_state"
              />
            ))
          : displayFixtures.map((fixture, idx) => {
              const { date, time } = formatDateTime(fixture.dateTime);
              const status =
                statusConfig[fixture.status] || statusConfig.upcoming;
              return (
                <motion.div
                  key={fixture.id.toString()}
                  data-ocid={`fixtures.item.${idx + 1}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="group"
                >
                  <Card className="bg-card border-border hover:border-primary/40 transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden h-full">
                    {/* Lime accent line */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <Badge className={`text-xs border ${status.className}`}>
                          {status.label}
                        </Badge>
                        {isAdmin && (
                          <button
                            type="button"
                            data-ocid={`fixtures.delete_button.${idx + 1}`}
                            onClick={() => deleteFixture.mutate(fixture.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive/80"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* VS display */}
                      <div className="flex items-center justify-between gap-3 mb-5">
                        <div className="flex-1 text-center">
                          <p className="font-display font-bold text-base text-foreground leading-tight">
                            {fixture.homePlayer}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Home
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
                            <Swords className="w-4 h-4 text-primary" />
                          </div>
                        </div>
                        <div className="flex-1 text-center">
                          <p className="font-display font-bold text-base text-foreground leading-tight">
                            {fixture.awayPlayer}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Away
                          </p>
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5 text-primary/60" />
                          <span>{date}</span>
                          <Clock className="w-3.5 h-3.5 text-primary/60 ml-1" />
                          <span>{time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5 text-primary/60" />
                          <span>{fixture.court}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
      </div>

      {!isLoading && displayFixtures.length === 0 && (
        <div
          data-ocid="fixtures.empty_state"
          className="text-center py-16 text-muted-foreground"
        >
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No fixtures scheduled yet.</p>
        </div>
      )}
    </section>
  );
}
