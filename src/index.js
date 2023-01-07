import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import Layout from './pages/Layout';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home'
import Register from './pages/Registration';
import Login from './pages/Login';
import {
  useLocation,
  useNavigate,
  useParams
} from "react-router-dom";
import CalendarCreation from './components/CalendarCreation';
import CalendarInspector from './components/CalendarInspector';
import EventCreation from './components/EventCreation'


const root = ReactDOM.createRoot(document.getElementById('root'));


function withRouter(Register) {
function RegisterWithRouterProp(props) {
  let location = useLocation();
  let navigate = useNavigate();
  let params = useParams();
  return (
  <Register
      {...props}
      router={{ location, navigate, params }}
  />
  );
}

return RegisterWithRouterProp;
}

const RegisterWithRouter = withRouter();


root.render(
  <React.StrictMode>

  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />}/>
          <Route path="home" element={<Home />}>
            <Route path="calendarcreation" element={<CalendarCreation />}/>
            <Route path="calendarinspector" element={<CalendarInspector />}/>
            <Route path="eventcreation" element={<EventCreation />}/>
          </Route>
          <Route path="register" element={<Register />}/>
          <Route path="login" element={<Login />}/>
        </Route>
      </Routes>
    </BrowserRouter>

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

