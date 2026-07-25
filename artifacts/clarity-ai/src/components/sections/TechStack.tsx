import { motion } from 'framer-motion';
import { SiGooglechrome, SiFirefox, SiJavascript, SiNotion, SiReact, SiTailwindcss } from 'react-icons/si';
import { Brain, Bot } from 'lucide-react';

export function TechStack() {
  const tech = [
    { icon: <SiGooglechrome className="w-8 h-8" />, name: "Chrome V3" },
    { icon: <SiFirefox className="w-8 h-8" />, name: "Firefox" },
    { icon: <SiReact className="w-8 h-8" />, name: "React" },
    { icon: <SiTailwindcss className="w-8 h-8" />, name: "Tailwind" },
    { icon: <SiJavascript className="w-8 h-8" />, name: "TypeScript" },
    { icon: <Brain className="w-8 h-8" />, name: "Claude API" },
    { icon: <Bot className="w-8 h-8" />, name: "OpenAI" },
    { icon: <SiNotion className="w-8 h-8" />, name: "Notion API" },
  ];

  return (
    <section className="py-20 border-b border-border overflow-hidden bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-10">
          Powered by modern technology
        </p>
        
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70">
          {tech.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col items-center gap-2 grayscale hover:grayscale-0 transition-all duration-300 hover:text-primary"
            >
              {item.icon}
              <span className="text-xs font-medium hidden md:block">{item.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
