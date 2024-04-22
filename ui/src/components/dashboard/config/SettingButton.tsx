export default function SettingButton(props: { type: string, onClick?: (e: Event) => void }) {
    return <button className={`setting-buttons-button button__${props.type.toLowerCase().replaceAll(" ", "-")}`}
                   onClick={props.onClick ? props.onClick : () => null}>
        {props.type}
    </button>
}