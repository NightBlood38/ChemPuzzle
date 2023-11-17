//minden kötésnél eltárolom azt a 2 objektumot, ami között létrejött a kötés, stringet csinálok belőlük, és egy tömbbe teszem
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const start = document.getElementById("start");
const timerElement = document.getElementById("timer");
const addCarbon = document.getElementById("addCarbon");
const addHydrogen = document.getElementById("addHydrogen");
const addOxygen = document.getElementById("addOxygen")
const listOfMolecules = document.getElementById("listOfMolecules");
const listElements = [document.getElementById("1"),document.getElementById("2"),document.getElementById("3"),document.getElementById("4"),document.getElementById("5")];
const won = document.getElementById("won");

const metan = {
    name:"metán",
    ch:4,
    oh:0,
    oc:0,
    cc:0
};
const etan = {
    name:"etán",
    ch:6,
    oh:0,
    oc:0,
    cc:1
};
const propan = {
    name:"propán",
    ch:8,
    oh:0,
    oc:0,
    cc:2
};
const butan = {
    name:"bután",
    ch:10,
    oh:0,
    oc:0,
    cc:3
};
const pentan = {
    name:"pentán",
    ch:12,
    oh:0,
    oc:0,
    cc:4
};
const hexan = {
    name:"hexán",
    ch:14,
    oh:0,
    oc:0,
    cc:5
};
const heptan = {
    name:"heptán",
    ch:16,
    oh:0,
    oc:0,
    cc:6
};
const octan = {
    name:"oktán",
    ch:18,
    oh:0,
    oc:0,
    cc:7
};
const nonan = {
    name:"nonán",
    ch:20,
    oh:0,
    oc:0,
    cc:8
};
const decan = {
    name:"dekán",
    ch:22,
    oh:0,
    oc:0,
    cc:9
};
const metanol = {
    name:"metanol",
    ch:3,
    oh:1,
    oc:1,
    cc:0
};
const etanol = {
    name:"etanol",
    ch:5,
    oh:1,
    oc:1,
    cc:1
};
const propanol = {
    name:"propanol",
    ch:7,
    oh:1,
    oc:1,
    cc:2
};
const dimetil_eter = {
    name:"dimetil-\néter",
    ch:6,
    oh:0,
    oc:2,
    cc:0
};
const dietil_eter = {
    name:"dietil-\néter",
    ch:10,
    oh:0,
    oc:2,
    cc:2
};

const molecules = [metan,etan,butan,propan,pentan,hexan,heptan,octan,nonan,decan,metanol,etanol,propanol,dimetil_eter,dietil_eter];
let minutes = 0;
let seconds = 0;
let totalTime = 0;
let timerInterval = 0;
let ccAmount = 0;
let ocAmount = 0;
let ohAmount = 0;
let chAmount = 0;
const randomMoleculesArr = [];
let checklist = [];
let bonds = [];
let isGameRunning = false;

let objectArr = [];
class Electron {
    constructor(offsetX, offsetY) {
        this.x = offsetX;
        this.y = offsetY;
        this.isBound = false;
        this.dotSpacing = 10;
        this.dotRadius = 2;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }
    bind() {
        this.isBound = true;
    }
    unBind(){
        this.isBound = false;
    }

    isElectronBound() {
        return this.isBound;
    }
    drawElectron(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.dotRadius, 0, Math.PI * 2);
        ctx.fill();
    }
    updatePosition(atomX, atomY) {
        this.x = atomX + this.offsetX;
        this.y = atomY + this.offsetY;
    }
}

class Atom{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.font = "30px Arial";
        this.freeElectronCount = 0;
        this.maxElectronCount = 0;
        this.dotSpacing = 10;
        this.dotRadius = 2;
        this.hasItBeenDragged = false;
    }
    calculateDistanceH(atom){
        return Math.sqrt((atom.electrons[0].x - this.electrons[1].x) ** 2 + (atom.electrons[0].y - this.electrons[1].y) ** 2);
        
    }
    calculateDistanceV(atom){
        return Math.sqrt((atom.electrons[2].x - this.electrons[3].x) ** 2 + (atom.electrons[2].y - this.electrons[3].y) ** 2);
    }
    getFreeElectronCount() {
        return this.freeElectronCount;
    }
    subElectron(){
        if(this.freeElectronCount > 0){
            this.freeElectronCount -= 1;
        }
    }
    addElectron(){
        if(this.freeElectronCount < this.maxElectronCount){
            this.freeElectronCount += 1;
        }
       
    }
    updatePosition(x, y) {
        //atom pozíció számolás
        const deltaX = x - this.x;
        const deltaY = y - this.y;

        this.x += deltaX;
        this.y += deltaY;

        // elektron pozíció frissítés
        this.electrons.forEach(electron => {
            electron.updatePosition(this.x, this.y);
        });

        draw();
    }
    
    
    draw() {
        ctx.font = this.font;
        ctx.fillStyle = this.color;
    
        ctx.fillText(this.text, this.x, this.y);
    }
}

