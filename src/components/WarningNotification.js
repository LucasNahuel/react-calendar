function WarningNotification(props){

    return(
        <div className="warning-notification-root">
            <span className="material-symbols-outlined" style={{'height': '40px', 'display' : 'flex', 'alignItems': 'center'}}>error</span>
            {props.message}
        </div>
    ) 
}

export default WarningNotification;