import {useState} from "react";
import { useNavigate } from 'react-router'

function CalendarCreation(props){

    const navigate = useNavigate();

    const [calendarform, setCalendarForm] = useState({
        name: "",
        description: "",
        nameErrors: [" "],
        descriptionErrors: []
    });


    const [styles, setStyles] = useState({
        nameFieldStyle : {'border-color': 'teal'}
    });


    function handleNameChange(event){


        let newNameErrors = [];

        if(event.target.value.length == 0){
            newNameErrors.push("name is required");
        }else if(event.target.value.length < 3){
            newNameErrors.push("name should be at least 3 characters long");
        }


        if(newNameErrors.length > 0){
            setStyles({...styles, nameFieldStyle : {'border-color': 'var(--warning-red)'}});
        }else{
            setStyles({...styles, nameFieldStyle: {'border-color': 'var(--approved-green)'}})
        }

        return {...calendarform, name: event.target.value, nameErrors : newNameErrors };


    }

    function handleDescriptionChange(event){

        let newDescriptionErrors = [];

        return {...calendarform, description: event.target.value, descriptionErrors : newDescriptionErrors };
    }

    function createCalendar(event){

        fetch('http://localhost:4200/createCalendar', {
            method: 'POST',
            body: JSON.stringify({
                calendarName : calendarform.name,
                description : calendarform.description,
                timezone: null
            }),
            headers: {
                'Content-type': 'application/json',
                'username': localStorage.getItem("username"),
                'password': localStorage.getItem("password")
            },
        }).then((response) => response.json())
        .then((data) => {
            console.log(data);
            navigate(0)
        })
        .catch((err) => {
            console.log(err.value);
        });

        event.preventDefault();
    }

    return(
        <div className="create-calendar-root">
            <form className="create-calendar-form" onSubmit={createCalendar }>
                <h2>Create calendar</h2>

                <label>
                    Name:
                    <input type="text" name="name" 
                    maxLength={30} onChange={e => {setCalendarForm(handleNameChange(e));}} style={styles.nameFieldStyle}/>
                    <div className="input-error">{calendarform.nameErrors}</div>
                </label>

                <label>
                    Description:
                    <textarea type="text" name="description" rows={4}
                    maxLength={200} onChange={e => {setCalendarForm(handleDescriptionChange(e));}}/>
                    <div className="input-error">{calendarform.descriptionErrors}</div>
                </label>

                <input type="submit" value="Create Calendar" className="submit-button" disabled={calendarform.nameErrors.length > 0}/>
            </form>
        </div>
    )
}

export default CalendarCreation;