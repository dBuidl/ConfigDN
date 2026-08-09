import {PropsWithChildren} from "preact/compat";

interface DialogBodyProps extends PropsWithChildren {
    class?: string;
}

export default function DialogBody(props: DialogBodyProps) {
    return <div className={`max-h-[70vh] overflow-y-auto px-6 py-5 text-sm leading-6 text-muted [&.dialog-form]:space-y-3 [&_.dialog-input-label]:block [&_.dialog-input-label]:text-xs [&_.dialog-input-label]:font-bold [&_.dialog-input-label]:uppercase [&_.dialog-input-label]:tracking-[0.13em] [&_.dialog-input-label]:text-muted [&_.dialog-input]:w-full [&_.dialog-input]:rounded-xl [&_.dialog-input]:border [&_.dialog-input]:border-line [&_.dialog-input]:bg-ink [&_.dialog-input]:px-3 [&_.dialog-input]:py-2.5 [&_.dialog-input]:text-copy [&_.dialog-input]:outline-none [&_.dialog-input]:focus:border-cyan [&_.dialog-input-large]:min-h-64 [&_.dialog-input-large]:w-full [&_.dialog-input-large]:resize-y [&_.dialog-input-large]:rounded-xl [&_.dialog-input-large]:border [&_.dialog-input-large]:border-line [&_.dialog-input-large]:bg-ink [&_.dialog-input-large]:p-4 [&_.dialog-input-large]:font-mono [&_.dialog-input-large]:text-sm [&_.dialog-input-large]:text-copy ${props.class ?? ""}`}>
        {props.children}
    </div>;
}
