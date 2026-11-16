import { Route, Routes } from 'react-router-dom';
import Header from './components/Header.jsx';
import { PrivateRoute, GuestRoute } from './components/RouteGuards.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { Home, Catalog, EntryDetails, UserProfile, MyDiary, CreateEntry, EditEntry, NotFound } from './pages/Pages.jsx';
import { Login, Register } from './pages/AuthPages.jsx';

export default function App() {
  return <AuthProvider>
    <Header />
    <main className="container main-content">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/entries/:id" element={<EntryDetails />} />
        <Route path="/users/:userId" element={<UserProfile />} />
        <Route element={<PrivateRoute />}>
          <Route path="/entries/create" element={<CreateEntry />} />
          <Route path="/entries/:id/edit" element={<EditEntry />} />
          <Route path="/my-diary" element={<MyDiary />} />
        </Route>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  </AuthProvider>;
}
