//Write a program that prints the numbers from 1 to 100. But for multiples of three print “Fizz” instead of the number and for the multiples of five print “Buzz”. For numbers which are multiples of both three and five print “FizzBuzz”.

for(i = 1; i <= 100; i++){

    
    if(i % 5 == 0 && i % 3 == 0){
        document.getElementById("content").innerHTML += "FizzBuzz" + "<br>";
    }else if(i % 3 == 0) {
        document.getElementById("content").innerHTML += "Fizz" + "<br>";
    }else if(i % 5 == 0) {
        document.getElementById("content").innerHTML += "Buzz" + "<br>";
    }else{
        document.getElementById("content").innerHTML += i + "<br>";
    }
}



