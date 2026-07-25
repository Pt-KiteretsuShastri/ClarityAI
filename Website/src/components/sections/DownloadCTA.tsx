import { motion } from 'framer-motion';
import { Download, Github } from 'lucide-react';
import { SiFirefox } from 'react-icons/si';

export function DownloadCTA() {
  return (
    <section className="relative py-32 overflow-hidden" id="download">
      <div className="absolute inset-0 bg-primary">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary opacity-90"></div>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.2),transparent_50%)]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Start Reading Smarter Today.
          </h2>
          <p className="text-xl text-white/80 mb-12">
            Join thousands of students, researchers, and professionals who have taken back control of their online reading experience.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/clarity-ai-extension.zip"
              download="clarity-ai-extension.zip"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-transform"
              data-testid="btn-download-chrome"
            >
              <Download className="w-5 h-5" />
              Download for Chrome
            </a>
            <a
              href="/clarity-ai-extension.zip"
              download="clarity-ai-extension.zip"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-full font-bold text-lg transition-colors backdrop-blur-sm"
              data-testid="btn-download-firefox"
            >
              <SiFirefox className="w-5 h-5" />
              Get for Firefox
            </a>
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 text-white border border-transparent hover:border-white/20 px-8 py-4 rounded-full font-bold text-lg transition-colors" data-testid="btn-github">
              <Github className="w-5 h-5" />
              Source Code
            </button>
          </div>
          <p className="mt-8 text-sm text-white/60">
            Version 1.2.4 · Requires Chrome 88+ or Firefox 109+
          </p>
        </motion.div>
      </div>
    </section>
  );
}
