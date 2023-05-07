'use strict';

// lab 04 - html script section
var test_library;

const allfilter = document.getElementById("filter-all");
const ratingfilter = document.getElementById("filter-best");
const favfilter = document.getElementById("filter-favorites");
const monthfilter = document.getElementById("filter-seen-last-month");
const unseenfilter = document.getElementById("filter-unseen");


//absolutely need of reenstablish a modular structure

// HERE

const createHTML = function (film) {  //here i pass the list filtered already

  //firstly, get and erase the area

  // const content = test_library.getAll();

  const area_to_display = document.getElementById('list-films');

  while (area_to_display.firstChild) {
    area_to_display.removeChild(area_to_display.lastChild);
  }

  //create the html and insert



  let rate;
  let check;
  let color;
  let insert;

  for (let index = 0; index < film.length; index++) {

    check = film[index].favorite ? "checked" : " ";
    color = film[index].favorite ? "favorite" : " ";


    switch (film[index].rating) {

      case 0:
        rate = "✩✩✩✩✩";
        break;

      case 1:
        rate = "🟊✩✩✩✩";

        break;
      case 2:
        rate = "🟊🟊✩✩✩";

        break;
      case 3:
        rate = " 🟊🟊🟊✩✩";

        break;

      case 4:
        rate = "🟊🟊🟊🟊✩";

        break;

      case 5:
        rate = "🟊🟊🟊🟊🟊";

        break;

      default: rate = " ";
        break;
    }

    /* need to add eliminate option for every film
    
    so add a button with an icon classify it give an id 

    fetch the nodes with the same class --> similar to change color listener we can add the in the for that define the element

    add an event listeners on click() => {

    get id, id is coherent with the filmlibrary struct the call the already defined function deleteFilm(id)

    also delete the relative html fragment in the page

    refreshing and clicking other filter must show that the removed film is missing

    } 

    */




    insert = `<li class='list-group-item' id='` + film[index].id + `'>
              <div class='d-flex w-100 justify-content-between'>
              <p class='${color} text-start col-md-4 col-3'>`
      + film[index].title + `</p>
              <span class='custom-control custom-checkbox col-md-2 col-3'>
              <input type='checkbox' class='custom-control-input' id='check-f${index}' ${check}>
              <label class='custom-control-label' for='check-f1'>Favorite</label></span>
              <small class='watch-date col-md-3 col-3'>`+ film[index].formatWatchDate('MMMM D, YYYY') + `</small>
              <span class='rating text-end col-md-3 col-3'>
              ${rate}</span></div></li>`;

    area_to_display.insertAdjacentHTML("beforeend", insert);

    //add event for check box

    const checkbox = document.getElementById(`check-f${index}`);
    const title = document.getElementById(`${film[index].id}`).querySelector("p");

    checkbox.addEventListener("change", function () {

      title.classList.toggle("favorite");
    });




  }


}


//on contennt loaded start start nested listeners

document.addEventListener('DOMContentLoaded', (event) => {

  allfilter.addEventListener("click", () => {

    const filterlist = test_library.getAll();
    createHTML(filterlist);

  });

});

//event listeners for changing color of favorites? HERE


//filter listers

favfilter.addEventListener("click", (event) => {

  const content = test_library.getFavs();
  createHTML(content);

});



ratingfilter.addEventListener("click", (event) => {

  const content = test_library.getRated();
  createHTML(content);

});


monthfilter.addEventListener("click", (event) => {

  const content = test_library.getSeenLastMonth();
  createHTML(content);

});


unseenfilter.addEventListener("click", (event) => {

  const content = test_library.getUnseen();
  createHTML(content);

});


function Film(id, title, isFavorite = false, watchDate, rating) {
  this.id = id;
  this.title = title;
  this.favorite = isFavorite;
  this.rating = rating;
  // saved as dayjs object only if watchDate is truthy
  this.watchDate = watchDate && dayjs(watchDate);

  this.toString = () => {
    return `Id: ${this.id}, ` +
      `Title: ${this.title}, Favorite: ${this.favorite}, ` +
      `Watch date: ${this.formatWatchDate('MMMM D, YYYY')}, ` +
      `Score: ${this.formatRating()}`;
  }

  this.formatWatchDate = (format) => {
    return this.watchDate ? this.watchDate.format(format) : '<not defined>';
  }

  this.formatRating = () => {
    return this.rating ? this.rating : '<not assigned>';
  }
}


function FilmLibrary() {
  this.list = [];

  this.print = () => {
    console.log("***** List of films *****");
    this.list.forEach(element => {

      console.log(element.toString());

    });
  }

  this.getAll = () => {
    if (this.list.length != 0)
      return this.list;
    else
      throw new Error('There are no film');

  }

  this.getFavs = () => {
    if (this.list.length != 0)
      return this.list.filter(film => film.favorite == true);
    else
      throw new Error('There are no film');

  }

  this.getSeenLastMonth = () => {
    if (this.list.length != 0)
      return this.list.filter(film => film.watchDate != undefined && film.watchDate.month() == dayjs().month());
    else
      throw new Error('There are no film');

  }

  this.getUnseen = () => {
    if (this.list.length != 0)
      return this.list.filter(film => film.watchDate == undefined);
    else
      throw new Error('There are no film');

  }




  this.addNewFilm = (film) => {
    if (!this.list.some(f => f.id == film.id))
      this.list.push(film);
    else
      throw new Error('Duplicate id');
  };

  this.deleteFilm = (id) => {
    const newList = this.list.filter(function (film, index, arr) {
      return film.id !== id;
    })
    this.list = newList;
  }

  this.resetWatchedFilms = () => {
    this.list.forEach((film) => delete film.watchDate);
  }

  this.getRated = () => {
    const newList = this.list.filter(function (film, index, arr) {
      return film.rating > 0;
    })
    return newList;
  }

  this.sortByDate = () => {
    const newArray = [...this.list];
    newArray.sort((d1, d2) => {
      if (!(d1.watchDate)) return 1;   // null empty watchDate is the lower value
      if (!(d2.watchDate)) return -1;
      return d1.watchDate.diff(d2.watchDate, 'day')
    });
    return newArray;
  }

}

main();

function main() {
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
  //library.deleteFilm(3);

  // Reset dates
  //library.resetWatchedFilms();

  // Printing modified Library
  library.print();

  test_library = library;

  // Retrieve and print films with an assigned rating
  console.log("***** Films filtered, only the rated ones *****");
  const ratedFilms = library.getRated();
  ratedFilms.forEach((film) => console.log(film.toString()));

  //testing dayjs

  console.log(library.getUnseen().toString());

  // Additional instruction to enable debug 
  // Debugger;

}