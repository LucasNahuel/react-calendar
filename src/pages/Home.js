import React, { createContext, useEffect, useState } from "react";
import {Outlet, useNavigate} from "react-router-dom";
import Sidebar from "../components/Sidebar"
import CalendarCreation from "../components/CalendarCreation"

export const CurrentCalendarsContext = createContext(null);

function Home(props){

    const [currentCalendars, setCurrectCalendars] = useState([]);

    const navigate = useNavigate();
    const [showContent, setShowContent] = useState(null);

    useEffect(
        function checkUsernameSaved(){

            let username = localStorage.getItem("username");
    
            if(!username){
                navigate("/login");
            }else{
                navigate("/home/calendarinspector");
            }
        }, []
    )

    function navigateTo(element){


        navigate(element);
    }



    

    return(
        <div className="home-root">

            <CurrentCalendarsContext.Provider value={{
                currentCalendars,
                setCurrectCalendars
            }}>
                
                <Sidebar context={CurrentCalendarsContext} navigateTo={(element) => navigateTo(element)}/>
                <div className="home-main-content">

                    <Outlet context={CurrentCalendarsContext}/>

                </div>
            </CurrentCalendarsContext.Provider>
            
        </div> 
    )
}




export default Home;