class Carbon extends Atom {
    constructor(x, y) {
        super(x, y);
        this.text = "C";
        this.maxElectronCount = 4;
        this.freeElectronCount = this.maxElectronCount;
        this.color = "black";
        this.width = ctx.measureText(this.text).width;
        this.bonds = []
        this.electrons = [
            new Electron(this.x-510, this.y-260),  // bal elektron
            new Electron(this.x-470, this.y-260), // jobb elektron
            new Electron(this.x-490, this.y-240),  // felső elektron
            new Electron(this.x-490, this.y-280)  // alsó elektron
        ];
    }

    draw() {
        ctx.font = this.font;
        ctx.fillStyle = this.color;
        
        //elektron pozíció frissítés
        for (const electron of this.electrons) {
            electron.updatePosition(this.x, this.y);
            electron.drawElectron();
        }
    
        // vegyjel rajzolás
        ctx.fillText(this.text, this.x, this.y);
    
        // kötések rajzolása
        for (const atom of objectArr) {
            if (atom !== this) {
                const distance1 = Math.sqrt((atom.electrons[0].x - this.electrons[1].x) ** 2 + (atom.electrons[0].y - this.electrons[1].y) ** 2);
                const distance2 = Math.sqrt((atom.electrons[2].x - this.electrons[3].x) ** 2 + (atom.electrons[2].y - this.electrons[3].y) ** 2);
    
                // Kötések jelölése
                if (distance1 < 30) {
                    ctx.beginPath();
                    ctx.moveTo(this.electrons[1].x, this.electrons[1].y);
                    ctx.lineTo(atom.electrons[0].x, atom.electrons[0].y);
                    ctx.strokeStyle = "black";
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    this.electrons[1].bind();
                    atom.electrons[0].bind();
                } else if (distance2 < 30) {
                    ctx.beginPath();
                    ctx.moveTo(this.electrons[3].x, this.electrons[3].y);
                    ctx.lineTo(atom.electrons[2].x, atom.electrons[2].y);
                    ctx.strokeStyle = "black";
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    this.electrons[3].bind();
                    atom.electrons[2].bind();
                }else if(distance1 > 30){
                    this.electrons[1].unBind();
                    atom.electrons[0].unBind();
                }else if(distance2 > 30){
                    this.electrons[3].unBind();
                    atom.electrons[2].unBind();
                }
            }
        }
    } 
}

class Hydrogen extends Atom {
    constructor(x, y) {
        super(x, y);
        this.text = "H";
        this.maxElectronCount = 1;
        this.freeElectronCount = this.maxElectronCount;
        this.color = "white";
        this.borderColor = "black"
        this.width = ctx.measureText(this.text).width;
        this.electrons = [
            new Electron(this.x-500, this.y-260),  // bal elektron
            new Electron(this.x-480, this.y-260), // jobb elektron
            new Electron(this.x-490, this.y-250),  // felső elektron
            new Electron(this.x-490, this.y-270)  // alsó elektron
        ];
    }

    draw() {
        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.borderColor;

        //elektron pozíció frissítés
        for (const electron of this.electrons) {
            electron.updatePosition(this.x, this.y);
        }
    
        // vegyjel rajzolás
        ctx.fillText(this.text, this.x, this.y);
        ctx.strokeText(this.text, this.x, this.y);
        
        // kötés rajzolás
        for (const atom of objectArr) {
            if (atom !== this) {
                const distance1 = this.calculateDistanceH(atom);
                const distance2 = this.calculateDistanceV(atom);
    
                // Kötések jelölése
                if (distance1 < 30 && atom.text != "H") {
                    ctx.beginPath();
                    ctx.moveTo(this.electrons[1].x, this.electrons[1].y);
                    ctx.lineTo(atom.electrons[0].x, atom.electrons[0].y);
                    ctx.strokeStyle = "black";
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    this.electrons[0].bind()
                } else if (distance2 < 30 && atom.text != "H") {
                    ctx.beginPath();
                    ctx.moveTo(this.electrons[3].x, this.electrons[3].y);
                    ctx.lineTo(atom.electrons[2].x, atom.electrons[2].y);
                    ctx.strokeStyle = "black";
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    this.electrons[2].bind();
                }else if(distance1 > 30){
                    this.electrons[0].unBind();
                }else if(distance2 > 30){
                    this.electrons[2].unBind();
                }
            }
            
        }
    } 
}

