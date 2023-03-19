/* 
 * [2022/2023]
 * As starting point of Lab2 exercise i'll use * Lab 1 - Exercise 2 solutions
 */

'use strict';

const { rejects, throws } = require("assert");
const dayjs = require("dayjs");
const { resolve } = require("path");
const sqlite= require("sqlite3"); //importing sqlite after npm install
const { isNull } = require("util");

//defining a new object as database
const db= new sqlite.Database("lab2/films.db", (err) => {if (err) throw err;});



function Film(id, title, isFavorite=0, watchDate, rating) {
  this.id = id;
  this.title = title;
  this.favorite = isFavorite;
  this.rating = rating;

  // saved as dayjs object
  this.watchDate = watchDate && dayjs(watchDate);

  this.toString = () => {
    return `Id: ${this.id}, ` +
    `Title: ${this.title}, Favorite: ${this.favorite}, ` +
    `Watch date: ${this.formatWatchDate('MMMM D, YYYY')}, ` +
    `Score: ${this.formatRating()}` ;
  }

  this.formatWatchDate = (format) => {
    return this.watchDate ? this.watchDate.format(format) : '<not defined>';
  }

  this.formatRating = () => {
    return this.rating  ? this.rating : '<not assigned>';
  }
}


function FilmLibrary() {
  this.list = [];

  this.print = () => {
    console.log("***** List of films *****");
    this.list.forEach((item) => console.log(item.toString()));
  }

  this.addNewFilm = (film) => {
    if(!this.list.some(f => f.id == film.id))
      this.list.push(film);
    else
      throw new Error('Duplicate id');
  };

  this.deleteFilm = (id) => {
    const newList = this.list.filter(function(film, index, arr) {
      return film.id !== id;
    })
    this.list = newList;
  }

  this.resetWatchedFilms = () => {
    this.list.forEach((film) => delete film.watchDate);
  }

  this.getRated = () => {
    const newList = this.list.filter(function(film, index, arr) {
      return film.rating > 0;
    })
    return newList;
  }

  this.sortByDate = () => {
    const newArray = [...this.list];
    newArray.sort((d1, d2) => {
      if(!(d1.watchDate)) return  1;   // null/empty watchDate is the lower value
      if(!(d2.watchDate)) return -1;
      return d1.watchDate.diff(d2.watchDate, 'day')
    });
    return newArray;
  }



  //implementing db functionalities for lab2 starting here

  //get all film return a promise that resolve in an array of films

  this.getAllFilmsFromDB = function () {

    return new Promise((resolve, rejects) => {
      const sql = "SELECT *, title FROM films";
      let ans = [];
      db.all(sql, (err, rows) => {
        if (err) {
          rejects(err);
        } else {
          rows.forEach(rows => {
            ans.push(new Film(rows.id, rows.title, rows.favorite, rows.watchdate, rows.rating));
            resolve(ans);
          
          });
        }
      });

    });
  }

  //get all favourite film return a promise that resolve in an array of films

  this.getAllFavoritesFromDB = function () {

    return new Promise((resolve, rejects) => {
      const sql = "SELECT * FROM films WHERE favorite = 1";
      let ans = [];
      db.all(sql, (err, rows) => {
        if (err) {
          rejects(err);
        } else {
          rows.forEach(rows => {
            ans.push(new Film(rows.id, rows.title, rows.favorite, rows.watchdate, rows.rating));
            resolve(ans);
          
          });
        }
      });

    });

  }

  //get watched today
  
  this.getWatchedToday = function (){

    return new Promise((resolve, reject) =>  {  
      
    const sql = "SELECT * FROM films WHERE watchdate = ?";
    
    db.all(sql, [(dayjs().format('MMMM D, YYYY'))], (err, rows) => {
    
      if (err){
      rejects(err);
    } else {

       const answ =  rows.map(rows => new Film(rows.id, rows.title, rows.favorite, rows.watchdate, rows.rating));
       resolve(answ.length > 0 ? answ : []);      
    }
    });
    });
  }


  
  
  // get all films with a minimum rating
  
  this.getMinimalRating = function(rate){
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM films WHERE rating > ?";
      db.all(sql, [rate], (err, rows) => {
        if (err){
          rejects(err);
           } else{

    
          const answ =  rows.map(rows => new Film(rows.id, rows.title, rows.favorite, rows.watchdate, rows.rating));
          resolve(answ.length > 0 ? answ : []);
        }
      }
    );
  })
}


