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
    <div className="py-20 bg-white border-t border-b border-primary/10">
      <div className="container mx-auto px-4">
        <h3 className="text-sm font-semibold text-center mb-10 text-navy-light/60 tracking-wide uppercase">
          Accelerating growth for B2C leaders around the world
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-12 gap-y-8 items-center max-w-6xl mx-auto">
          {logos.length > 0 ? (
            logos.map((logo) => (
              <div key={logo.id} className="flex items-center justify-center opacity-60 hover:opacity-100 transition-all duration-300">
                <img 
                  src={logo.logo_url} 
                  alt={logo.company_name}
                  className="max-h-10 w-auto"
                />
              </div>
            ))
          ) : (
            <>
              <div className="flex items-center justify-center opacity-60 hover:opacity-100 transition-all">
                <span className="font-semibold text-navy-light text-sm">Home Depot</span>
              </div>
              <div className="flex items-center justify-center opacity-60 hover:opacity-100 transition-all">
                <span className="font-semibold text-navy-light text-sm">Adidas</span>
              </div>
              <div className="flex items-center justify-center opacity-60 hover:opacity-100 transition-all">
                <span className="font-semibold text-navy-light text-sm">Heineken</span>
              </div>
              <div className="flex items-center justify-center opacity-60 hover:opacity-100 transition-all">
                <span className="font-semibold text-navy-light text-sm">Fabletics</span>
              </div>
              <div className="flex items-center justify-center opacity-60 hover:opacity-100 transition-all">
                <span className="font-semibold text-navy-light text-sm">Holland.com</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
