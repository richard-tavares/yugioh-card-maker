import { FaGithub, FaLinkedin } from "react-icons/fa";
import { STRINGS } from "@/constants/strings";

const LINK_CLASS = "hover:text-blue-800 transition";

export function Footer() {
    return (
        <footer className="w-full h-10 bg-slate-950 text-white text-sm flex items-center justify-between px-4 lg:fixed lg:bottom-0 lg:left-0 lg:z-10 relative">
            <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
                <p className="text-left md:text-center">{STRINGS.app.credit(new Date().getFullYear())}</p>
            </div>

            <div className="flex gap-4 ml-auto">
                <a
                    href="https://www.linkedin.com/in/richard-tavares"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={STRINGS.app.linkedIn}
                    className={LINK_CLASS}
                >
                    <FaLinkedin size={25} />
                </a>
                <a
                    href="https://github.com/richard-tavares"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={STRINGS.app.gitHub}
                    className={LINK_CLASS}
                >
                    <FaGithub size={25} />
                </a>
            </div>
        </footer>
    );
}