// get all film watched before a date
 
this.getWatchedBeforeDate= function(date){
  return new Promise((resolve, reject) => {
    const sql = "SELECT *, title FROM films WHERE watchdate < ?";
    db.all(sql, [date], (err, rows) => {
      if (err){
        rejects(err);
      } else {
        if (rows.length == 0){
          console.log("No film satisfy the date inserted");
          process.exit(0);
         } else{
        const answ =  rows.map(row => new Film(rows.id, rows.title, rows.favorite, rows.watchdate, rows.rating));
        resolve(answ);
      }
    }
  });
})
}

// get film trough a string search in the title --> always wanted to use wildcards porcodidio padre

this.searchByTitle = function(string){
  return new Promise((resolve, reject) => {
    const sql = "SELECT *, title FROM films WHERE title LIKE %?%";
    db.all(sql, [rating], (err, rows) => {
      if (err){
        rejects(err);
      } else {
        if (rows.length == 0){
          console.log("No film found");
          process.exit(0);
         } else{
        const answ =  rows.map(row => new Film(rows.id, rows.title, rows.favorite, rows.watchdate, rows.rating));
        resolve(answ);
      }
    }
  });
})
}

}



async function main() {
  // Creating some film entries
  const f1 = new Film(1, "Pulp Fiction", true, "2023-03-10", 5);
  const f2 = new Film(2, "21 Grams", true, "2023-03-17", 4);
  const f3 = new Film(3, "Star Wars", false);
  const f4 = new Film(4, "Matrix", false);
  const f5 = new Film(5, "Shrek", false, "2023-03-21", 3);

  // Adding the films to the FilmLibrary
  const library = new FilmLibrary();
  library.addNewFilm(f1);
  library.addNewFilm(f2);
  library.addNewFilm(f3);
  library.addNewFilm(f4);
  library.addNewFilm(f5);

  // Print Sorted films
  console.log("***** List of films (sorted) *****");
  const sortedFilms = library.sortByDate();
  sortedFilms.forEach((film) => console.log(film.toString()));

  // Deleting film #3
  library.deleteFilm(3);

  // Reset dates
  library.resetWatchedFilms();

  // Printing modified Library
  library.print();

  // Retrieve and print films with an assigned rating
  console.log("***** Films filtered, only the rated ones *****");
  const ratedFilms = library.getRated();
  ratedFilms.forEach((film) => console.log(film.toString()));

  //testing getAllFilmsFromDB
  console.log("***** Films Fetched from FilmsDb *****");
  await library.getAllFilmsFromDB().then( list => {list.forEach((film)=> console.log(film.toString()))} );
  
  //testing getAllFavouritesFromDB

  console.log("***** Favorites Fetched from FilmsDb *****");
  await library.getAllFavoritesFromDB().then( ans => {ans.forEach((film)=> console.log(film.toString()))} );
  
  //testing getwatched

  console.log("***** watched today from FilmsDb *****");

  await library.getWatchedToday().then(ans => {ans.forEach((film)=> console.log(film.toString())) });


 
  // testing getMinimalRating()
  console.log("***** filtered my minimum rating from FilmsDb *****");

  await library.getMinimalRating(2).then(ans => {ans.forEach((film)=> console.log(film.toString())) });
  
 // console.log(dayjs());

  // Additional instruction to enable debug 
//debugger;
}

main();
