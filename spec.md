# Padel League

## Current State
New project with no existing code.

## Requested Changes (Diff)

### Add
- League table showing teams/players with points, wins, losses, and ranking
- Upcoming fixtures section with match schedules, dates, and opponents
- Player ratings page with skill ratings, stats, and performance data
- Chat system for discussing match highlights (public feed, post messages)

### Modify
N/A

### Remove
N/A

## Implementation Plan

### Backend
- `LeagueTable`: store player/team entries with points, wins, losses, draws, rank
- `Fixtures`: store upcoming matches with date, home/away players, court, status
- `Players`: store player profiles with ratings (attack, defense, serve, overall)
- `Chat`: store messages with author, timestamp, content, optional match tag

### Frontend
- Navigation with 4 sections: League Table, Fixtures, Players, Chat
- League Table: ranked list with points table, sortable columns
- Fixtures: card-based upcoming match list with date/time badges
- Player Ratings: player cards with stat bars and overall rating badge
- Chat: real-time-style message feed with post input, match highlight tagging
- Sample content enabled: seed with realistic padel league data
