import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import { EditPostPage, HomePage, NewPostPage, ViewPostPage } from "./Pages";

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" end element={<HomePage />} />
          <Route path="/posts/new" end element={<NewPostPage />} />
          <Route path="/posts/:id" end element={<ViewPostPage />} />
          <Route path="/edit/:id" end element={<EditPostPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};
