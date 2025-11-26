import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/types/assessment";

export function SocialProof() {
  const [logos, setLogos] = useState<Logo[]>([]);

  useEffect(() => {
    async function fetchLogos() {
      const { data } = await supabase
        .from("logos")
        .select("*")
        .order("display_order");
      if (data) setLogos(data);
    }
    fetchLogos();
  }, []);

  return (
    <div className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
          Trusted by Industry Leaders
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Join retail, DTC, CPG, and travel brands using BlueConic to unlock growth
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center max-w-4xl mx-auto">
          {logos.length > 0 ? (
            logos.map((logo) => (
              <div key={logo.id} className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all">
                <img 
                  src={logo.logo_url} 
                  alt={logo.company_name}
                  className="max-h-12 w-auto"
                />
              </div>
            ))
          ) : (
            <>
              <div className="flex items-center justify-center p-4 bg-card rounded-lg border">
                <span className="font-semibold text-muted-foreground">Home Depot</span>
              </div>
              <div className="flex items-center justify-center p-4 bg-card rounded-lg border">
                <span className="font-semibold text-muted-foreground">Adidas</span>
              </div>
              <div className="flex items-center justify-center p-4 bg-card rounded-lg border">
                <span className="font-semibold text-muted-foreground">Heineken</span>
              </div>
              <div className="flex items-center justify-center p-4 bg-card rounded-lg border">
                <span className="font-semibold text-muted-foreground">Fabletics</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
