
"use strict"
let idnumber= 0; // as number then i string it and add format as max 3 leading zeros

const dayjs = require('dayjs');

//!let now = dayjs()
//!console.log(now.format())



function Film(title,favourite,date,rating) {

    this.id = idnumber++;
    this.title=title;
    this.favourite = favourite;
    this.date= date;
    this.rating=rating;

    this.toString=()=>{
            console.log(this.title+' '+this.date+' '+this.rating+' ');
            
        }
    }


function FilmLibrary() {
    this.films=[];

    this.addNewFilm= function(obj){

        if (( obj === undefined)) {
            console.log("in order to add a film to a library you need to specify a valid film object ")
        }
        else {
          this.films.push(obj);
        }

    }

   
this.sortByDate= function() {

    const temp= [...this.films];
    temp.sort(function(a, b) {
      if (!a.date && !b.date) {
        // se non hanno la data lasciali fermi
        return 0;
      } else if (!a.date) {
        // se a non ha la data spostalo in basso 
        return 1;
      } else if (!b.date) {
        // se b non ha la data spostalo in basso 
        return -1;
      } else {
        // ordinamento ascendente
        return a.date.diff(b.date); 
        
      }
    });
    return temp;
  } 


  this.deleteFilm =(id) => {
   for (let index = 0; index < this.films.length; index++) {
        if(this.films[index].id==id){
            this.films.splice(index,1);
        }
    }
  }


  this.getRated= (score) =>{
    return this.films.filter(film => film.rating != undefined);
    }


 
}

//creo libreria e film

let myLibrary= new FilmLibrary();

let film1= new Film('culo', false, dayjs('2008-12-01'),4);
let film2= new Film('tette', false, dayjs('20081205'),3);
let film3= new Film('piedi', true, dayjs('20081207'),5);
let film4= new Film('ascelle',false,undefined,1);
let film5= new Film('uomini',false);

//aggiungo 5 film

myLibrary.addNewFilm(film1);
myLibrary.addNewFilm(film2);
myLibrary.addNewFilm(film3);
myLibrary.addNewFilm(film4);
myLibrary.addNewFilm(film5);

//prova
console.log(myLibrary.films);
console.log(film1);

//stampo la libreria

myLibrary.films.forEach(element => {
    console.log(element.id+element.title); });
    

console.log('\n');

//elimino un film dalla libreria

myLibrary.deleteFilm(1);

//stampo la libreria aggiornata

myLibrary.films.forEach(element => {
console.log(element.id+element.title);});

//testo date
let data1= dayjs('2008-01-01');
console.log(data1)

console.log(film1.date+'\n'+film2.date+'\n'+film3.date+'\n'+film4.date+'\n'+film5.date+'\n');

//console.log('prova diff: '+film1.date.diff(film2.date,'d'));

//!  provo il sorting, funziona e ritorna 4 elementi ordinati con i nan in basso ma date fa brutto

let test =myLibrary.sortByDate();
console.log(test);

//! il foreach fa brutto, accedeva a un elemento undefined inesistente

for (let index = 0; index < myLibrary.films.length; index++) {
    console.log( myLibrary.films[index].title+' '+ myLibrary.films[index].date);
}
  //  debugger;


console.log('get rated test');
myLibrary.getRated().toString();


//debugger;