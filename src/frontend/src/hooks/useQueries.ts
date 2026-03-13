import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ChatMessage, Fixture, LeagueEntry, Player } from "../backend";
import { useActor } from "./useActor";

export function useLeagueEntries() {
  const { actor, isFetching } = useActor();
  return useQuery<LeagueEntry[]>({
    queryKey: ["leagueEntries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllLeagueEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFixtures() {
  const { actor, isFetching } = useActor();
  return useQuery<Fixture[]>({
    queryKey: ["fixtures"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFixtures();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePlayers() {
  const { actor, isFetching } = useActor();
  return useQuery<Player[]>({
    queryKey: ["players"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPlayers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useChatMessages() {
  const { actor, isFetching } = useActor();
  return useQuery<ChatMessage[]>({
    queryKey: ["chatMessages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllChatMessages();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePostChatMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (message: ChatMessage) => {
      if (!actor) throw new Error("Not connected");
      return actor.postChatMessage(message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatMessages"] });
    },
  });
}

export function useCreateLeagueEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (entry: LeagueEntry) => {
      if (!actor) throw new Error("Not connected");
      return actor.createLeagueEntry(entry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leagueEntries"] });
    },
  });
}

export function useCreateFixture() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (fixture: Fixture) => {
      if (!actor) throw new Error("Not connected");
      return actor.createFixture(fixture);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fixtures"] });
    },
  });
}

export function useCreatePlayer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (player: Player) => {
      if (!actor) throw new Error("Not connected");
      return actor.createPlayer(player);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
    },
  });
}

export function useDeleteLeagueEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteLeagueEntry(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leagueEntries"] });
    },
  });
}

export function useDeleteFixture() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteFixture(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fixtures"] });
    },
  });
}

export function useDeletePlayer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deletePlayer(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
    },
  });
}
