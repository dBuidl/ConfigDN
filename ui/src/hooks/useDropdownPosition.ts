import {useEffect, useState} from "preact/compat";

interface DropdownPosition {
    top: number;
    left: number;
    width: number;
}

export default function useDropdownPosition<T extends HTMLElement>(isOpen: boolean, anchorRef: { current: T | null }) {
    const [position, setPosition] = useState<DropdownPosition | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setPosition(null);
            return;
        }

        const updatePosition = () => {
            const rect = anchorRef.current?.getBoundingClientRect();
            if (!rect) return;

            setPosition({
                top: rect.bottom + 8,
                left: rect.left,
                width: rect.width,
            });
        };

        updatePosition();
        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition, true);

        return () => {
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition, true);
        };
    }, [isOpen]);

    return position;
}
