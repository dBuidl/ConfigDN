export default function SettingButton(props: { type: string, onClick?: (e: Event) => void }) {
    return <button class={`setting-buttons-button button__${props.type.toLowerCase().replaceAll(" ", "-")}`}
                   onClick={props.onClick ? props.onClick : () => null}>
        {props.type}
    </button>
}