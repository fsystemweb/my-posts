export default function Header() {
    return (
        <header className="sticky top-0 z-50 bg-dark/95 backdrop-blur-sm border-b border-white/10 px-4 sm:px-6 h-16 flex items-center justify-between shadow-lg shadow-[#492828]/25">
            <div className="flex items-center gap-3">
                <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center font-bold text-sm text-white shrink-0">F</div>
                <div>
                    <div className="text-[1.1rem] font-bold text-white tracking-tight leading-tight">Facundo</div>
                    <div className="hidden sm:block text-[0.72rem] text-white/55 font-normal tracking-wide">AI & Software Engineer</div>
                </div>
            </div>

            <nav className="flex items-center gap-2">
                <a
                    href="https://github.com/fsystemweb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/85 border border-white/15 hover:bg-white/10 hover:text-white hover:border-white/30 hover:-translate-y-px transition-all duration-200 whitespace-nowrap"
                    aria-label="GitHub"
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-[15px] h-[15px] shrink-0">
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    <span className="hidden sm:inline">GitHub</span>
                </a>

                <a
                    href="https://fsystemweb.github.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/85 border border-white/15 hover:bg-white/10 hover:text-white hover:border-white/30 hover:-translate-y-px transition-all duration-200 whitespace-nowrap"
                    aria-label="Portfolio"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-[15px] h-[15px] shrink-0">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                    <span className="hidden sm:inline">Portfolio</span>
                </a>

                <a
                    href="https://www.linkedin.com/in/facundo-sistema/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/85 border border-blue-600/40 bg-blue-600/25 hover:bg-blue-600/45 hover:text-white hover:-translate-y-px transition-all duration-200 whitespace-nowrap"
                    aria-label="LinkedIn"
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-[15px] h-[15px] shrink-0">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    <span className="hidden sm:inline">LinkedIn</span>
                </a>
            </nav>
        </header>
    );
}
