import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import store from './redux/store';
import MainLayout from './layout/MainLayout';
import UsersPage from './pages/UsersPage';
import PostsPage from './pages/PostsPage';
import TodosPage from './pages/TodosPage';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <CssBaseline />
        <MainLayout>
          <Routes>
            {/* Redirect root to users by default */}
            <Route path="/" element={<Navigate to="/users" replace />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/posts" element={<PostsPage />} />
            <Route path="/todos" element={<TodosPage />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </Provider>
  );
}