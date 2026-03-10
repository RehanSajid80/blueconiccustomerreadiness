import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import bcLogoWhite from "@/assets/bc-logo-partial-white.png";

export const Navigation = () => {
  return (
    <nav className="sticky top-0 z-50 bg-[#0a1628]">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <NavLink to="/" className="flex items-center gap-2">
              <img src={bcLogoWhite} alt="BlueConic" className="h-7" />
            </NavLink>
            
            <div className="hidden md:flex items-center gap-6">
              <NavLink
                to="/"
                end
                className="text-sm font-medium text-white/70 transition-colors hover:text-white"
                activeClassName="text-white"
              >
                Assessment
              </NavLink>
            </div>
          </div>

          <a href="https://www.blueconic.com/request-demo?utm_source=growth_readiness_assessment&utm_medium=calculator&utm_campaign=data_maturity&utm_content=book_a_demo_nav" target="_blank" rel="noopener noreferrer">
            <Button className="bg-primary hover:bg-primary/90 text-white">
              Book a Demo
            </Button>
          </a>
        </div>
      </div>
    </nav>
  );
};
