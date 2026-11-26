import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SolveSessionProvider } from "./contexts/SolveSessionContext";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Report from "./pages/Report";
import Privacy from "./pages/Privacy";

function Router() { return <Switch><Route path="/" component={Home} /><Route path="/upload" component={Upload} /><Route path="/report" component={Report} /><Route path="/privacy" component={Privacy} /><Route component={NotFound} /></Switch>; }
export default function App() { return <ErrorBoundary><ThemeProvider defaultTheme="dark"><TooltipProvider><SolveSessionProvider><Toaster /><Router /></SolveSessionProvider></TooltipProvider></ThemeProvider></ErrorBoundary>; }
