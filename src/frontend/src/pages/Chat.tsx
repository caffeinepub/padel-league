import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Flame, Hash, LogIn, MessageCircle, Send, Trophy } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { sampleChatMessages } from "../data/sampleData";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useChatMessages, usePostChatMessage } from "../hooks/useQueries";

function formatTimestamp(ts: bigint): string {
  const d = new Date(Number(ts));
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const avatarColors = [
  "bg-primary/30 text-primary",
  "bg-blue-500/30 text-blue-400",
  "bg-purple-500/30 text-purple-400",
  "bg-yellow-500/30 text-yellow-400",
  "bg-pink-500/30 text-pink-400",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

export default function Chat() {
  const { data: messages, isLoading } = useChatMessages();
  const { login, loginStatus, identity } = useInternetIdentity();
  const postMessage = usePostChatMessage();
  const [content, setContent] = useState("");
  const [matchTag, setMatchTag] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const isLoggedIn = loginStatus === "success" && !!identity;

  const displayMessages =
    messages && messages.length > 0 ? messages : sampleChatMessages;
  const sorted = [...displayMessages].sort(
    (a, b) => Number(a.timestamp) - Number(b.timestamp),
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message count change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [sorted.length]);

  async function handlePost() {
    if (!content.trim() || !isLoggedIn) return;
    try {
      await postMessage.mutateAsync({
        id: BigInt(Date.now()),
        content: content.trim(),
        author: identity.getPrincipal().toString().slice(0, 12),
        timestamp: BigInt(Date.now()),
        matchTag: matchTag.trim() || undefined,
      });
      setContent("");
      setMatchTag("");
      toast.success("Message posted!");
    } catch {
      toast.error("Failed to post message");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlePost();
    }
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <MessageCircle className="w-6 h-6 text-primary" />
        <h2 className="font-display text-3xl font-bold tracking-tight">
          Match Chat
        </h2>
        <div className="flex items-center gap-1.5 ml-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-muted-foreground">
            Live discussions
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 max-w-5xl">
        {/* Message Feed */}
        <div className="flex flex-col gap-4">
          <div
            ref={scrollRef}
            className="h-[520px] overflow-y-auto space-y-3 pr-2 scrollbar-thin"
          >
            {isLoading ? (
              <div data-ocid="chat.loading_state" className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton loader
                    key={i}
                    className="h-20 rounded-xl bg-muted"
                  />
                ))}
              </div>
            ) : (
              <AnimatePresence>
                {sorted.map((msg, idx) => {
                  const avatarColor = getAvatarColor(msg.author);
                  return (
                    <motion.div
                      key={msg.id.toString()}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(idx * 0.05, 0.3) }}
                      className="glass-card rounded-xl p-4 group"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold font-display flex-shrink-0 ${avatarColor}`}
                        >
                          {getInitials(msg.author)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-semibold text-sm text-foreground">
                              {msg.author}
                            </span>
                            {msg.matchTag && (
                              <Badge className="text-xs bg-primary/15 text-primary border-primary/30 gap-1">
                                <Trophy className="w-2.5 h-2.5" />
                                {msg.matchTag}
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground ml-auto">
                              {formatTimestamp(msg.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-foreground/90 leading-relaxed">
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}

            {!isLoading && sorted.length === 0 && (
              <div
                data-ocid="chat.empty_state"
                className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3"
              >
                <MessageCircle className="w-12 h-12 opacity-20" />
                <p>No messages yet. Start the discussion!</p>
              </div>
            )}
          </div>

          {/* Input area */}
          {isLoggedIn ? (
            <div className="glass-card rounded-xl p-4 space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">
                  Match tag (optional)
                </Label>
                <div className="flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  <Input
                    value={matchTag}
                    onChange={(e) => setMatchTag(e.target.value)}
                    placeholder="e.g. Ruiz vs Al-Rashid"
                    className="bg-input border-border text-sm h-8"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Textarea
                  data-ocid="chat.input"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Share your match highlights... (Enter to send)"
                  rows={3}
                  className="bg-input border-border resize-none text-sm flex-1"
                />
                <Button
                  data-ocid="chat.submit_button"
                  onClick={handlePost}
                  disabled={!content.trim() || postMessage.isPending}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 self-end lime-glow px-4 gap-2"
                >
                  {postMessage.isPending ? (
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">Post</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          ) : (
            <div
              data-ocid="chat.error_state"
              className="glass-card rounded-xl p-6 text-center space-y-3"
            >
              <Flame className="w-10 h-10 text-primary mx-auto" />
              <p className="font-display font-bold text-foreground">
                Join the conversation
              </p>
              <p className="text-sm text-muted-foreground">
                Sign in to post match highlights and reactions
              </p>
              <Button
                onClick={login}
                disabled={loginStatus === "logging-in"}
                className="bg-primary text-primary-foreground gap-2 lime-glow"
              >
                <LogIn className="w-4 h-4" />
                {loginStatus === "logging-in"
                  ? "Connecting..."
                  : "Sign In to Chat"}
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Hot topics */}
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4 text-primary" />
              <h3 className="font-display font-bold text-sm">Hot Topics</h3>
            </div>
            <div className="space-y-2">
              {[
                "Ruiz vs Al-Rashid",
                "Andersen vs Bertolucci",
                "Season 2026 Title Race",
                "Best Smashes This Week",
              ].map((topic) => (
                <button
                  type="button"
                  key={topic}
                  onClick={() => setMatchTag(topic)}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-sm text-muted-foreground hover:text-foreground"
                >
                  <Hash className="w-3.5 h-3.5 text-primary/60 flex-shrink-0" />
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="glass-card rounded-xl p-4">
            <h3 className="font-display font-bold text-sm mb-3">Chat Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total messages</span>
                <span className="font-semibold text-foreground">
                  {sorted.length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Match highlights</span>
                <span className="font-semibold text-foreground">
                  {sorted.filter((m) => m.matchTag).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
