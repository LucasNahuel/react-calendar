
import {useState} from "react";
import { Outlet, Link } from "react-router-dom";

function DeleteModalWindow(props) {


    const [message, setMessage] = useState(props.message);

    return (<div className="modal-window-overlay">
                <div className="modal-window-card" style={{"height": "auto"}}>
                    <p className="modal-window-message">
                        {message}
                    </p>
                    <div className="modal-window-action-container">
                        <Link className="modal-window-link" onClick={(ev)=>{ev.preventDefault(); props.deleteAction()}} >Accept</Link>
                        <Link className="modal-window-cancel-link" onClick={()=>props.cancelAction()} >Cancel</Link>
                    </div>
                    
                </div>
            </div>);
}

export default DeleteModalWindow;