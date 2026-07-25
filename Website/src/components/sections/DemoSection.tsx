import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

export function DemoSection() {
  const [activeTab, setActiveTab] = useState<'original' | 'focus' | 'simplified' | 'checklist'>('original');

  const tabs = [
    { id: 'original', label: 'Original Webpage' },
    { id: 'focus', label: 'Focus Mode' },
    { id: 'simplified', label: 'Simplified' },
    { id: 'checklist', label: 'Checklist' }
  ];

  return (
    <section className="py-24" id="demo">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-6"
          >
            See ClarityAI in Action
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Experience the difference between the chaotic web and the ClarityAI way.
          </motion.p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Browser Mockup */}
          <div className="glass-card rounded-2xl overflow-hidden border border-border shadow-2xl relative">
            <div className="bg-muted/50 border-b border-border p-3 flex items-center gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
              </div>
              <div className="flex-1 max-w-md mx-auto bg-background border border-border rounded-md px-3 py-1.5 text-xs text-muted-foreground flex items-center justify-between">
                <span>wikipedia.org/wiki/Quantum_computing</span>
                <div className="w-4 h-4 bg-primary rounded-sm flex items-center justify-center cursor-pointer">
                  <span className="text-[10px] text-white">✨</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0f1115] h-[500px] overflow-y-auto overflow-x-hidden relative">
              <AnimatePresence mode="wait">
                {activeTab === 'original' && (
                  <motion.div
                    key="original"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-8 flex gap-8"
                  >
                    <div className="w-48 hidden md:block shrink-0 space-y-4 pt-4 border-r border-border pr-4">
                      <div className="text-xs font-bold uppercase text-muted-foreground">Contents</div>
                      <div className="text-sm text-primary">1. Overview</div>
                      <div className="text-sm">2. History</div>
                      <div className="text-sm pl-4">2.1 Early Concepts</div>
                      <div className="text-sm">3. Mechanism</div>
                      <div className="mt-12 bg-muted p-4 text-xs text-center border border-border">Wikipedia asks for $2.75 to protect its independence.</div>
                    </div>
                    <div className="flex-1 font-sans text-sm md:text-base leading-relaxed text-foreground">
                      <h1 className="text-3xl font-serif font-normal border-b border-border pb-2 mb-4">Quantum computing</h1>
                      <div className="float-right w-64 border border-border p-2 ml-4 mb-4 bg-muted/20 text-xs text-center">
                        <div className="h-40 bg-muted mb-2 flex items-center justify-center">Image</div>
                        Bloch sphere representation of a qubit
                      </div>
                      <p className="mb-4">
                        A <b>quantum computer</b> is a computer that exploits quantum mechanical phenomena. 
                        At small scales, physical matter exhibits properties of both particles and waves, and quantum computing leverages this behavior, specifically quantum superposition and entanglement, using specialized hardware that supports the preparation and manipulation of quantum states.
                      </p>
                      <p className="mb-4">
                        Classical computers rely on bits that can be either 0 or 1. Quantum computers use quantum bits, or qubits, which can exist in a superposition of both states simultaneously. The coherence of these states must be maintained, which typically requires extreme cooling and isolation from the environment to prevent decoherence.
                      </p>
                      <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 border border-yellow-200 dark:border-yellow-700 my-6 text-sm">
                        <b>Notice:</b> This article has multiple issues. Please help improve it or discuss these issues on the talk page.
                      </div>
                      <h2 className="text-xl font-serif font-normal border-b border-border pb-1 mt-6 mb-3">Overview</h2>
                      <p>
                        Quantum computing is a subfield of quantum information science, which includes quantum cryptography and quantum communication. The primary advantage of a quantum computer is its potential to solve certain problems exponentially faster than any classical computer.
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'focus' && (
                  <motion.div
                    key="focus"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-12 md:p-16 max-w-2xl mx-auto"
                  >
                    <div className="font-serif text-lg leading-loose text-foreground/90">
                      <h1 className="text-4xl font-bold mb-8 text-foreground">Quantum computing</h1>
                      <p className="mb-6">
                        A quantum computer is a computer that exploits quantum mechanical phenomena. 
                        At small scales, physical matter exhibits properties of both particles and waves, and quantum computing leverages this behavior, specifically quantum superposition and entanglement, using specialized hardware that supports the preparation and manipulation of quantum states.
                      </p>
                      <p className="mb-8">
                        Classical computers rely on bits that can be either 0 or 1. Quantum computers use quantum bits, or qubits, which can exist in a superposition of both states simultaneously. The coherence of these states must be maintained, which typically requires extreme cooling and isolation from the environment to prevent decoherence.
                      </p>
                      <h2 className="text-2xl font-bold mt-10 mb-6 text-foreground">Overview</h2>
                      <p>
                        Quantum computing is a subfield of quantum information science, which includes quantum cryptography and quantum communication. The primary advantage of a quantum computer is its potential to solve certain problems exponentially faster than any classical computer.
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'simplified' && (
                  <motion.div
                    key="simplified"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-12 md:p-16 max-w-2xl mx-auto"
                  >
                    <div className="mb-6 flex items-center gap-2 text-primary text-sm font-medium bg-primary/10 px-4 py-2 rounded-lg w-fit">
                      <Sparkles className="w-4 h-4" /> AI Simplified Version
                    </div>
                    <div className="font-sans text-lg leading-relaxed text-foreground/90">
                      <h1 className="text-4xl font-bold mb-8 text-foreground">Quantum computing</h1>
                      <p className="mb-6">
                        A quantum computer is a new type of machine that uses the strange rules of physics found at the microscopic level. While regular computers use standard electricity, quantum computers use particles that act like both solid objects and waves.
                      </p>
                      <p className="mb-8">
                        Regular computers think in binary: everything is either a 0 or a 1 (like a light switch being off or on). Quantum computers use "qubits." A qubit can be a 0, a 1, or weirdly, both at the exact same time. This is incredibly powerful, but very fragile — the machines have to be kept extremely cold and isolated so they don't break.
                      </p>
                      <h2 className="text-2xl font-bold mt-10 mb-6 text-foreground">Why it matters</h2>
                      <p>
                        The main reason people are excited about quantum computers is speed. For certain complex math problems, a quantum computer could find the answer millions of times faster than the best supercomputers we have today.
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'checklist' && (
                  <motion.div
                    key="checklist"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-12 md:p-16 max-w-2xl mx-auto"
                  >
                     <div className="mb-8 flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-primary text-sm font-medium">
                          <Sparkles className="w-4 h-4" /> 5 Key Takeaways
                        </div>
                        <h1 className="text-3xl font-bold text-foreground">Quantum computing</h1>
                     </div>

                     <div className="space-y-4">
                       {[
                         "Quantum computers use subatomic physics (particles acting like waves) to process information.",
                         "Unlike standard bits (0 or 1), quantum qubits can exist as 0, 1, or both simultaneously (superposition).",
                         "They require extreme cooling and isolation to function without breaking (decoherence).",
                         "They belong to a broader field that includes quantum cryptography and communication.",
                         "Their main promise is solving specific complex problems exponentially faster than classical computers."
                       ].map((point, idx) => (
                         <div key={idx} className="flex gap-4 p-4 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                           <div className="mt-0.5 text-primary">
                             <CheckCircle2 className="w-5 h-5" />
                           </div>
                           <p className="text-foreground/90">{point}</p>
                         </div>
                       ))}
                     </div>
                     <div className="mt-10 flex gap-4">
                       <button className="px-6 py-2 bg-foreground text-background rounded-full text-sm font-medium">Read Full Article</button>
                       <button className="px-6 py-2 bg-muted text-foreground border border-border rounded-full text-sm font-medium flex items-center gap-2">Save to Notion <ChevronRight className="w-4 h-4" /></button>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
