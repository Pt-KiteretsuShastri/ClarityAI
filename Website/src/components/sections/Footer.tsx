import { Sparkles } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          
          <div>
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="bg-primary text-white p-1.5 rounded-lg">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">ClarityAI</span>
            </a>
            <p className="text-muted-foreground max-w-sm">
              The web should adapt to people—not the other way around. Open-source, privacy-first reading extension.
            </p>
          </div>

          <div className="flex flex-wrap gap-8 md:gap-12">
            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-foreground">Product</h4>
              <a href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">Features</a>
              <a href="#demo" className="text-sm text-muted-foreground hover:text-primary transition-colors">Demo</a>
              <a href="#download" className="text-sm text-muted-foreground hover:text-primary transition-colors">Download</a>
            </div>
            
            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-foreground">Resources</h4>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Documentation</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">GitHub Repository</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Issue Tracker</a>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-foreground">Legal</h4>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">MIT License</a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} ClarityAI Contributors. All rights reserved.</p>
          <p className="flex items-center gap-2">
            Built during <span className="font-semibold text-foreground">Sketch'N'Ship Hackathon 2026</span> 🚀
          </p>
        </div>
      </div>
    </footer>
  );
}
