const startWave = 0;
let activeWave = startWave;
let difficultyFactor = 1;
let increaseFactor = 0.02;
let menuDisallowed = false;

let wave = [];

function generateWave(){
    increaseDifficulty();
    const moveSpeed = randomBetween(40, 70, false) * difficultyFactor;
    console.log(moveSpeed);
    const bulletSpeed = Math.min(500, randomBetween(50, 80, true) * difficultyFactor);
    const bulletPower = 1;

    let rows = [];

    const rowCount = Math.min(4, randomBetween(1, 3, true) * Math.floor(difficultyFactor));

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {            
        const hCount = randomBetween(6, 10, true);
        const vCount = Math.min(3, Math.max(1, (randomBetween(2, 4, true) * Math.floor(difficultyFactor)) - rowCount));
        const width = randomBetween(20, 60, true);
        const height = randomBetween(15, 35, true);
        const strength = randomBetween(1, 2, false) * difficultyFactor;
        const color = `rgb(${randomBetween(50, 205, true)}, ${randomBetween(50, 205, true)}, ${randomBetween(50, 205, true)})`;
        
        rows.push({hCount: hCount, vCount: vCount, width: width, height: height, strength: strength, color: color});
    }
    wave.push({moveSpeed: moveSpeed, bulletSpeed: bulletSpeed, bulletPower: bulletPower, rows: rows}); 
}
function randomBetween(min, max, whole){
    let rnd;
    if (whole) {
        rnd = Math.floor(Math.random() * (max - min + 1) + min);
    } else {
        rnd = Math.random() * (max - min + 1) + min;
    }
    return rnd;
}
function increaseDifficulty(){
    difficultyFactor = increaseFactor * activeWave + 1;
    // difficultyFactor += increaseFactor;
}
function resetActiveWave(){
    wave = [];
    activeWave = startWave;
}
