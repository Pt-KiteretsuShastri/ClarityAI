import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

function Counter({ from, to, duration, suffix = "", prefix = "" }: { from: number, to: number, duration: number, suffix?: string, prefix?: string }) {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let startTime: number | null = null;
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * (to - from) + from));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, from, to, duration]);

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
}

export function StatsSection() {
  const stats = [
    { value: 47, suffix: "M+", label: "People struggle with online readability daily." },
    { value: 73, suffix: "%", label: "Of webpages are written above the average reading level." },
    { value: 28, suffix: "", label: "Average distracting elements per webpage." },
    { value: 3, suffix: "x", label: "Better comprehension with focused reading mode." }
  ];

  return (
    <section className="py-24 border-y border-border relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10"></div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center md:text-left flex flex-col justify-center"
            >
              <div className="text-6xl md:text-7xl font-display font-bold text-foreground mb-4">
                <Counter from={0} to={stat.value} duration={2} suffix={stat.suffix} />
              </div>
              <p className="text-muted-foreground font-medium text-lg border-l-2 border-primary/30 pl-4 ml-0 md:ml-2">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
