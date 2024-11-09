import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
  return (
    <div>
      <Header />
      <Outlet /> {/* Renders the nested routes like IndexPage, LoginPage, etc. */}
    </div>
  );
}
