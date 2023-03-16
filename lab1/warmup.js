'use strict'

let array = ['nculo', 'kaller', 'vitaggio', 'da','a'];

array.forEach(element => {
   
    if(element.length < 2){
    console.log("empty with lenght:"+element.length+"\n");
    }else {
    
        let sout= element.charAt(0)+element.charAt(1)+element.charAt(element.length-2)+element.charAt(element.length-1)+"\n";
        console.log(sout)     //print first two and last chars
     }
    }
);