class Oxygen extends Atom {
    constructor(x, y) {
        super(x, y);
        this.text = "O";
        this.maxElectronCount = 2;
        this.freeElectronCount = this.maxElectronCount;
        this.color = "red";
        this.width = ctx.measureText(this.text).width;
        this.electrons = [
            new Electron(this.x-510, this.y-260),  // bal elektron
            new Electron(this.x-470, this.y-260), // jobb elektron
            new Electron(this.x-490, this.y-200000),  // felső elektron ami nem létezik
            new Electron(this.x-490, this.y-200000)  // alsó elektron ami nem létezik
        ];
    }

    draw() {
        ctx.font = this.font;
        ctx.fillStyle = this.color;
        
        //elektron pozíció frissítés
        for (const electron of this.electrons) {
            electron.updatePosition(this.x, this.y);
            electron.drawElectron();
        }
    
        // vegyjel rajzolás
        ctx.fillText(this.text, this.x, this.y);
    
        // kötés rajzolás
        for (const atom of objectArr) {
            if (atom !== this) {
                const distance1 = Math.sqrt((atom.electrons[0].x - this.electrons[1].x) ** 2 + (atom.electrons[0].y - this.electrons[1].y) ** 2);
    
                // Kötések jelölése
                if (distance1 < 30) {
                    ctx.beginPath();
                    ctx.moveTo(this.electrons[1].x, this.electrons[1].y);
                    ctx.lineTo(atom.electrons[0].x, atom.electrons[0].y);
                    ctx.strokeStyle = "black";
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    this.electrons[1].bind()
                }else{
                    this.electrons[1].unBind();
                }
            }
        }
    } 
}

