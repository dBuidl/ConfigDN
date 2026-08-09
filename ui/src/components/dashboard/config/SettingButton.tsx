export default function SettingButton(props: { type: string, onClick?: (e: Event) => void }) {
    const colors = props.type === "New Flag" ? "border-cyan bg-cyan text-ink hover:bg-transparent hover:text-cyan" : props.type === "Save All" ? "border-lime bg-lime text-ink hover:bg-transparent hover:text-lime" : "border-line bg-panel text-muted hover:border-amber hover:text-amber";

    return <button className={`cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-bold transition ${colors}`}
                   onClick={props.onClick ? props.onClick : () => null}>
        {props.type}
    </button>
}
