import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import Footer from "./components/Footer";
import Navigation from "./components/Navigation";
import Chat from "./pages/Chat";
import Fixtures from "./pages/Fixtures";
import LeagueTable from "./pages/LeagueTable";
import Players from "./pages/Players";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

type Page = "league" | "fixtures" | "players" | "chat";

function AppContent() {
  const [page, setPage] = useState<Page>("league");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation currentPage={page} onNavigate={setPage} />
      <main className="flex-1">
        {page === "league" && <LeagueTable />}
        {page === "fixtures" && <Fixtures />}
        {page === "players" && <Players />}
        {page === "chat" && <Chat />}
      </main>
      <Footer />
      <Toaster richColors position="bottom-right" />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
