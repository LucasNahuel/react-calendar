


function CalendarInspector(props){

    const date = new Date();

    function printWeek(){
        let week = [];


        for(let i = 0; i<7 ; i++){

            let dayToPrint = new Date(Date.now()+(1000*60*60*24*i));
            week.push(<div className="calendar-inspector-day">
                <div className="hour-cell">{dayToPrint.toLocaleDateString('en', { weekday: 'long' }) + " " + dayToPrint.getDate()}</div>
                
            </div>)
        }

        return week;
    }


    function printEventsOfTheDay(day){
        //fetch all the events in the day (begins the 00hs of the day or begins before and ends the same/after the day)

        

        
    }

    function printHoursRuler(){
        let hoursRuler = [];

        hoursRuler.push(<div className="hour-cell">hours</div>)

        for(let i = 0 ; i < 25 ; i++){
            hoursRuler.push(<div className="hour-cell">{i}:00 hs</div>);
        }

        return hoursRuler;
    }

    return(
        <div>
            <h2>
                {date.toLocaleString('en', { month: 'long' }) + " " + date.getUTCFullYear() }
            </h2>
            <div className="calendar-inspector-week">
                <div className="hours-ruler">{printHoursRuler()}</div>
                {printWeek()}
            </div>

        </div>
        
    )
}

export default CalendarInspector;