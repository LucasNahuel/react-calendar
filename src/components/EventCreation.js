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
        nameFieldStyle : {'border-color': 'teal'},
        endingDateFieldStyle : {'border-color': 'teal'},
        descriptionFieldStyle : {'border-color': 'teal'},
        beginingDateFieldStyle : {'border-color': 'teal'}
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
            setStyles({...styles, nameFieldStyle : {'border-color': 'var(--warning-red)'}});
        }else{
            setStyles({...styles, nameFieldStyle : {'border-color': 'var(--approved-green)'}});
        }

        setEventForm({...eventform, name : ev.target.value, nameErrors : nameErrors});


    }

    function handleDescriptionChange(ev){
        setEventForm({...eventform, description : ev.target.value});

        if(ev.target.value.length > 0){
            setStyles({...styles, descriptionFieldStyle: {'border-color': 'var(--approved-green)'}});
        }else{
            setStyles({...styles, descriptionFieldStyle: {'border-color': 'teal'}});
        }
    }

    function handleBeginingDateChange(ev){

        let beginingDateErrors = [];

        let selectedDate = new Date(ev.target.value);

        if(eventform.endDate && selectedDate.getTime() > eventform.endDate){
            beginingDateErrors.push("Begining time can't be greater than ending time");
            setStyles({...styles, beginingDateFieldStyle: {'border-color': 'var(--warning-red)'}});
        }else{
            setStyles({...styles, beginingDateFieldStyle: {'border-color': 'var(--approved-green)'}});
        }

        setMinimumEndDate(selectedDate.toISOString().substring(0, 16));

        setEventForm({...eventform, beginingDate : selectedDate.getTime(), beginingDateErrors : beginingDateErrors});
    }

    function handleEndingDate(ev){

        let endingDateErrors = [];

        let selectedDate = new Date(ev.target.value);

        if(selectedDate.getTime() < eventform.beginingDate){
            endingDateErrors.push("Ending time can't be before starting time");
            setStyles({...styles, endingDateFieldStyle : {'border-color': 'var(--warning-red)'}});
        }else{
            setStyles({...styles, endingDateFieldStyle : {'border-color': 'var(--approved-green)'}});
        }
        
        setMaximumStartDate(selectedDate.toISOString().substring(0,16));

        setEventForm({...eventform, endDate : selectedDate.getTime(), endDateErrors : endingDateErrors});
    }

    function createEvent(event){
        
        
        fetch('http://localhost:4200/createEvent', {
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
        }).then((response) => {if(response.ok){return response.json()}else{throw new Error("Error creating event");}})
        .then((data) => {
            setNotification(<SuccessNotification message={data.value}/>);
        })
        .catch((err) => {
            setNotification(<WarningNotification message={err}/>);
        });

        setTimeout(() => {
            navigate(0);
            setNotification(null);
        }, 5000);


        event.preventDefault();
    }

    function getCalendars(){
        fetch('http://localhost:4200/getCalendars/',{
            headers : {
                'username': localStorage.getItem("username"),
                'password': localStorage.getItem("password")
            }
        }).then((response) => response.json())
        .then((data) => {

            let calendarArray = [];

            data.value.forEach(element => {calendarArray.push(<option className="option" value={element._id}>{element.calendarName}</option>)});
            setEventForm({...eventform, calendarId : data.value[0]._id});
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
            <form className="create-calendar-form" onSubmit={createEvent}>
                <h2>Create event</h2>

                <label>
                    Name:
                    <input type="text" name="name" 
                    maxLength={30} onChange={e => (handleNameChange(e))} style={styles.nameFieldStyle}/>
                    <div className="input-error">{eventform.nameErrors}</div>
                </label>

                <label>
                    Calendar:
                    <select className="select" onChange={ev => selectCalendar(ev)} style={{'border-color': 'var(--approved-green)'}}>
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