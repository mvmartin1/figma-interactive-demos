import { Routes, Route } from 'react-router-dom';
import FlowsIndex from './ui/FlowsIndex/FlowsIndex';
import FlowLanding from './ui/FlowLanding/FlowLanding';
import FlowRunner from './ui/FlowRunner/FlowRunner';
import NotFound from './ui/NotFound/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<FlowsIndex />} />
      <Route path="/flows/:flowId" element={<FlowLanding />} />
      <Route path="/flows/:flowId/run/*" element={<FlowRunner />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
