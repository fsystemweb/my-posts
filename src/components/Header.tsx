import { Github, Linkedin, Monitor } from "lucide-react";
import { promises as fs } from 'fs';
import path from 'path';

interface PersonalData {
    initial: string;
    name: string;
    role: string;
    github: string;
    portfolio: string;
    linkedin: string;
}

async function getPersonalData(): Promise<PersonalData> {
    const filePath = path.join(process.cwd(), 'public', 'personal_data.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
}

export default async function Header() {
    const data = await getPersonalData();

    return (
        <header className="sticky top-0 z-50 bg-dark/95 backdrop-blur-sm border-b border-white/10 px-4 sm:px-6 h-16 flex items-center justify-between shadow-lg shadow-[#492828]/25">
            <div className="flex items-center gap-3">
                <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center font-bold text-sm text-white shrink-0">{data.initial}</div>
                <div>
                    <div className="text-[1.1rem] font-bold text-white tracking-tight leading-tight">{data.name}</div>
                    <div className="hidden sm:block text-[0.72rem] text-white/55 font-normal tracking-wide">{data.role}</div>
                </div>
            </div>

            <nav className="flex items-center gap-2">
                <a
                    href={data.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/85 border border-white/15 hover:bg-white/10 hover:text-white hover:border-white/30 hover:-translate-y-px transition-all duration-200 whitespace-nowrap"
                    aria-label="GitHub"
                >
                    <Github className="w-[15px] h-[15px] shrink-0" />
                    <span className="hidden sm:inline">GitHub</span>
                </a>

                <a
                    href={data.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/85 border border-white/15 hover:bg-white/10 hover:text-white hover:border-white/30 hover:-translate-y-px transition-all duration-200 whitespace-nowrap"
                    aria-label="Portfolio"
                >
                    <Monitor className="w-[15px] h-[15px] shrink-0" />
                    <span className="hidden sm:inline">Portfolio</span>
                </a>

                <a
                    href={data.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/85 border border-blue-600/40 bg-blue-600/25 hover:bg-blue-600/45 hover:text-white hover:-translate-y-px transition-all duration-200 whitespace-nowrap"
                    aria-label="LinkedIn"
                >
                    <Linkedin className="w-[15px] h-[15px] shrink-0" />
                    <span className="hidden sm:inline">LinkedIn</span>
                </a>
            </nav>
        </header>
    );
}
