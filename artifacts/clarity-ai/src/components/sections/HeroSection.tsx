import { motion } from 'framer-motion';
import { ArrowRight, Download, Eye, Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden flex flex-col justify-center">
      {/* Background ambient blobs */}
      <div className="bg-ambient-blob bg-primary/20 w-[500px] h-[500px] top-[-100px] left-[-100px]" />
      <div className="bg-ambient-blob bg-secondary/20 w-[400px] h-[400px] bottom-[100px] right-[-50px]" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>The web should adapt to people—not the other way around.</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            Read the web <br className="hidden md:block" />
            <span className="text-gradient">without the noise.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            ClarityAI transforms cluttered, overwhelming webpages into clean, personalized, and deeply accessible reading experiences.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <a 
              href="#download"
              className="flex items-center justify-center gap-2 w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40"
              data-testid="hero-btn-download"
            >
              <Download className="w-5 h-5" />
              Download Extension
            </a>
            <a 
              href="#demo"
              className="flex items-center justify-center gap-2 w-full sm:w-auto bg-white dark:bg-card hover:bg-muted text-foreground border border-border px-8 py-4 rounded-full font-semibold text-lg transition-all"
              data-testid="hero-btn-demo"
            >
              <Eye className="w-5 h-5" />
              View Demo
            </a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-sm text-muted-foreground font-medium"
          >
            <span className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full"><img src="https://upload.wikimedia.org/wikipedia/commons/8/87/Google_Chrome_icon_%282011%29.png" alt="Chrome" className="w-4 h-4 grayscale opacity-70" /> Chrome Extension</span>
            <span className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full"><img src="https://upload.wikimedia.org/wikipedia/commons/a/a0/Firefox_logo%2C_2019.svg" alt="Firefox" className="w-4 h-4 grayscale opacity-70" /> Firefox Compatible</span>
            <span className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">🧠 AI Powered</span>
            <span className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">🔓 Open Source</span>
          </motion.div>
        </div>

        {/* Browser Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 max-w-5xl mx-auto"
        >
          <div className="glass-card rounded-2xl overflow-hidden border border-border/50 shadow-2xl relative group">
            {/* Browser Chrome */}
            <div className="bg-muted/50 border-b border-border/50 p-3 flex items-center gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
              </div>
              <div className="flex-1 max-w-md mx-auto bg-background/50 border border-border rounded-md px-3 py-1.5 text-xs text-muted-foreground flex items-center gap-2 justify-center">
                <span className="opacity-50">🔒</span> https://example-article.com/the-future-of-ai
              </div>
            </div>
            
            {/* Mockup Content - "Before" State */}
            <div className="bg-white dark:bg-[#0f1115] p-8 md:p-12 relative h-[500px] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90 z-10 pointer-events-none" />
              
              <div className="flex gap-8">
                {/* Main Content */}
                <div className="flex-1 space-y-6 blur-[1px] opacity-60">
                  <div className="w-3/4 h-12 bg-muted rounded-lg" />
                  <div className="w-1/4 h-4 bg-muted rounded" />
                  
                  <div className="space-y-3 pt-6">
                    <div className="w-full h-4 bg-muted rounded" />
                    <div className="w-full h-4 bg-muted rounded" />
                    <div className="w-11/12 h-4 bg-muted rounded" />
                    <div className="w-full h-4 bg-muted rounded" />
                    <div className="w-5/6 h-4 bg-muted rounded" />
                  </div>
                  
                  <div className="w-full h-48 bg-muted/50 rounded-xl my-6 flex items-center justify-center text-muted-foreground">
                    Placeholder Image
                  </div>
                  
                  <div className="space-y-3">
                    <div className="w-full h-4 bg-muted rounded" />
                    <div className="w-full h-4 bg-muted rounded" />
                    <div className="w-4/5 h-4 bg-muted rounded" />
                  </div>
                </div>
                
                {/* Sidebar Ad / Clutter */}
                <div className="w-64 hidden md:flex flex-col gap-6 blur-[2px] opacity-40">
                  <div className="w-full h-64 bg-muted rounded-xl flex items-center justify-center">Ad</div>
                  <div className="w-full h-40 bg-muted rounded-xl" />
                  <div className="w-full h-80 bg-muted rounded-xl flex items-center justify-center">Newsletter Signup</div>
                </div>
              </div>

              {/* Fake Cookie Banner */}
              <div className="absolute bottom-4 left-4 right-4 bg-foreground text-background p-4 rounded-xl flex items-center justify-between blur-[1px] opacity-50 z-0">
                <div className="text-sm">We use 400 cookies to track you. Accept?</div>
                <div className="flex gap-2">
                  <div className="px-4 py-2 bg-background/20 rounded">Settings</div>
                  <div className="px-4 py-2 bg-primary text-white rounded">Accept All</div>
                </div>
              </div>

              {/* Overlay ClarityAI Magic */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center z-20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <div className="glass-card p-6 md:p-8 rounded-2xl flex flex-col items-center text-center max-w-sm">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-display font-bold text-xl mb-2">ClarityAI is active</h3>
                  <p className="text-sm text-muted-foreground mb-6">4 ads removed, reading level simplified, and key takeaways extracted.</p>
                  <button className="bg-foreground text-background px-6 py-2.5 rounded-full text-sm font-medium flex items-center gap-2">
                    Enter Focus Mode <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