//random indexek generálása
function getRandomIndices(arr, count) {
    const shuffled = arr.slice();
    let i = arr.length;
    const min = i - count;
    while (i-- > min) {
        const index = Math.floor((i + 1) * Math.random());
        const temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}

//random molekulák kiválasztása majd beillesztése a li elemekbe
const randomIndices = getRandomIndices(molecules, 5);

function randomMolecules() {
    randomIndices.forEach((index, i) => {
        listOfMolecules.children[i].innerText = randomIndices[i].name;
        randomMoleculesArr.push(randomIndices[i])
    });
    checklist = randomMoleculesArr;
}

//timer
function updateTime() {
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer(){
    clearInterval(timerInterval);
    timerInterval = setInterval(function (){
        totalTime++;
        minutes = Math.floor(totalTime/60);
        seconds = totalTime % 60;
        updateTime();
    }, 1000);
}

function stopTimer(){
    clearInterval(timerInterval);
    const totalMinutes = minutes;
    const totalSeconds = seconds;
    timerElement.textContent = `${totalMinutes.toString().padStart(2, '0')}:${totalSeconds.toString().padStart(2, '0')}`;
}

function resetTimer(){
    clearInterval(timerInterval);
    minutes = 0;
    seconds = 0;
    totalTime = 0;
    updateTime();
}

let isDragging = false;
let initialMouseX, initialMouseY;
let offsetX = 0, offsetY = 0;

//gombok engedélyezése
function enableUI(){
    addCarbon.style.display = "block";
    addHydrogen.style.display = "block";
    timerElement.style.display = "block";
    listOfMolecules.style.display = "block";
    addOxygen.style.display = "block";
    drawX();
}
//"kuka" megrajzolása
function drawX(){

      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(950, 450);
      ctx.lineTo(950 + 48, 450 + 48);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(998, 450);
      ctx.lineTo(998-48, 450 + 48);
      ctx.stroke();
}

//megfogás
canvas.addEventListener("mousedown", (e) => {
    const mouseX = e.clientX - canvas.getBoundingClientRect().left;
    const mouseY = e.clientY - canvas.getBoundingClientRect().top;

    objectArr.forEach((object) => {
        object.width = ctx.measureText(object.text).width;

        if (
            mouseX >= object.x &&
            mouseX <= object.x + object.width &&
            mouseY >= object.y - parseInt(object.font, 10) &&
            mouseY <= object.y
        ) {
            isDragging = true;
            draggedObject = object;
            initialMouseX = mouseX;
            initialMouseY = mouseY;
            offsetX = mouseX - object.x;
            offsetY = mouseY - object.y;
        }
    });
});
//mozgatás
canvas.addEventListener("mousemove", (e) => {
    if (isDragging) {
        const mouseX = e.clientX - canvas.getBoundingClientRect().left;
        const mouseY = e.clientY - canvas.getBoundingClientRect().top;
        draggedObject.x = mouseX - offsetX;
        draggedObject.y = mouseY - offsetY;
        draggedObject.hasItBeenDragged = true;
        for (const electron of draggedObject.electrons) {

            //relatív elektron pozíció
            const relativeX = electron.x - draggedObject.x;
            const relativeY = electron.y - draggedObject.y;

            electron.updatePosition(draggedObject.x, draggedObject.y);
        }
        checkBonds();
        draw();
    }
});
//elengedés
canvas.addEventListener("mouseup", (e) => {
    
    objectArr.forEach((object) => {
        if(object.x > 920 && object.y > 450){
            deleteAtom(object);
        }
    });

    checkBonds();
    isDragging = false;
    checkMolecule();
});
//játék elindítása
function startGame(){
    start.style.display = "none";
    startTimer();
    randomMolecules();
    enableUI();
    isGameRunning = true;
}
function checkBonds() {
    bonds = [];

    for (const atom1 of objectArr) {
        for (const atom2 of objectArr) {
            const distance1 = atom2.calculateDistanceH(atom1);
            const distance2 = atom2.calculateDistanceV(atom1);

            if (atom1 !== atom2 && (distance1 < 30 || distance2 < 30) && atom1.hasItBeenDragged && atom2.hasItBeenDragged) {
                if (distance1 < 30) {
                    const bondInfo = atom1.text + atom2.text;
                    bonds.push(bondInfo);
                } else if (distance2 < 30) {
                    const bondInfo = atom1.text + atom2.text;
                    bonds.push(bondInfo);
                }
            }
        }
    }
}
//gombok
start.addEventListener("click", () => {
    startGame();
});

addCarbon.addEventListener("click", () => {
    const carbon = new Carbon(500,250);
    objectArr.push(carbon);
    draw();
});

addHydrogen.addEventListener("click", () => {
    const hydrogen = new Hydrogen(500,250);
    objectArr.push(hydrogen);
    draw();
});
addOxygen.addEventListener("click", () => {
    const oxygen = new Oxygen(500,250);
    objectArr.push(oxygen);
    draw();
});

function deleteAtom(atom){
    objectArr = objectArr.filter(obj => obj !== atom);
    draw();
}

//felrajzolás
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //Összes elem rajzolása
    objectArr.forEach((object) => {
        object.draw();
    });
    drawX();
}
//játék befejezése
function isComplete(){
    if(checklist.length == 0 && isGameRunning){
        disableUI();
        stopTimer();
        won.style.display = "block";
    }
}
//UI eltűntetése
function disableUI(){
    addCarbon.style.display = "none";
    addHydrogen.style.display = "none";
    listOfMolecules.style.display = "none";
    addOxygen.style.display = "none";
}
//molekula ellenőrzése
function checkMolecule(){
    chAmount = 0;
    ccAmount = 0;
    ohAmount = 0;
    ocAmount = 0;
    bonds.forEach(bond => {
        if(bond =="CH"|| bond == "HC"){
            chAmount++;
        }else if(bond =="CC"){
            ccAmount++;
        }else if(bond =="OH"|| bond == "HO"){
            ohAmount++;
        }else if(bond =="OC"|| bond == "CO"){
            ocAmount++;
        }
    });

    randomMoleculesArr.forEach((object) => {
        if(object.ch == chAmount && object.cc == ccAmount && object.oc == ocAmount && object.oh == ohAmount){
            listElements[randomMoleculesArr.indexOf(object)].style.textDecoration = "line-through";
            listElements[randomMoleculesArr.indexOf(object)].style.textDecorationThickness= "3px";
            listElements[randomMoleculesArr.indexOf(object)].style.textDecorationColor = "red";
            chAmount = 0;
            ccAmount = 0;
            ohAmount = 0;
            ocAmount = 0;
            bonds = [];
            checklist = checklist.filter(item => item !== object);
            objectArr.forEach((object) => {
                deleteAtom(object);
            })
            draw();
        }
    });
    isComplete();
}