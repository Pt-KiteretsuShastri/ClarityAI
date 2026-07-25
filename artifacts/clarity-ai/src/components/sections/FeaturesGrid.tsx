import { motion } from 'framer-motion';

export function FeaturesGrid() {
  const features = [
    {
      icon: "🎯",
      title: "Focus Mode",
      description: "Strips away sidebars, ads, and popups, leaving only beautifully typeset content.",
      className: "md:col-span-2 md:row-span-2",
    },
    {
      icon: "📖",
      title: "Dyslexia Mode",
      description: "Applies OpenDyslexic font, increases letter spacing, and tints background for easier reading.",
      className: "md:col-span-1 md:row-span-1",
    },
    {
      icon: "✂️",
      title: "Simplify",
      description: "AI rewrites dense jargon into plain, accessible language with one click.",
      className: "md:col-span-1 md:row-span-1",
    },
    {
      icon: "✅",
      title: "Reading Checklist",
      description: "Instantly extracts 5 key takeaways so you know if an article is worth your time.",
      className: "md:col-span-1 md:row-span-1",
    },
    {
      icon: "📝",
      title: "Save to Notion",
      description: "Send highlights, summaries, and full text directly to your database.",
      className: "md:col-span-1 md:row-span-1",
    }
  ];

  return (
    <section className="py-24 bg-muted/10" id="features">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-6"
          >
            Everything you need to <br className="hidden md:block"/> read better.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto auto-rows-[minmax(200px,auto)]">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`glass-card rounded-3xl p-8 hover:-translate-y-1 hover:shadow-primary/10 transition-all duration-300 flex flex-col justify-between group ${feature.className}`}
            >
              <div>
                <div className="text-4xl mb-6 bg-primary/10 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
