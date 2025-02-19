
const k = 3;
let pts  =0;

const AddPoint = () => {
  const point = document.createElement('div');
  point.innerHTML = `
      <span>${pts}: </span>
      <input type="number" id="pointX${pts}" value="0">
      <input type="number" id="pointY${pts}" value="0">
      <input type="number" id="pointZ${pts}" value="0">
      <span class="res" id="classPt${pts}">..</span>
  `;
  window.points.appendChild(point);
  pts++;
}



const CalcToC = (p) => {
  const distances = [];
  for (let c = 1; c <= k; c++) {
    const pX = parseFloat(window[`pointX${p}`].value);
    const pY = parseFloat(window[`pointY${p}`].value);
    const pZ = parseFloat(window[`pointZ${p}`].value);
    
    const cx = parseFloat(window[`cx${c}`].value);
    const cy = parseFloat(window[`cy${c}`].value);
    const cz = parseFloat(window[`cz${c}`].value);

    const distance = Math.sqrt(Math.pow(pX - cx, 2) + Math.pow(pY - cy, 2) + Math.pow(pZ - cz, 2));
    distances.push(distance);
  }
  // get index of min distance
  const min = Math.min(...distances);
  const index = distances.indexOf(min);
  const classPt = window[`classPt${p}`];
  if (classPt) 
    classPt.innerHTML = `Class ${index} - d:  ${min}`;
}

const CalcAll = () => { 
  for (let p = 0; p < pts; p++) 
    CalcToC(p);
}