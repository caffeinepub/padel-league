import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Player {
    id: bigint;
    defenseRating: bigint;
    name: string;
    serveRating: bigint;
    nationality: string;
    overallRating: bigint;
    attackRating: bigint;
}
export interface ChatMessage {
    id: bigint;
    content: string;
    author: string;
    timestamp: bigint;
    matchTag?: string;
}
export interface LeagueEntry {
    id: bigint;
    rank: bigint;
    wins: bigint;
    losses: bigint;
    playerName: string;
    draws: bigint;
    points: bigint;
}
export interface Fixture {
    id: bigint;
    status: string;
    court: string;
    awayPlayer: string;
    homePlayer: string;
    dateTime: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createFixture(fixture: Fixture): Promise<void>;
    createLeagueEntry(entry: LeagueEntry): Promise<void>;
    createPlayer(player: Player): Promise<void>;
    deleteFixture(id: bigint): Promise<void>;
    deleteLeagueEntry(id: bigint): Promise<void>;
    deletePlayer(id: bigint): Promise<void>;
    getAllChatMessages(): Promise<Array<ChatMessage>>;
    getAllFixtures(): Promise<Array<Fixture>>;
    getAllLeagueEntries(): Promise<Array<LeagueEntry>>;
    getAllPlayers(): Promise<Array<Player>>;
    getCallerUserRole(): Promise<UserRole>;
    getFixture(id: bigint): Promise<Fixture>;
    getLeagueEntry(id: bigint): Promise<LeagueEntry>;
    getPlayer(id: bigint): Promise<Player>;
    isCallerAdmin(): Promise<boolean>;
    postChatMessage(message: ChatMessage): Promise<void>;
    updateFixture(fixture: Fixture): Promise<void>;
    updateLeagueEntry(entry: LeagueEntry): Promise<void>;
    updatePlayer(player: Player): Promise<void>;
}
