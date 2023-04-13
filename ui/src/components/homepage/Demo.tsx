import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons/faArrowRight";

export default function Demo() {
    return <div className="content-demo">
        <div className="content-demo-flags">

        </div>
        <div className="content-demo-arrow">
            <FontAwesomeIcon icon={faArrowRight}/>
        </div>
        <div className="content-demo-site">

        </div>
    </div>;
}