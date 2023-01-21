import {useContext, useEffect, useState} from "react";
import { Link } from "react-router-dom";

import {CurrentCalendarsContext} from "../pages/Home"

import colours from "./appColours";

function CalendarInspector(props){

    const date = new Date();
    
    const {currentCalendars, setCurrectCalendars} = useContext(CurrentCalendarsContext);
    const [week, setWeek] = useState([]);


    useEffect(() => {loadEventsOfTheWeek()}, [currentCalendars.length]);


    function loadEventsOfTheWeek(){
        let currentWeekEventsFound = new Array(7);
        let numberEventsFound = 0;
        let numberProcessedCalendars = 0;


        for(let i = 0 ; i<7; i++){

            let dayToFindStamp = new Date(Date.now()+(1000*60*60*24*i)).getTime();

            if(currentCalendars.length > 0){

                let eventsFoundThisDay = [];
    
                currentCalendars.forEach(async function(el) {
                    await fetch('http://localhost:4200/getEventsByDay/'+el._id+'/'+dayToFindStamp, {
                        headers : {
                            'username': localStorage.getItem("username"),
                            'password': localStorage.getItem("password")
                        }
                    }).then(async function(response){
                        if(response.ok){
                            return await response.json();
                        }else{
                            throw new Error("An error happend while retrieving next events");
                        }
                    }).then(
                        async function(data){

                            

                            data.value.forEach((el) =>{
    
                                
                                console.log("found element for the day: "+i);
                                console.log(el);
                                
                                let actualDayBeginStamp = new Date(dayToFindStamp);
    
                                actualDayBeginStamp.setHours(0, 0, 0, 0);
    
                                let actualDayEndStamp = new Date(dayToFindStamp);
    
                                actualDayEndStamp.setHours(23, 59, 59, 999);
    
                                let eventFoundBeginStamp = new Date(el.beginDate).getTime();
    
                                if(eventFoundBeginStamp < actualDayBeginStamp.getTime()){
    
                                    eventFoundBeginStamp = actualDayBeginStamp.getTime();
                                }
    
                                let eventFoundEndStamp = new Date(el.endDate).getTime();
    
                                if(eventFoundEndStamp > actualDayEndStamp.getTime()){
                                    console.log("event end > actual day end");
                                    eventFoundEndStamp = actualDayEndStamp.getTime();
                                }
                                
                                let eventFoundLength = eventFoundEndStamp - eventFoundBeginStamp;
                                let eventFoundTopPosition = eventFoundBeginStamp - actualDayBeginStamp.getTime();
    
    
    
    
    
                                eventsFoundThisDay.push(
                                    <div className="event-miniature" style={{'position': 'absolute', 'top' : ((((eventFoundTopPosition)/3600000)*45)+(130+42))+'px','height': ((eventFoundLength*45)/(3600000))+'px', 'background-color': colours[el.name.length%5], 'border-radius': '5px', 'padding' : '7px'}}>
                                        <Link to="/home/eventedit" state={el}>{el.name}</Link>
                                        
                                    </div>
                                )

                                numberEventsFound++;
    
                                
                            });

                            currentWeekEventsFound[i] = eventsFoundThisDay;

                            if(i == 6){
                                numberProcessedCalendars++;
                                if(numberProcessedCalendars == currentCalendars.length){

                                    let week = [];

                                    console.log("events at print week call");
                                    console.log(currentWeekEventsFound);
                            
                                    for(let j = 0; j<7 ; j++){
                            
                                        let dayToPrint = new Date(Date.now()+(1000*60*60*24*j));
                                        week.push(<div className="calendar-inspector-day">
                                            <div className="hour-cell">{dayToPrint.toLocaleDateString('en', { weekday: 'long' }) + " " + dayToPrint.getDate()}</div>
                                            {printEventsOfTheDay(dayToPrint.getTime())}
                                            {currentWeekEventsFound[j]}
                                        </div>)
                                    }

                                    setWeek(week);
                                } 
                           }
                        }
                    )
    
                });

    
            }else{

                let week = [];

                console.log("events at print week call");
                console.log(currentWeekEventsFound);
        
                for(let j = 0; j<7 ; j++){
        
                    let dayToPrint = new Date(Date.now()+(1000*60*60*24*j));
                    week.push(<div className="calendar-inspector-day">
                        <div className="hour-cell">{dayToPrint.toLocaleDateString('en', { weekday: 'long' }) + " " + dayToPrint.getDate()}</div>
                        {printEventsOfTheDay(dayToPrint.getTime())}
                        {currentWeekEventsFound[j]}
                    </div>)
                }

                setWeek(week);

            }

        }

    }

    function printWeek(){

    }


    function printEventsOfTheDay(){
        
        let dailyRuler = [];

        let hourRuler = [];

        for(let i = 0; i< 24; i++){
            hourRuler.push(<div className="hour-cell"></div>)
        }



        //fetch all the events in the day (begins the 00hs of the day or begins before and ends the same/after the day)
        return hourRuler;

        
    }

    function printRuler(hourRuler){
        return hourRuler;
    }

    function printHoursRuler(){
        let hoursRuler = [];

        hoursRuler.push(<div className="hour-cell">hours</div>)

        for(let i = 0 ; i < 24 ; i++){
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
                {week}
            </div>

        </div>
        
    )
}

export default CalendarInspector;