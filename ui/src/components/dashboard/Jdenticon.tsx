import {toSvg} from "jdenticon";

interface JdenticonProps {
    value: string;
}

export default function Jdenticon(props: JdenticonProps) {
    return <span className="block h-full w-full" dangerouslySetInnerHTML={{__html: toSvg(props.value, 44)}}/>;
}
