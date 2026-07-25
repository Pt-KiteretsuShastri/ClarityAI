import { motion } from 'framer-motion';

export function ProblemSection() {
  const problems = [
    { label: "Intrusive Ads", top: "10%", left: "5%", width: "120px", height: "200px" },
    { label: "Cookie Banners", top: "80%", left: "10%", width: "80%", height: "60px" },
    { label: "Sticky Navbars", top: "0%", left: "0%", width: "100%", height: "40px" },
    { label: "Newsletter Popups", top: "30%", left: "25%", width: "50%", height: "250px" },
    { label: "Autoplay Video", top: "50%", left: "70%", width: "25%", height: "150px" },
    { label: "Jargon & Density", top: "20%", left: "20%", width: "60%", height: "400px", isText: true },
  ];

  return (
    <section className="py-24 bg-muted/30 border-y border-border" id="problem">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-6"
          >
            The web was built for publishing.<br />
            <span className="text-muted-foreground">Not for understanding.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            We spend hours reading online, yet we are constantly fighting against the interface.
          </motion.p>
        </div>

        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-background border border-destructive/20 rounded-xl overflow-hidden h-[500px] shadow-xl flex items-center justify-center"
          >
            {/* The Cluttered Web Visualization */}
            <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
            
            {problems.map((prob, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                className={`absolute bg-destructive/10 border border-destructive/30 backdrop-blur-sm rounded-md flex items-center justify-center text-xs font-semibold text-destructive shadow-sm ${prob.isText ? 'opacity-40' : ''}`}
                style={{ 
                  top: prob.top, 
                  left: prob.left, 
                  width: prob.width, 
                  height: prob.height,
                  zIndex: prob.isText ? 1 : 10
                }}
              >
                {prob.label}
              </motion.div>
            ))}

            <div className="relative z-20 text-center max-w-md mx-auto p-8 glass-card rounded-2xl border-primary/20">
              <h3 className="text-xl font-bold mb-4">It doesn't have to be this way.</h3>
              <p className="text-muted-foreground">
                ClarityAI adapts the webpage to the reader — instantly stripping away distractions and simplifying complex text.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
