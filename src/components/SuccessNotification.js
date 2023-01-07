
function SuccessNotification(props){

    return(
        <div className="success-notification-root">
            <span class="material-symbols-outlined" style={{'height': '40px', 'display' : 'flex', 'align-items': 'center'}}>done</span>
            {props.message}
        </div>
    ) 
}

export default SuccessNotification;