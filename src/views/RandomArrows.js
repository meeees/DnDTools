import React, {useState, Fragment} from 'react';

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}


const data_str = 'regular,broken,regular,broken,regular,broken,regular,broken,regular,broken,regular,broken,regular,broken,regular,broken,regular,broken,regular,broken,regular,broken,regular,broken,regular,regular,regular,regular,regular,regular,regular,regular,regular,regular,regular,regular,regular,regular,regular,regular,regular,regular,regular,regular,regular,regular,regular,regular,regular,regular,radiant(average),radiant self hurt,radiant(large),radiant(small),radiant(massive),electricity(small),electricity(massive),electricity self hurt,electricity(average),electric(small),lvl 2 magic missle,fireball,charm,dominate person,lvl 4 sleep,acid(large),acid(small),acid self hurt,acid(massive),acid(average),fire(small),fire(massive),fire(large),fire(average),fire self hurt,self hurt fireball,self hurt acid arrow,self hurt lvl 5 sleep,self hurt lvl 3 magic missle,self hurt hold person,boomerang,large boomerang,shrapnel,large shrapnel,self hurt shrapnel,cold(large),cold(average),cold(small),cold(massive),cold self hurt,necrotic self hurt,necrotic(massive),necrotic(large),necrotic(small),necrotic(average),force(small),force(large),force(average),force self hurt,force(massive)';
const data = data_str.split(',');
shuffleArray(data);

function RandomBolt() {
  const [index, setIndex] = useState(0);
  var [lastBolts, setLastBolts] = useState([]);

  return (
    <center>
      <br/>
      <div style={{width: '30rem', height: '10rem', justifyContent: 'center', verticalAlign: 'center'}}>
        <h1>{data[index]}</h1>
        <br/>
        <button onClick={() => {
          var toSet = lastBolts;
          toSet.unshift(data[index]);
          if(toSet.length > 10) {
            toSet.pop();
          }
          console.log(toSet);
          setLastBolts(toSet);
          if(index + 1 >= data.length) {
            shuffleArray(data);
            setIndex(0);
          }
          else {
            setIndex(index + 1);
          }
        }}><h2>Press Me!</h2></button>
      </div>
      <div>
        <b>Last 10 bolts:</b> {lastBolts.map((b, i) => <Fragment key={i}><br/>{b}</Fragment>)}
      </div></center>);

}

export default RandomBolt;









