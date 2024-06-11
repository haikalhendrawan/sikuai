import {Routes, Route} from "react-router-dom";
import EventListPage from "./pages/EventListPage";
import AttFormPage from "./pages/AttFormPage";
import AttPreviewPage from "./pages/AttPreviewPage";
import EmployeePage from "./pages/EmployeePage";
import HomePage from "./pages/HomePage";
import UploadDataPage from "./pages/UploadDataPage";


export default function Router(){
  return (
    <Routes>
      <Route path="/">
        <Route index element={<HomePage/>}/>
        <Route path="attForm" element={<AttFormPage/>} />
        <Route path="events" element={<EventListPage />} />
        <Route path="employee" element={<EmployeePage />} />
        <Route path="inject" element={<UploadDataPage />} />
        <Route path="preview">
          <Route path=":id" element={<AttPreviewPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
