import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Data Types
  type LeagueEntry = {
    id : Nat;
    playerName : Text;
    points : Nat;
    wins : Nat;
    losses : Nat;
    draws : Nat;
    rank : Nat;
  };

  module LeagueEntry {
    public func compareByRank(entry1 : LeagueEntry, entry2 : LeagueEntry) : Order.Order {
      Nat.compare(entry1.rank, entry2.rank);
    };
  };

  type Fixture = {
    id : Nat;
    homePlayer : Text;
    awayPlayer : Text;
    dateTime : Text;
    court : Text;
    status : Text; // upcoming, completed, cancelled
  };

  type Player = {
    id : Nat;
    name : Text;
    nationality : Text;
    attackRating : Nat;
    defenseRating : Nat;
    serveRating : Nat;
    overallRating : Nat;
  };

  type ChatMessage = {
    id : Nat;
    author : Text;
    content : Text;
    matchTag : ?Text;
    timestamp : Nat;
  };

  // State
  let leagueEntries = Map.empty<Nat, LeagueEntry>();
  let fixtures = Map.empty<Nat, Fixture>();
  let players = Map.empty<Nat, Player>();
  let chatMessages = Map.empty<Nat, ChatMessage>();

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Tournament Functions (CRUD)
  // League Entries
  public query ({ caller }) func getAllLeagueEntries() : async [LeagueEntry] {
    leagueEntries.values().toArray().sort(LeagueEntry.compareByRank);
  };

  public query ({ caller }) func getLeagueEntry(id : Nat) : async LeagueEntry {
    switch (leagueEntries.get(id)) {
      case (?entry) { entry };
      case (null) { Runtime.trap("League entry not found") };
    };
  };

  public shared ({ caller }) func createLeagueEntry(entry : LeagueEntry) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create league entries");
    };
    leagueEntries.add(entry.id, entry);
  };

  public shared ({ caller }) func updateLeagueEntry(entry : LeagueEntry) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update league entries");
    };
    leagueEntries.add(entry.id, entry);
  };

  public shared ({ caller }) func deleteLeagueEntry(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete league entries");
    };
    leagueEntries.remove(id);
  };

  // Fixtures
  public query ({ caller }) func getAllFixtures() : async [Fixture] {
    fixtures.values().toArray();
  };

  public query ({ caller }) func getFixture(id : Nat) : async Fixture {
    switch (fixtures.get(id)) {
      case (?fixture) { fixture };
      case (null) { Runtime.trap("Fixture not found") };
    };
  };

  public shared ({ caller }) func createFixture(fixture : Fixture) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create fixtures");
    };
    fixtures.add(fixture.id, fixture);
  };

  public shared ({ caller }) func updateFixture(fixture : Fixture) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update fixtures");
    };
    fixtures.add(fixture.id, fixture);
  };

  public shared ({ caller }) func deleteFixture(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete fixtures");
    };
    fixtures.remove(id);
  };

  // Players
  public query ({ caller }) func getAllPlayers() : async [Player] {
    players.values().toArray();
  };

  public query ({ caller }) func getPlayer(id : Nat) : async Player {
    switch (players.get(id)) {
      case (?player) { player };
      case (null) { Runtime.trap("Player not found") };
    };
  };

  public shared ({ caller }) func createPlayer(player : Player) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create players");
    };
    players.add(player.id, player);
  };

  public shared ({ caller }) func updatePlayer(player : Player) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update players");
    };
    players.add(player.id, player);
  };

  public shared ({ caller }) func deletePlayer(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete players");
    };
    players.remove(id);
  };

  // Chat Messages
  public query ({ caller }) func getAllChatMessages() : async [ChatMessage] {
    chatMessages.values().toArray();
  };

  public shared ({ caller }) func postChatMessage(message : ChatMessage) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can post chat messages");
    };
    chatMessages.add(message.id, message);
  };
};
