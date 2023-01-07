


function CalendarInspector(props){

    const date = new Date();

    function printWeek(){
        let week = [];


        for(let i = 0; i<7 ; i++){

            let dayToPrint = new Date(Date.now()+(1000*60*60*24*i));
            week.push(<div className="calendar-inspector-day">{dayToPrint.toLocaleDateString('en', { weekday: 'long' }) + " " + dayToPrint.getDate()}</div>)
        }

        return week;
    }

    return(
        <div>
            <h2>
                {date.toLocaleString('en', { month: 'long' }) + " " + date.getUTCFullYear() }
            </h2>
            <div className="calendar-inspector-week">
                {printWeek()}
            </div>

        </div>
        
    )
}

export default CalendarInspector;