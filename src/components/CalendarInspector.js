import {useContext, useEffect, useState} from "react";

import {CurrentCalendarsContext} from "../pages/Home"

function CalendarInspector(props){

    const date = new Date();
    let dailyRuler = [];
    
    const {currentCalendars, setCurrectCalendars} = useContext(CurrentCalendarsContext);

     function printWeek(){
        let week = [];


        for(let i = 0; i<7 ; i++){

            let dayToPrint = new Date(Date.now()+(1000*60*60*24*i));
            week.push(<div className="calendar-inspector-day">
                <div className="hour-cell">{dayToPrint.toLocaleDateString('en', { weekday: 'long' }) + " " + dayToPrint.getDate()}</div>
                {printEventsOfTheDay(dayToPrint.getTime())}
            </div>)
        }

        return week;
    }


    function printEventsOfTheDay(day){
        
        dailyRuler = [];

        let hourRuler = [];

        for(let i = 0; i< 24; i++){
            hourRuler.push(<div className="hour-cell"></div>)
        }

        //fetch all the events in the day (begins the 00hs of the day or begins before and ends the same/after the day)
        let nextEventsFound = [];

        if(currentCalendars.length > 0){

            let numberProcessedCalendars = 0;

            currentCalendars.forEach(async function(el) {
                await fetch('http://localhost:4200/getEventsByDay/'+el._id+'/'+day, {
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

                            console.log(el);
                            
                            let actualDayBeginStamp = new Date(day);

                            actualDayBeginStamp.setHours(0, 0, 0, 0);

                            let actualDayEndStamp = new Date(day);

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





                            hourRuler.push(
                                <div style={{'position': 'absolute', 'top' : ((((eventFoundTopPosition)/3600000)*45)+(130+42))+'px','height': ((eventFoundLength*45)/(3600000))+'px', 'width': '60px', 'background-color': 'teal'}}>
                                    {el.name}
                                </div>
                            )

                            
                        });
                    }
                )

                return hourRuler;
            });

        }

        setTimeout(() => {
            return printRuler(hourRuler);
        }, 5000);


        
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

        //get the events

        let actualDayBeginStamp = new Date(Date.now());

        actualDayBeginStamp.setHours(0, 0, 0, 0);

        let actualDayEndStamp = new Date(Date.now());

        actualDayEndStamp.setHours(23, 59, 59, 999);

        let dummyEventBeginStamp = Date.now();

        if(dummyEventBeginStamp < actualDayBeginStamp.getTime()){

            dummyEventBeginStamp = actualDayBeginStamp.getTime();
        }

        let dummyEventEndStamp = Date.now()+(3600000);

        if(dummyEventEndStamp > actualDayEndStamp.getTime()){
            console.log("event end > actual day end");
            dummyEventEndStamp = actualDayEndStamp.getTime();
        }

        let datebegin = new Date(dummyEventBeginStamp);

        console.log("begin: "+datebegin.getHours());
        console.log("end: "+dummyEventEndStamp);


        let dummyEventLength = dummyEventEndStamp - dummyEventBeginStamp;
        let dummyEventTop = dummyEventBeginStamp - actualDayBeginStamp.getTime();

        console.log("length: "+dummyEventLength);
        console.log("event top: "+dummyEventTop)




        hoursRuler.push(
            <div style={{'position': 'absolute', 'top' : ((((dummyEventTop)/3600000)*45)+(130+42))+'px','height': ((dummyEventLength*45)/(3600000))+'px', 'width': '60px', 'background-color': 'teal'}}>

            </div>
        )



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