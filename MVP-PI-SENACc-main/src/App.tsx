import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from '@/hooks/useToast';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ClubsPage } from '@/pages/ClubsPage';
import { ClubDetailPage } from '@/pages/ClubDetailPage';
import { ClubCreatePage } from '@/pages/ClubCreatePage';
import { BooksPage } from '@/pages/BooksPage';
import { BookDetailPage } from '@/pages/BookDetailPage';
import { BookCreatePage } from '@/pages/BookCreatePage';
import { ReadingsPage } from '@/pages/ReadingsPage';
import { NewReadingPage } from '@/pages/NewReadingPage';
import { MeetingsPage } from '@/pages/MeetingsPage';
import { NewMeetingPage } from '@/pages/NewMeetingPage';
import { ReviewsPage } from '@/pages/ReviewsPage';
import { SuggestionsPage } from '@/pages/SuggestionsPage';
import { VotesPage } from '@/pages/VotesPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SettingsPage } from '@/pages/SettingsPage';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/clubs" element={<ClubsPage />} />
            <Route path="/clubs/new" element={<ClubCreatePage />} />
            <Route path="/clubs/:id" element={<ClubDetailPage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/books/new" element={<BookCreatePage />} />
            <Route path="/books/:id" element={<BookDetailPage />} />
            <Route path="/readings" element={<ReadingsPage />} />
            <Route path="/readings/new" element={<NewReadingPage />} />
            <Route path="/meetings" element={<MeetingsPage />} />
            <Route path="/meetings/new" element={<NewMeetingPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/suggestions" element={<SuggestionsPage />} />
            <Route path="/votes" element={<VotesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
