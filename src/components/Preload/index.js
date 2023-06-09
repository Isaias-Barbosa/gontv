import React from 'react'
import Skeleton from 'react-loading-skeleton';
import './Preload.css';

export default function Preload() {

  return (
    <div className="preload">
    <Skeleton height={400} width={400} />
  </div>
  )
}
