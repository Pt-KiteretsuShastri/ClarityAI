import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Accessibility, Brain, Microscope, Globe } from 'lucide-react';

export function WhoItsFor() {
  const personas = [
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: "Students",
      description: "Extract key takeaways from dense textbooks and research papers instantly."
    },
    {
      icon: <Microscope className="w-6 h-6" />,
      title: "Researchers",
      description: "Strip away publisher paywall clutter and focus solely on the data."
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Professionals",
      description: "Skim industry news faster and save summaries directly to your knowledge base."
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "People with ADHD",
      description: "Remove flashing ads, sidebars, and popups that derail your attention."
    },
    {
      icon: <Accessibility className="w-6 h-6" />,
      title: "People with Dyslexia",
      description: "Read with optimized typography, spacing, and contrast settings designed for you."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Everyone Else",
      description: "Anyone tired of the modern web prioritizing advertisers over readers."
    }
  ];

  return (
    <section className="py-24 bg-background border-y border-border" id="audience">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-6"
          >
            Built for Every Kind of Reader
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {personas.map((persona, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {persona.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{persona.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {persona.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
