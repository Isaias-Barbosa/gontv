import React from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Tables from './components/Tables';

export default function Admin({ username }) {
  return (
    <div className="">
      <Navbar />
      <div className="flex justify-center">
        <Sidebar username={username} />
        <div className="">
          <Tables />
        </div>
      </div>
    </div>
  );
}
