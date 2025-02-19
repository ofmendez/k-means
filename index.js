const k = 3;
let pts  =0;
const pointsData = {};
let is4coords = false;
let coords = ['X', 'Y', 'Z']; 

const Set4Coords = () => {
	window.btn4Coord.disabled = true;
	if (is4coords) return;
	is4coords = true;
	const coord4 = document.querySelectorAll('.coord4');
	coord4.forEach((el) => el.style.display = 'inline');
	coords.push('M');
};


const AddPoint = () => {
	const point = document.createElement('div');
	point.innerHTML = `
      <span>${pts}: </span>
      <input type="number" id="pointX${pts}" value="0">
      <input type="number" id="pointY${pts}" value="0">
      <input type="number" id="pointZ${pts}" value="0">
      ${is4coords ? `<input type="number" id="pointM${pts}" value="0" >` : ''}
      <span class="res" id="classPt${pts}">..</span>
  `;
	window.points.appendChild(point);
	pts++;
};

const CalcToC = (p) => {
	const distances = [];
	const pCoords =[];
	for (let cr = 0; cr < coords.length; cr++) 
		pCoords.push(parseFloat(window[`point${coords[cr]}${p}`].value));
  
	for (let c = 0; c < k; c++) {
		const cCoords = [];
		for (let cr = 0; cr < coords.length; cr++)
			cCoords.push(parseFloat(window[`c${coords[cr]}${c}`].value));
		const distance = Math.sqrt(
			Math.pow(pCoords[0] - cCoords[0], 2) +
      Math.pow(pCoords[1] - cCoords[1], 2) +
      Math.pow(pCoords[2] - cCoords[2], 2) +
      (is4coords ? Math.pow(pCoords[3] - cCoords[3], 2) : 0)
		);
		distances.push(distance);
	}
	// get index of min distance
	const min = Math.min(...distances);
	const index = distances.indexOf(min);
	const classPt = window[`classPt${p}`];
	pointsData[p] = {class: index, distance: min }; //x: pX, y: pY, z: pZ
	pointsData[p][coords[0]] = pCoords[0];
	pointsData[p][coords[1]] = pCoords[1];
	pointsData[p][coords[2]] = pCoords[2];
	if (is4coords)
		pointsData[p][coords[3]] = pCoords[3];
	if (classPt) 
		classPt.innerHTML = `Class ${index} / D:  ${min.toFixed(4)}`;
};

const CalcAll = () => { 
	for (let p = 0; p < pts; p++) 
		CalcToC(p);
	CalcNewCentroids();
};

const CalcNewCentroids = () => {
	const newCentroids = {};
	for (let c = 0; c < k; c++) {
		const filter = Object.entries(pointsData).filter(([p,v])=> v.class === c);
		let accDistances = is4coords ? {X: 0, Y: 0, Z: 0, M: 0} : {X: 0, Y: 0, Z: 0};
		for( let pt of filter)
			for (let cr = 0; cr < coords.length; cr++) 
				accDistances[coords[cr]] += pt[1][coords[cr]];

		newCentroids[c] = {};
		
		if (filter.length === 0) 
			for( let cr = 0; cr < coords.length; cr++)
				newCentroids[c][coords[cr]] = parseFloat(window[`c${coords[cr]}${c}`].value);
		else
			for( let cr = 0; cr < coords.length; cr++)
				newCentroids[c][coords[cr]] = accDistances[coords[cr]] / filter.length;
	}
	ShowNewCentroids(newCentroids);
};

const ShowNewCentroids = (centroids) => {
	const container = window.newCents;
	container.innerHTML = ' <h3>New centroids:</h3> ';
	for (let c = 0; c < k; c++) {
		const centroid = document.createElement('div');
		centroid.innerHTML = `
      <span>C${c}:  (
        <span id="newCX${c}">${centroids[c].X.toFixed(4)} </span>,
        <span id="newCY${c}">${centroids[c].Y.toFixed(4)} </span>,
        <span id="newCZ${c}">${centroids[c].Z.toFixed(4)} </span>
        ${is4coords ? `, <span id="newCM${c}">${centroids[c].M.toFixed(4)} </span> )` : ')'}
      </span>
    `;
		container.appendChild(centroid);
		window.btnApply.disabled = false;
	}
};

const CopyCentroids = () => {
	for (let c = 0; c < k; c++) 
		for (let cr = 0; cr < coords.length; cr++) 
			window[`c${coords[cr]}${c}`].value = parseFloat(window[`newC${coords[cr]}${c}`].innerHTML);
};
