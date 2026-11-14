import { Route, Routes } from 'react-router-dom';
import Header from './components/Header.jsx';
import { Home, Catalog, EntryDetails, UserProfile, MyDiary, CreateEntry, EditEntry, Login, Register, NotFound } from './pages/Pages.jsx';

export default function App() {
  return <>
    <Header />
    <main className="container main-content">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/entries/create" element={<CreateEntry />} />
        <Route path="/entries/:id" element={<EntryDetails />} />
        <Route path="/entries/:id/edit" element={<EditEntry />} />
        <Route path="/users/:userId" element={<UserProfile />} />
        <Route path="/my-diary" element={<MyDiary />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  </>;
}
