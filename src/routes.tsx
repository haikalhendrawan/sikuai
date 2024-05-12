import {Routes, Route} from "react-router-dom";
import EventListPage from "./pages/EventListPage";
import AttendancePage from "./pages/AttendancePage";
import HomePage from "./pages/HomePage";
import AttendanceReport from "./sections/PDF/AttendanceReport";


export default function Router(){
  return (
    <Routes>
      <Route path="/">
        <Route index element={<HomePage/>}/>
        <Route path="/attForm" element={<AttendancePage/>} />
        <Route path="/events" element={<EventListPage />} />
      </Route>
    </Routes>
  )
}
