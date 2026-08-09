import {PropsWithChildren} from "preact/compat";

export default function DialogFooter(props: PropsWithChildren) {
    return <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line/70 px-6 py-4 [&_.dialog-action]:cursor-pointer [&_.dialog-action]:rounded-xl [&_.dialog-action]:border [&_.dialog-action]:px-4 [&_.dialog-action]:py-2.5 [&_.dialog-action]:text-sm [&_.dialog-action]:font-bold [&_.dialog-action__save]:border-lime [&_.dialog-action__save]:bg-lime [&_.dialog-action__save]:text-ink [&_.dialog-action__cancel]:border-line [&_.dialog-action__cancel]:bg-transparent [&_.dialog-action__cancel]:text-muted [&_.dialog-action__delete]:border-red [&_.dialog-action__delete]:bg-red [&_.dialog-action__delete]:text-ink [&_.dialog-error]:mr-auto [&_.dialog-error]:text-sm [&_.dialog-error]:text-red">
        {props.children}
    </div>;
}
