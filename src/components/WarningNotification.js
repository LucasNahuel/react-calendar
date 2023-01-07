function WarningNotification(props){

    return(
        <div className="warning-notification-root">
            <span class="material-symbols-outlined" style={{'height': '40px', 'display' : 'flex', 'align-items': 'center'}}>error</span>
            {props.message}
        </div>
    ) 
}

export default WarningNotification;