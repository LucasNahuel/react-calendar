import {useState, useEffect} from "react";
import { useNavigate } from 'react-router';
import SuccessNotification from './SuccessNotification';
import WarningNotification from "./WarningNotification";

function EventCreation(props){

    const [eventform, setEventForm] = useState({
        name: "",
        description: "",
        nameErrors: [" "],
        beginingDate: null,
        beginingDateErrors: [" "],
        endDate: null,
        endDateErrors: [" "],
        calendarId: null
    });

    const [notification, setNotification] = useState(null);

    const [minimumEndDate, setMinimumEndDate] = useState(null);
    const [maximumStartDate, setMaximumStartDate] = useState(null);

    const [styles, setStyles] = useState({
        nameFieldStyle : {'borderColor': 'teal'},
        endingDateFieldStyle : {'borderColor': 'teal'},
        descriptionFieldStyle : {'borderColor': 'teal'},
        beginingDateFieldStyle : {'borderColor': 'teal'}
    });

    const [calendars, setCalendars] = useState([]);


    const navigate = useNavigate();


    useEffect(() => {  getCalendars() }, [calendars.length]);

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

        setEventForm({...eventform, name : ev.target.value, nameErrors : nameErrors});


    }

    function handleDescriptionChange(ev){
        setEventForm({...eventform, description : ev.target.value});

        if(ev.target.value.length > 0){
            setStyles({...styles, descriptionFieldStyle: {'borderColor': 'var(--approved-green)'}});
        }else{
            setStyles({...styles, descriptionFieldStyle: {'borderColor': 'teal'}});
        }
    }

    function handleBeginingDateChange(ev){

        let beginingDateErrors = [];

        let selectedDate = new Date(ev.target.value);

        if(eventform.endDate && selectedDate.getTime() > eventform.endDate){
            beginingDateErrors.push("Begining time can't be greater than ending time");
            setStyles({...styles, beginingDateFieldStyle: {'borderColor': 'var(--warning-red)'}});
        }else{
            setStyles({...styles, beginingDateFieldStyle: {'borderColor': 'var(--approved-green)'}});
        }

        let newMinimumDate = selectedDate.getFullYear()+"-"+selectedDate.getMonth()+"-"+selectedDate.getDay()+"T"+selectedDate.getHours()+":"+selectedDate.getMinutes();


        setMinimumEndDate(newMinimumDate);

        setEventForm({...eventform, beginingDate : selectedDate.getTime(), beginingDateErrors : beginingDateErrors});
    }

    function handleEndingDate(ev){

        let endingDateErrors = [];

        let selectedDate = new Date(ev.target.value);

        if(selectedDate.getTime() < eventform.beginingDate){
            endingDateErrors.push("Ending time can't be before starting time");
            setStyles({...styles, endingDateFieldStyle : {'borderColor': 'var(--warning-red)'}});
        }else{
            setStyles({...styles, endingDateFieldStyle : {'borderColor': 'var(--approved-green)'}});
        }

        let newMaximumDate = selectedDate.getFullYear()+"-"+selectedDate.getMonth()+"-"+selectedDate.getDay()+"T"+selectedDate.getHours()+":"+selectedDate.getMinutes();
        
        setMaximumStartDate(newMaximumDate);

        setEventForm({...eventform, endDate : selectedDate.getTime(), endDateErrors : endingDateErrors});
    }

    function createEvent(event){
        
        event.preventDefault();

        console.log(JSON.stringify({
            name : eventform.name,
            description : eventform.description,
            beginDate: eventform.beginingDate,
            endDate: eventform.endDate,
            calendarId: eventform.calendarId
        }));
        
        
        fetch(process.env.REACT_APP_API_URL+'/createEvent', {
            method: 'POST',
            body: JSON.stringify({
                name : eventform.name,
                description : eventform.description,
                beginDate: eventform.beginingDate,
                endDate: eventform.endDate,
                calendarId: eventform.calendarId
            }),
            headers: {
                'Content-type': 'application/json',
                'username': localStorage.getItem("username"),
                'password': localStorage.getItem("password")
            },
        }).then(async response => {
            const isJson = response.headers.get('content-type')?.includes('application/json');
            const data = isJson ? await response.json() : null;
    
            // check for error response
            if (!response.ok) {
                // get error message from body or default to response status
                const error = (data && data.value) || response.status;
                return Promise.reject(error);
            }
    
            setNotification(<SuccessNotification message={data.value}/>);
            setTimeout(() => {
                navigate(0);
                setNotification(null);
            }, 5000);
        })
        .catch(error => {
            setNotification(<WarningNotification message={error}/>);
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
            setEventForm({...eventform, calendarId : data.value[0]._id+""});
            setCalendars(calendarArray);
        })
        .catch((err) => {
            console.log(err.value);
        });
    }

    function selectCalendar(ev){

        setEventForm({...eventform, calendarId : ev.target.value});

    }


    return(
        <>
        <div className="create-calendar-root">
            <form className="create-calendar-form" onSubmit={(ev) => createEvent(ev)}>
                <h2>Create event</h2>

                <label>
                    Name:
                    <input type="text" name="name" 
                    maxLength={30} onChange={e => (handleNameChange(e))} style={styles.nameFieldStyle}/>
                    <div className="input-error">{eventform.nameErrors}</div>
                </label>

                <label>
                    Calendar:
                    <select className="select" onChange={ev => selectCalendar(ev)} style={{'borderColor': 'var(--approved-green)'}}>
                        {calendars}
                    </select>
                </label>

                <label>
                    Description:
                    <textarea type="text" name="description" rows={4}
                    maxLength={200} onChange={e => handleDescriptionChange(e)} style={styles.descriptionFieldStyle}/>
                    <div className="input-error">{eventform.descriptionErrors}</div>
                </label>

                <div className="date-span-selection">

                    <label className="date-label">
                        Begining date
                        <input type="datetime-local" className="date-input" onChange={ev => handleBeginingDateChange(ev)} max={maximumStartDate} style={styles.beginingDateFieldStyle}/>
                        <div className="input-error">{eventform.beginingDateErrors}</div>
                    </label>

                    <label className="date-label">
                        End date
                        <input type="datetime-local" min={minimumEndDate} className="date-input" onChange={ev => handleEndingDate(ev)} disabled={eventform.beginingDate === null} style={styles.endingDateFieldStyle}/>
                        <div className="input-error">{eventform.endDateErrors}</div>
                    </label>

                </div>

                <input type="submit" value="Create Event" className="submit-button" disabled={eventform.nameErrors.length > 0 || eventform.beginingDateErrors.length > 0 || eventform.endDateErrors.length > 0}/>
            </form>
        </div>
        {notification}
        </>
    )
}

export default EventCreation;