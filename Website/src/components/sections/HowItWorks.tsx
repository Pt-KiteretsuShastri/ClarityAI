import { motion } from 'framer-motion';
import { MousePointerClick, Zap, Sparkles, BookOpen } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: <MousePointerClick className="w-6 h-6" />,
      title: "Open any webpage",
      description: "Articles, documentation, research papers, or blog posts. If it has text, ClarityAI can read it."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Click ClarityAI",
      description: "Hit the extension icon or use a custom keyboard shortcut to instantly pause the noise."
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Choose a mode",
      description: "Select Focus, Simplify, or Dyslexia mode depending on what you need in the moment."
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Read effortlessly",
      description: "Enjoy a beautiful, personalized interface with AI-generated summaries and checklists."
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden" id="how-it-works">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-6"
          >
            How ClarityAI Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Four steps to a perfect reading environment. Zero configuration required.
          </motion.p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Desktop Timeline */}
          <div className="hidden md:grid grid-cols-4 gap-8 relative">
            <div className="absolute top-8 left-[10%] right-[10%] h-0.5 bg-border/60 z-0"></div>
            
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-2xl bg-background border border-border shadow-sm flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:border-primary/50 group-hover:shadow-primary/20 transition-all duration-300">
                  {step.icon}
                </div>
                <div className="absolute top-[-16px] left-[50%] translate-x-[-50%] bg-primary text-primary-foreground text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Mobile Timeline */}
          <div className="md:hidden flex flex-col gap-10 relative pl-4 border-l border-border/60 ml-4">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative pl-8"
              >
                <div className="absolute left-[-20px] top-0 w-10 h-10 rounded-xl bg-background border border-border shadow-sm flex items-center justify-center text-primary">
                  {step.icon}
                </div>
                <div className="absolute left-[-24px] top-[-8px] bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2 pt-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
