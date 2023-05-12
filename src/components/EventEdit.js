import {useState, useEffect} from "react";
import { useNavigate } from 'react-router';
import SuccessNotification from './SuccessNotification';
import WarningNotification from "./WarningNotification"
import { useLocation } from "react-router";
import DeleteModalWindow from "./DeleteModalWindow";

function EventEdit(props){

    const location = useLocation();

    

    const navigate = useNavigate();

    const [eventform, setEventForm] = useState({
        id: null,
        name: '',
        description: '',
        nameErrors: [],
        beginingDate: new Date().toISOString().substring(0, 16),
        beginingDateMs: null,
        beginingDateErrors: [],
        endDate: new Date().toISOString().substring(0, 16),
        endDateMs: null,
        endDateErrors: [],
        calendarId: null,
        isEventEdited: false
    });
   const [notification, setNotification] = useState(null);

    const [minimumEndDate, setMinimumEndDate] = useState(null);
    const [maximumStartDate, setMaximumStartDate] = useState(null);
    const [loadnumber, setLoadNumber] = useState(0);

    const [styles, setStyles] = useState({
        nameFieldStyle : {'borderColor': 'var(--approved-green)'},
        endingDateFieldStyle : {'borderColor': 'var(--approved-green)'},
        descriptionFieldStyle : {'borderColor': 'var(--approved-green)'},
        beginingDateFieldStyle : {'borderColor': 'var(--approved-green)'}
    });

    const [calendars, setCalendars] = useState([]);

    
    const [modalWindow, setModalWindow] = useState(null);



    useEffect(() => {setTimeout( () => setEventForm({
        id: location.state._id,
        name: location.state.name,
        description: location.state.description,
        nameErrors: [],
        beginingDate: getLocalizedIsoString(location.state.beginDate),
        beginingDateMs: location.state.beginDate,
        beginingDateErrors: [],
        endDate: getLocalizedIsoString(location.state.endDate),
        endDateMs: location.state.endDate,
        endDateErrors: [],
        calendarId: location.state.calendarId,
        isEventEdited: false
    }), 2000)}, [location]);

    

    useEffect(() => {  getCalendars() }, [calendars.length]);

    function getLocalizedIsoString(dateMs){
        let date = new Date(dateMs);

        return date.getFullYear()+"-"+addZeroes(date.getMonth()+1)+"-"+addZeroes(date.getDate())+"T"+addZeroes(date.getHours())+":"+addZeroes(date.getMinutes());
    }

    function addZeroes(element){
        if(element < 10){
            return "0"+element;
        }else{
            return element;
        }
    }

    function handleNameChange(ev){
        let nameErrors = [];
        
        if(ev.target.value == 0){
            nameErrors.push("Name is required");
        }else if(ev.target.value.length < 3){
            nameErrors.push("Name should be at least 3 characters long");
        }

        if (nameErrors.length > 0){
            setStyles({...styles, nameFieldStyle : {'borderColor': 'var(--warning-red)'}});
        }else{
            setStyles({...styles, nameFieldStyle : {'borderColor': 'var(--approved-green)'}});
        }

        setEventForm({...eventform, name : ev.target.value, nameErrors : nameErrors, isEventEdited: true});


    }

    function handleDescriptionChange(ev){
        setEventForm({...eventform, description : ev.target.value, isEventEdited: true});

        if(ev.target.value.length > 0){
            setStyles({...styles, descriptionFieldStyle: {'borderColor': 'var(--approved-green)'}});
        }else{
            setStyles({...styles, descriptionFieldStyle: {'borderColor': 'teal'}});
        }
    }

    function handleBeginingDateChange(ev){

        
        ev.preventDefault();


        let beginingDateErrors = [];

        let selectedDate = new Date(ev.target.value);

        if(eventform.endDate && selectedDate.getTime() > eventform.endDateMs){
            beginingDateErrors.push("Begining time can't be greater than ending time");
            setStyles({...styles, beginingDateFieldStyle: {'borderColor': 'var(--warning-red)'}});
        }else{
            setStyles({...styles, beginingDateFieldStyle: {'borderColor': 'var(--approved-green)'}});
        }

        setMinimumEndDate(getLocalizedIsoString(selectedDate.getTime()));

        setEventForm({...eventform, beginingDate : selectedDate.toISOString().substring(0, 16), beginingDateErrors : beginingDateErrors, isEventEdited: true, beginingDateMs : selectedDate.getTime()});
    }

    function handleEndingDate(ev){

        ev.preventDefault();

        let endingDateErrors = [];

        let selectedDate = new Date(ev.target.value);

        if(selectedDate.getTime() < new Date(eventform.beginingDateMs)){
            endingDateErrors.push("Ending time can't be before starting time");
            setStyles({...styles, endingDateFieldStyle : {'borderColor': 'var(--warning-red)'}});
        }else{
            setStyles({...styles, endingDateFieldStyle : {'borderColor': 'var(--approved-green)'}});
        }
        
        setMaximumStartDate(getLocalizedIsoString(selectedDate.getTime()));

        setEventForm({...eventform, endDate : selectedDate.toISOString().substring(0,16), endDateErrors : endingDateErrors, isEventEdited: true, endDateMs: selectedDate.getTime()});
    }

    function createEvent(event){
        
        event.preventDefault();

        
        fetch(process.env.REACT_APP_API_URL+'/editEvent', {
            method: 'POST',
            body: JSON.stringify({
                _id : location.state._id,
                name : eventform.name,
                description : eventform.description,
                beginDate: eventform.beginingDateMs,
                endDate: eventform.endDateMs,
                calendarId: eventform.calendarId
            }),
            headers: {
                'Content-type': 'application/json',
                'username': localStorage.getItem("username"),
                'password': localStorage.getItem("password")
            },
        }).then((response) => {if(response.ok){return response.json()}else{throw new Error("Error creating event");}})
        .then((data) => {
            setNotification(<SuccessNotification message={data.value}/>);
            setTimeout(() => {
                setNotification(null);
                navigate(0);
            }, 3000);
        })
        .catch((err) => {
            console.log(err);
            setNotification(<WarningNotification message={err}/>);
            // setTimeout(() => {
            //     setNotification(null);
            //     navigate(0);
            // }, 3000);
        });



    }

    function getCalendars(){
        fetch(process.env.REACT_APP_API_URL+'/getCalendars/',{
            headers : {
                'username': localStorage.getItem("username"),
                'password': localStorage.getItem("password")
            }
        }).then((response) => response.json())
        .then((data) => {

            let calendarArray = [];

            data.value.forEach((element, index) => {calendarArray.push(<option key={index} className="option" value={element._id}>{element.calendarName}</option>)});
            setEventForm({...eventform, calendarId : data.value[0]._id});
            setCalendars(calendarArray);
        })
        .catch((err) => {
            console.log(err.value);
        });
    }

    function selectCalendar(ev){
        ev.preventDefault();


        setEventForm({...eventform, calendarId : ev.target.value, isEventEdited : true});

    }

    function openDeleteEventWindow(ev, eventId){
        ev.preventDefault();
        setModalWindow(<DeleteModalWindow message="Are you sure you want to delete this event?" deleteAction={()=>{deleteEvent()}} cancelAction={()=>{setModalWindow(null)}}/>)

    }

    function deleteEvent(){



        fetch(process.env.REACT_APP_API_URL+'/eventDelete/'+location.state._id, {
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
            
            setTimeout(() =>{ setNotification(null); navigate(0)}, 3500);

        })
        .catch((err) => {
            setNotification(<WarningNotification message="There was an error deleting!"/>);
            //setTimeout(() =>{setNotification(null)}, 5000);
            console.log("there was an error"+err);
        });

        setModalWindow(null);

    }


    return(
        <>

        {modalWindow}
        <div className="create-calendar-root">
            <form className="create-calendar-form" onSubmit={createEvent}>
                <h2>Edit event</h2>

                <label>
                    Name:
                    <input value={eventform?.name} type="text" name="name" 
                    maxLength={30} onChange={e => (handleNameChange(e))} style={styles.nameFieldStyle}/>
                    <div className="input-error">{eventform.nameErrors? eventform.nameErrors : null}</div>
                </label>

                <label>
                    Calendar:
                    <select value={eventform?.calendarId ? eventform?.calendarId : '' } className="select" onChange={ev => selectCalendar(ev)} style={{'borderColor': 'var(--approved-green)'}}>
                        {calendars}
                    </select>
                </label>

                <label>
                    Description:
                    <textarea value={eventform?.description} type="text" name="description" rows={4}
                    maxLength={200} onChange={e => handleDescriptionChange(e)} style={styles.descriptionFieldStyle}/>
                    <div className="input-error">{eventform.descriptionErrors}</div>
                </label>

                <div className="date-span-selection">

                    <label className="date-label">
                        Begining date
                        <input value={eventform?.beginingDate} type="datetime-local" className="date-input" onChange={ev => handleBeginingDateChange(ev)}  style={styles.beginingDateFieldStyle}/>
                        <div className="input-error">{eventform.beginingDateErrors}</div>
                    </label>

                    <label className="date-label">
                        End date
                        <input value={eventform?.endDate } type="datetime-local"  className="date-input"  onChange={ev => handleEndingDate(ev)} style={styles.endingDateFieldStyle}/>
                        <div className="input-error">{eventform.endDateErrors}</div>
                    </label>

                </div>


                <div style={{'display' : 'flex', 'gap': '1em', 'justifyContent': 'end'}}>



                    <input type="submit" value="Delete" className="submit-button" style={{'backgroundColor' : 'var(--warning-red)', 'borderColor': 'var(--warning-red)'}} onClick={(ev)=>{openDeleteEventWindow(ev, eventform.id)}} />


                    <input type="submit" value="Save changes" className="submit-button" style={{'marginLeft' : '0'}} disabled={eventform.nameErrors?.length > 0 || eventform.beginingDateErrors?.length > 0 || eventform.endDateErrors?.length > 0 || eventform.isEventEdited == false }/>

                </div>

            </form>
        </div>

        {notification}
        </>
    )
}

export default EventEdit;