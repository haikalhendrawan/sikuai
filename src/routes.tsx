import {Routes, Route} from "react-router-dom";
import HorizontalLayout from "./layouts/Horizontal/HorizontalLayout";
import EventListPage from "./pages/EventListPage";
import AttFormPage from "./pages/AttFormPage";
import AttPreviewPage from "./pages/AttPreviewPage";
import EmployeePage from "./pages/EmployeePage";
import HomePage from "./pages/HomePage";
import UploadDataPage from "./pages/UploadDataPage";
import GeneratorPage from "./pages/GeneratorPage";


export default function Router(){
  return (
    <Routes>
      <Route path="/" element={<HorizontalLayout />}>
        <Route index element={<HomePage/>}/>
        <Route path="events" element={<EventListPage />} />
        <Route path="employee" element={<EmployeePage />} />
        <Route path="inject" element={<UploadDataPage />} />
        <Route path="generator" element={<GeneratorPage />} />
      </Route>

      <Route path="/attForm" element={<AttFormPage/>} />
      <Route path="/preview">
        <Route path=":id" element={<AttPreviewPage />} />
      </Route>
    </Routes>
  )
}
