import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import blueconicLogo from "@/assets/blueconic-logo.png";

export const Navigation = () => {
  return (
    <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <NavLink to="/" className="flex items-center gap-2">
              <img src={blueconicLogo} alt="BlueConic" className="h-8" />
            </NavLink>
            
            <div className="hidden md:flex items-center gap-6">
              <NavLink
                to="/"
                end
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                activeClassName="text-foreground"
              >
                Assessment
              </NavLink>
              <NavLink
                to="/results"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                activeClassName="text-foreground"
              >
                Results
              </NavLink>
              <NavLink
                to="/blueconic-view"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                activeClassName="text-foreground"
              >
                BlueConic View
              </NavLink>
            </div>
          </div>

          <Button className="bg-primary hover:bg-primary/90">
            Book a Session
          </Button>
        </div>
      </div>
    </nav>
  );
};
