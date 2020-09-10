import React, { useState } from 'react';
import img from '@assets/test.jpg';

function HomePageComponent() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1> Hello, World! {count} </h1>
      <img src={img} />
      <button onClick={() => setCount(count + 1)}>Button!</button>
    </div>);
}

export default HomePageComponent;