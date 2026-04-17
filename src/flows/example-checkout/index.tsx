import { Routes, Route } from 'react-router-dom';
import Cart from './screens/Cart';
import Review from './screens/Review';
import Confirmation from './screens/Confirmation';

export default function ExampleCheckoutFlow() {
  return (
    <Routes>
      <Route index element={<Cart />} />
      <Route path="review" element={<Review />} />
      <Route path="confirmation" element={<Confirmation />} />
    </Routes>
  );
}
