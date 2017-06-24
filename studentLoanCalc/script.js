var loanAmount = document.getElementById("loanAmount");
var loanTerm = document.getElementById("loanTerm");
var interestRate = document.getElementById("interestRate");


function calcLoan() {
    var loan = Number(loanAmount.value);
    var term = Number(loanTerm.value);
//    var days = term / 12 * 365.25;
    var interest = Number(interestRate.value) / 100 / 12;
    var x = (Math.pow(1+interest,term));
    var payment = (loan * x * interest)/(x-1);
    var totalInterest = (payment * term) - loan;
    var totalPayed = totalInterest + loan;

    
    if(loan !== loan || term !== term || interest !== interest){
        answer.innerHTML = "Please enter a proper number.";
    }else {
//        var x = loan * term; 
//        var rate = rate;
        answer.innerHTML = "Monthly Payment = $" + Math.round(payment) + "<br>";
        answer.innerHTML += "Interest Paid = $" + Math.round(totalInterest) + "<br>";
        answer.innerHTML += "Total Paid = $" + Math.round(totalPayed) + "<br>";
        }
    }

