
import {useState} from "react";
import { Outlet, Link } from "react-router-dom";

function ModalWindow(props) {

    const [message, setMessage] = useState(props.message);
    const [link, setLink] = useState(props.link);

    return (<div className="modal-window-overlay">
                <div className="modal-window-card">
                    <p className="modal-window-message">
                        {message}
                    </p>
                    <Link className="modal-window-link" to={link}>Continue</Link>
                </div>
            </div>);
}

export default ModalWindow;