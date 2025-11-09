
let table;
let colonne = []
let img;

//animazione
let currentIndex = 0;
let isPlaying;
let check1, check2, check3;
let side_container;
let visible = false;

function preload() {
 table = loadTable("assets/volcanoes.csv", "csv", "header");
 img = loadImage("assets/Gemini_Generated_Image_ayegg2ayegg2ayeg.png")
}

function setup() {
  for(i = 0; i < table.getColumnCount(); i++){
    colonne[i] = table.getColumn(i);
  }
   console.log(colonne)
  

   // Conversione da stringhe a numeri per determinate colonne 
   colonne[0] = colonne[0].map(v => float(v));
   colonne[4] = colonne[4].map(v => float(v));
   colonne[5] = colonne[5].map(v => float(v));
   colonne[6] = colonne[6].map(v => {
    if (v == null) return NaN;
    // converte in stringa e ripulisce caratteri strani
    let s = String(v).trim()
      .replace(/,/g, '.')        // virgole → punti
      .replace(/[^\d.\-eE+]/g, ''); // elimina tutto tranne numeri e segni
    return parseFloat(s);
  })
  .filter(v => !isNaN(v) && isFinite(v)); // rimuove i NaN

  //tutta questa sezione di codice è stata utilizzata per poter usare le assi z. 
  //nei numeri vi erano caratteri invisibili che non permettevano la conversione da stringhe a numero.
  //dopo tanti tentativi, questo è stato il metodo che, grazie all'IA, mi ha portato a risolvere la cosa.

  
console.log("anyNaN after cleaning:", colonne[6].some(v => isNaN(v)));
console.log("minZ:", Math.min(...colonne[6]));
console.log("maxZ:", Math.max(...colonne[6]));


//bottoni html per animazione 
check1 = select('#check1')
check2 = select('#check2')
check3 = select('#check3')
legenda = select('#menu')

check1.changed(() => updateAnimationState(check1));
check2.changed(() => updateAnimationState(check2));
check3.changed(() => updateAnimationState(check3));

side_container = select('#side_container')



new p5(sketch, 'world_map')
new p5(sketch1, 'side_container')
   
}

//funzione per cambiare l'opacità del div


function updateAnimationState(selectedCheck) {
  // Deseleziona gli altri checkbox
  if(selectedCheck === check1){
    check2.checked(false);
    check3.checked(false);
  } else if(selectedCheck === check2){
    check1.checked(false);
    check3.checked(false);
  } else if(selectedCheck === check3){
    check1.checked(false);
    check2.checked(false);
  }

  // Aggiorna lo stato isPlaying
  isPlaying = check1.checked() || check2.checked() || check3.checked();

  // Riparte da 0 ogni volta che selezioni un checkbox
  if(isPlaying) currentIndex = 0;
}

//Modalità istanza
let sketch = function(p){


  //Adattare le dimensioni del canva al contenitore div che lo contiene
  p.createContainerCanvas = function(container) {
  let w = container.width; 
  let h = container.height; 
  let canvas = p.createCanvas(w, h, p.WEBGL);
  canvas.parent(container);
  }
  

  

  p.setup = function(){
    let container = p.select('#world_map')
    p.createContainerCanvas(container)
    

    }
   
  

  p.draw = function(){
    p.clear()

    p.camera(
    0, p.height + 400, 450); //mi permette di controllare la vista basandomi su x, y e z

    p.orbitControl()
    if (isPlaying && currentIndex < colonne[4].length) {
      currentIndex += 10;
    }
    p.push()
    for(let i = 0; i < colonne[4].length; i++){
      if(i < currentIndex){
      let x = p.map(colonne[5][i], p.min(...colonne[5]), p.max(...colonne[5]), -p.width / 2 + 5, p.width/2 - 5);
      let y = p.map(colonne[4][i], p.min(...colonne[4]), p.max(...colonne[4]), p.height/ 2 - 5, -p.height/2 + 5);
      let z = p.map(colonne[6][i], p.min(...colonne[6]), p.max(...colonne[6]), -200, 200);
      
         p.push();
         p.translate(x, y, z / 2); 
         p.noStroke()
         if(check2.checked() && z < 0 || (check3.checked() && z < 0)){
          p.push()
          p.fill("#273cf56c")
          p.box(2, 2, z);
          p.pop()
         } 
         if(check1.checked() && z > 0 || (check3.checked() && z > 0)){
          p.push()
          p.fill("#f5492773")
          p.box(2, 2, z);
          p.pop()
         }

   
      }
                   
         p.pop();


         //console.log(i, colonne[6][i], z)

         

    }
    
  p.pop()

  // Piano di base
    p.push();
    p.fill(80, 80, 80, 80);
    p.texture(img)
    p.noStroke()
    p.plane(p.width, p.height);
    p.pop();
    
  }
}

let sketch1 = function(p){

  p.createContainerCanvas = function(container) {
  let w = container.width; 
  let h = container.height; 
  let canvas = p.createCanvas(w, h);
  canvas.parent(container);
  }

  p.setup = function(){
    let container = p.select('#side_container')
    p.createContainerCanvas(container)
  }

  p.draw = function(){

    p.push()
    p.stroke("#ABABAB")
    p.line(10, p.height / 2, p.width - 10, p.height / 2);
    p.push()
    p.noStroke()
    p.fill("#757575ff")
    p.text("Sea Level", p.width - 80, p.height/ 2 - 10);
    p.text("Elevation > 0", 60, 40 )
    p.text("Elevation < 0", 100, p.height - 40 )
    p.pop()
    p.pop()

    p.push()
    p.noStroke()
    p.fill("#f5492773")
    p.rect(40, 20, 10, p.height / 2 - 20)
    p.pop()

    p.push()
    p.noStroke()
    p.fill("#273cf56c")
    p.rect(80, p.height / 2, 10, p.height / 2 - 20)
    p.pop()
  }
}
