import {useContext, useEffect, useState} from "react";
import {CurrentCalendarsContext} from "../pages/Home"
import DeleteModalWindow from "./DeleteModalWindow";
import { Link, useNavigate} from "react-router-dom";
import SuccessNotification from "./SuccessNotification";
import WarningNotification from "./WarningNotification";

function Sidebar(props){

    const {currentCalendars, setCurrectCalendars} = useContext(CurrentCalendarsContext);
    const [sidebarStyles, setSidebarStyles] = useState(null);
    const [openSidebarButtonStyle, setOpenSidebarButtonStyle] = useState(null);
    const [closeSidebarButtonStyle, setCloseSidebarButtonStyle] = useState(null);
    const [calendars, setCalendars] = useState([]);
    const [modalWindow, setModalWindow] = useState(null);
    const [notification, setNotification] = useState(null);
    const [nextEvents, setNextEvents] = useState([]);
    const navigate = useNavigate();
    let nextEventsFound = [];

    async function getCalendars(){
        await fetch(process.env.REACT_APP_API_URL+'/getCalendars/',{
            headers : {
                'username': localStorage.getItem("username"),
                'password': localStorage.getItem("password")
            }
        }).then((response) => response.json())
        .then((data) => {

            let calendarArray = [];

            

            data.value.forEach(element => {console.log("found element " + element._id);calendarArray.push(element)});


            setCalendars( calendarArray);
            setCurrectCalendars(calendarArray);
            getNextEvents(calendarArray);
        })
        .catch((err) => {
            console.log(err.value);
        });
    }

    async function getNextEvents(){

        console.log("calendars current "+currentCalendars.length);

        nextEventsFound = [];

        let numberProcessedCalendars = 0;

        if(currentCalendars.length == 0){
            checkIfAllCalendarsProcessed(0);
        }

        currentCalendars.forEach(async function(el) {

            console.log("searching events for this timestamp: "+Date.now());

            await fetch(process.env.REACT_APP_API_URL+'/getNextEvents/'+el._id+'/'+Date.now(), {
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

                    console.log(data[0]);

                    data.forEach((el, index) =>{
                        nextEventsFound.push(<li className="calendar-list-item" key={index}>
                            <Link to="/home/eventedit" state={el} style={{'text-decoration' : 'none', 'display' : 'flex', 'width' : '100%', 'color' : 'white'}}>{el.name}</Link>
                            <button className="delete-calendar-button" onClick={()=>openDeleteEventWindow(el._id)}>
                                <span class="material-symbols-outlined">delete</span>
                            </button>
                        </li>);
                    });
                    numberProcessedCalendars++;
                    checkIfAllCalendarsProcessed(numberProcessedCalendars);
                }
            )
        });



    }

    function checkIfAllCalendarsProcessed(numberProcessedCalendars){
        console.log(numberProcessedCalendars+" != "+currentCalendars.length);
        if(numberProcessedCalendars == currentCalendars.length){
            
            setNextEvents(nextEventsFound);
        }
    }

   
    useEffect(() => {getCalendars()} , [calendars.length]);   
    useEffect(() => {getNextEvents()} , [currentCalendars.length]);


    function toggleSelectedCalendars(element){

        

        if(currentCalendars){
            if(currentCalendars.includes(element)){

                let newCurrentCalendars = [...currentCalendars];
    
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


    }

    function openDeleteEventWindow(eventId){
        setModalWindow(<DeleteModalWindow message="Are you sure you want to delete this event?" deleteAction={()=>deleteEvent(eventId)} cancelAction={()=>{setModalWindow(null)}}/>)

    }


    function deleteCalendar(calendarId){


        fetch(process.env.REACT_APP_API_URL+'/deleteCalendar/'+calendarId, {
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

    function deleteEvent(eventId){


        fetch('https://node-calendar-api.vercel.app/eventDelete/'+eventId, {
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

    function openSidebar(){
        setSidebarStyles({'display' : 'flex'});
        setOpenSidebarButtonStyle({'display' : 'none'});
        setCloseSidebarButtonStyle({'display' : 'flex'});
    }

    function closeSidebar(){
        
        setSidebarStyles({'display' : 'none'});
        setOpenSidebarButtonStyle({'display' : 'flex'});
        setCloseSidebarButtonStyle({'display' : 'none'});
    }

    function logout(){
        localStorage.removeItem("username");
        localStorage.removeItem("password");
        navigate("/login");
    }

    return(
        <>
            <button style={openSidebarButtonStyle} className="open-sidebar-button" onClick={()=>{openSidebar()}} >
                    <span class="material-symbols-outlined">menu</span>
            </button>

            <button style={closeSidebarButtonStyle} className="close-sidebar-button" onClick={()=>{closeSidebar()}} >
                    <span class="material-symbols-outlined">close</span>
            </button>


            {modalWindow}
            <div style={sidebarStyles} className="sidebar" >

                <div className="sidebar-content">

                    <button className="sidebar-button" onClick={ () => props.navigateTo("/home/calendarinspector")} style={{"display": "flex", "alignItems": "center", "gap": "1em"}}> <span class="material-symbols-outlined">date_range</span> See Calendar</button>

                    <div className="sidebar-inner-container">

                        <h4 className="sidebar-title">CALENDARS</h4>
                        <ul>{ calendars ? calendars.map((element,index) => {return (<li className="calendar-list-item" key={index}><input type="checkbox" onChange={()=>toggleSelectedCalendars(element)} checked={currentCalendars.includes(element)}/>{element.calendarName}<button className="delete-calendar-button" onClick={()=>openDeleteCalendarWindow(element._id)}><span class="material-symbols-outlined">delete</span></button></li>)}) : null }</ul>
                        <button className="sidebar-button" onClick={ () => props.navigateTo("/home/calendarcreation")}>Create calendar</button>
                    </div>



                    <div className="sidebar-inner-container">
                    
                    <h4 className="sidebar-title" >NEXT EVENTS</h4>
                    <ul>
                     {nextEvents}
                    </ul>


                    <button className="sidebar-button" onClick={ () => props.navigateTo("/home/eventcreation")}>Create event</button>
                    
                    </div>



                    <button className="sidebar-button" onClick={ () => logout()} style={{"display": "flex", "alignItems": "center", "gap": "1em"}}> <span class="material-symbols-outlined">logout</span> Logout</button>
                    
                    
                    

                </div>
                
                

            </div>

            {notification}
        </>
    )
}

export default Sidebar