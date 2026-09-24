import Home from './pages/Home';
import Reservation from './pages/Reservation';
import Receipt from './pages/Receipt';
import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';

export const PAGES = {
  "Home": Home,
  "Reservation": Reservation,
  "Receipt": Receipt,
  "AdminLogin": AdminLogin,
  "Admin": Admin,
}

export const pagesConfig = {
  mainPage: "Home",
  Pages: PAGES,
};