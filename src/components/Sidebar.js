import {useContext, useEffect, useState} from "react";
import {CurrentCalendarsContext} from "../pages/Home"
import DeleteModalWindow from "./DeleteModalWindow";
import { useNavigate} from "react-router-dom";
import SuccessNotification from "./SuccessNotification";
import WarningNotification from "./WarningNotification";

function Sidebar(props){

    const {currentCalendars, setCurrectCalendars} = useContext(CurrentCalendarsContext);
    const [calendars, setCalendars] = useState([]);
    const [modalWindow, setModalWindow] = useState(null);
    const [notification, setNotification] = useState(null);
    const [nextEvents, setNextEvents] = useState([]);
    const navigate = useNavigate();

    async function getCalendars(){
        await fetch('http://localhost:4200/getCalendars/',{
            headers : {
                'username': localStorage.getItem("username"),
                'password': localStorage.getItem("password")
            }
        }).then((response) => response.json())
        .then((data) => {

            let calendarArray = [];

            data.value.forEach(element => {calendarArray.push(element)});

            console.log({calendarArray})

            setCalendars( calendarArray);
            setCurrectCalendars(calendarArray);
        })
        .catch((err) => {
            console.log(err.value);
        });
    }

    async function getNextEvents(){

        let nextEventsFound = [];

        currentCalendars.forEach(async function(el) {
            await fetch('http://localhost:4200/getNextEvents/'+el._id+'/'+Date.now(), {
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
                        nextEventsFound.push(<li className="calendar-list-item">{el.name}</li>);
                    });
                }
            )
        });


        //this isn't ideal, i need to find the way to know when the fetch ended
        setTimeout(()=>{

            setNextEvents(nextEventsFound);
        }, 2000)
    }

   
    useEffect(() => {getCalendars()} , [calendars.length]);   
    useEffect(() => {getNextEvents()} , [currentCalendars.length]);


    function toggleSelectedCalendars(element){

        

        if(currentCalendars){
            if(currentCalendars.includes(element)){

                let newCurrentCalendars = [...currentCalendars];
                console.log({newCurrentCalendars});
    
                let index = currentCalendars.indexOf(element);
                newCurrentCalendars.splice(index, 1);
                setCurrectCalendars(newCurrentCalendars);
            }else{
                currentCalendars.push(element);

                setCurrectCalendars([...currentCalendars])
            }
        }

    }

    function openDeleteCalendarWindow(calendarId){

        setModalWindow(<DeleteModalWindow message="Are you sure you want to delete this calendar?" deleteAction={()=>deleteCalendar(calendarId)} cancelAction={()=>{setModalWindow(null)}}/>)

        console.log(calendarId);

    }


    function deleteCalendar(calendarId){

        console.log("deletingCalendar"+calendarId);

        fetch('http://localhost:4200/deleteCalendar/'+calendarId, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'username': localStorage.getItem("username"),
                'password': localStorage.getItem("password")
            },
        }).then(response => {
            if (response.ok) {  
                return response.json();
            } 
            else {  
                throw new Error('There was an error deleting!');
           }
       }).then((data) => {

            console.log(data);


            
            //should show message and reload
            setNotification(<SuccessNotification message="Correctly deleted"/>);
            
            setTimeout(() =>{navigate(0); setNotification(null)}, 5000);

        })
        .catch((err) => {
            setNotification(<WarningNotification message="There was an error deleting!"/>);
            setTimeout(() =>{setNotification(null)}, 5000);
            console.log("there was an error"+err);
        });

        setModalWindow(null);

    }

    return(
        <>
            {modalWindow}
            <div className="sidebar">
                
                <h4 className="sidebar-title">CALENDARS</h4>
                <ul>{ calendars ? calendars.map((element,index) => {return (<li className="calendar-list-item" key={index}><input type="checkbox" onChange={()=>toggleSelectedCalendars(element)} checked={currentCalendars.includes(element)}/>{element.calendarName}<button className="delete-calendar-button" onClick={()=>openDeleteCalendarWindow(element._id)}><span class="material-symbols-outlined">delete</span></button></li>)}) : null }</ul>
                <button className="sidebar-button" onClick={ () => props.navigateTo("/home/calendarcreation")}>Create calendar</button>

                <h4 className="sidebar-title" style={{'margin-top': '1em'}}>NEXT EVENTS</h4>
                <ul>
                { nextEvents}
                </ul>

                
                
                <button className="sidebar-button" onClick={ () => props.navigateTo("/home/eventcreation")}>Create event</button>

            </div>

            {notification}
        </>
    )
}

export default Sidebar