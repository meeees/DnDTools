import React, { Component, useState } from 'react';
import { hot } from 'react-hot-loader';
import './App.css';
import img from '@assets/test.jpg';

/*
class App extends Component{

  constructor(props) {
    super(props);
    this.state = {
      garbage: {
        count: 0
      }
    };
  }

  render(){

    const {garbage:g} = this.state;
    const {count:c} = g

    return(
      <div className='App'>
        <h1> Hello, World! {c} </h1>
        <img src={img}/>
        <button onClick = {() => this.setState({garbage: {count: c + 1}})}/>
      </div>
    );
  }
}*/

function AppComponent() {
  const [count, setCount] = useState(0);
  return (
    <div className='App'>
      <h1> Hello, World! {count} </h1>
      <img src={img} />
      <button onClick={() => setCount(count + 1)}>Button!</button>
    </div>
  );
}

export default hot(module)(AppComponent);
