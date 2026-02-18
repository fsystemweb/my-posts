import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ImageModalProps {
    src: string;
    alt: string;
    onClose: () => void;
}

export default function ImageModal({ src, alt, onClose }: ImageModalProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 w-screen h-screen bg-black/85 backdrop-blur-[5px] z-[1000] flex justify-center items-center cursor-zoom-out animate-[fadeIn_0.3s_ease]" onClick={onClose}>
            <div className="relative max-w-[90vw] max-h-[90vh] flex justify-center items-center cursor-default animate-[scaleUp_0.3s_cubic-bezier(0.165,0.84,0.44,1)]" onClick={(e) => e.stopPropagation()}>
                <button className="absolute -top-10 -right-10 sm:-right-10 right-0 bg-transparent border-none text-white cursor-pointer opacity-70 transition-opacity duration-200 leading-none p-0 hover:opacity-100" onClick={onClose}>
                    <X className="w-10 h-10" />
                </button>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={alt} className="max-w-full max-h-[90vh] object-contain rounded shadow-[0_5px_30px_rgba(0,0,0,0.5)]" />
            </div>
        </div>
    );
}
