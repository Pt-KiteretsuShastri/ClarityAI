import { motion } from 'framer-motion';
import { Github, FileCode2 } from 'lucide-react';

export function OpenSource() {
  return (
    <section className="py-24 relative overflow-hidden" id="open-source">
      {/* Code background pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none font-mono text-xs p-8 leading-loose overflow-hidden whitespace-pre">
        {`function extractContent(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent || '';
  if (isAdsOrClutter(node)) return '';
  return Array.from(node.childNodes)
    .map(extractContent)
    .join(' ');
}

async function simplifyText(text: string): Promise<string> {
  const prompt = \`Rewrite this text for a 8th grade reading level: \${text}\`;
  const response = await ai.generate(prompt);
  return response.text;
}`}
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 bg-card border border-border p-8 md:p-12 rounded-3xl shadow-lg">
          <div className="flex-1 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 font-medium text-sm mb-6 border border-green-500/20"
            >
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>100% Free & Open Source</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
            >
              Built in the open.<br /> For everyone.
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground mb-8"
            >
              We believe tools that change how we read should belong to the community. Inspect the code, build your own plugins, and contribute to the future of reading online.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
            >
              <a 
                href="https://github.com" 
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-foreground text-background px-6 py-3 rounded-full font-medium transition-transform hover:scale-105"
              >
                <Github className="w-5 h-5" />
                Star on GitHub
              </a>
              <a 
                href="#"
                className="flex items-center justify-center gap-2 bg-muted text-foreground border border-border px-6 py-3 rounded-full font-medium transition-colors hover:bg-muted/80"
              >
                <FileCode2 className="w-5 h-5" />
                Read the Docs
              </a>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 w-full max-w-sm hidden md:block"
          >
            <div className="bg-[#0d1117] rounded-xl border border-border/50 overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-[#161b22]">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                <span className="ml-2 text-xs text-[#8b949e] font-mono">manifest.json</span>
              </div>
              <div className="p-4 font-mono text-sm leading-relaxed text-[#c9d1d9] overflow-x-auto">
                <span className="text-[#ff7b72]">{"{"}</span><br/>
                &nbsp;&nbsp;<span className="text-[#79c0ff]">"name"</span>: <span className="text-[#a5d6ff]">"ClarityAI"</span>,<br/>
                &nbsp;&nbsp;<span className="text-[#79c0ff]">"version"</span>: <span className="text-[#a5d6ff]">"1.0.0"</span>,<br/>
                &nbsp;&nbsp;<span className="text-[#79c0ff]">"manifest_version"</span>: <span className="text-[#79c0ff]">3</span>,<br/>
                &nbsp;&nbsp;<span className="text-[#79c0ff]">"description"</span>: <span className="text-[#a5d6ff]">"Read without noise."</span>,<br/>
                &nbsp;&nbsp;<span className="text-[#79c0ff]">"permissions"</span>: [<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#a5d6ff]">"activeTab"</span>,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#a5d6ff]">"storage"</span><br/>
                &nbsp;&nbsp;]<br/>
                <span className="text-[#ff7b72]">{"}"}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
