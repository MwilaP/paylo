
document.getElementById('basic_salary').addEventListener("keyup", grossPay);
document.getElementById('house_allowance').addEventListener("keyup", grossPay);
document.getElementById('statutory_contribution').addEventListener("keyup", grossPay);
//document.getElementById("submit_button").onclick = function() {grossPay()};

var year = new Date().getFullYear();
document.getElementById("current_year").innerHTML = year;


var idArray = ["basic_salary", "house_allowance", "statutory_contribution", "submit_button"];
function focusNext(e) {


    try {
        for (var i = 0; i < idArray.length; i++) {
            if (e.keyCode === 13 && e.target.id === idArray[i]) {
                document.querySelector(`#${idArray[i + 1]}`).focus();


            }
        }
    } catch (error) { }
}



function grossPay(e) {
    var salary = document.getElementById('basic_salary').value;
    var allowance = document.getElementById('house_allowance').value;
    var statutoryContribution = document.getElementById('statutory_contribution').value;


    var basic_salary = parseFloat(salary);

    var allowance = parseFloat(allowance);
    var statutoryContribution = parseFloat(statutoryContribution);

    if (basic_salary = 0) {
        document.getElementById('errorname').innerHTML = "Gross pay cannot be zero.";

    } else {
        var basic_salary = parseFloat(salary);
        //var basic_salary = 0;
    }

    if (allowance) {
        var allowance = parseFloat(allowance);
    } else {
        var allowance = 0;
    }

    if (statutoryContribution) {
        var statutoryContribution = parseFloat(statutoryContribution);
    } else {
        var statutoryContribution = 0;
    }

    if (fourthBand) {
        var fourthBand = parseFloat(fourthBand);
    } else {
        var fourthBand = 0;
    }

    if (thirdBand) {
        var thirdBand = parseFloat(thirdBand);
    } else {
        var thirdBand = 0;
    }
    if (secondBand) {
        var secondBand = parseFloat(secondBand);
    }
    else {
        var secondBand = 0;
    }

    if (firstBand) {
        var firstBand = parseFloat(firstBand);
    } else {
        var firstBand = 0;
    }


    // Gross pay
    if (isNaN(basic_salary)) {
        basic_salary = 0
    }
    if (isNaN(allowance)) {
        allowance = 0
    }
    if (isNaN(statutoryContribution)) {
        statutoryContribution = 0
    }
    gross_pay = basic_salary + allowance;
    gross_pay_total = gross_pay.toFixed(2);

    document.getElementById('gross_pay').innerHTML = gross_pay;

    //Napsa

    if (gross_pay < 26840.01) {
        var napsa = gross_pay * 0.05;
    } else if (gross_pay > 26840) {
        var napsa = 1342;
    }

    napsa_total = napsa.toFixed(2);

    if (napsa) {
        document.getElementById('napsa').innerHTML = napsa_total;
    }



    /* napsa = gross_pay * 0.05;
    napsa_total = napsa.toFixed(2);
    
    if (napsa) {
        document.getElementById('napsa').innerHTML = napsa_total;
    }*/

    //National health insurance

    var insurance = basic_salary * 0.01;
    var insurance_total = insurance.toFixed(2);

    document.getElementById('insurance').innerHTML = insurance_total;

    //Total Contributions

    totalContributions = statutoryContribution + napsa + insurance;

    total_contributions = totalContributions.toFixed(2);

    document.getElementById('total_contributions').innerHTML = total_contributions;

    //Total tax deductions

    if (gross_pay <= 5100) {
        var totalTaxDeductions = 0;
    } else if (5100 < gross_pay && 7100 >= gross_pay) {
        var totalTaxDeductions = (gross_pay - 5100) * 0.20;
    } else if (7100 < gross_pay && 9200 >= gross_pay) {
        var totalTaxDeductions = ((gross_pay - 7100) * 0.30) + (7100 - 5100) * 0.2;
    } else {
        var totalTaxDeductions = ((gross_pay - 9200) * 0.37) + ((7100 - 5100) * 0.2) + ((9200 - 7100) * 0.3);
    }

    total_tax_deduction = totalTaxDeductions.toFixed(2);

    document.getElementById('total_tax_deductions').innerHTML = total_tax_deduction;

    //Total deductions
    var totalDeductions = totalTaxDeductions + totalContributions;
    var totalDeductions = totalDeductions.toFixed(2);

    document.getElementById('total_deductions').innerHTML = totalDeductions;

    //Net Salary
    var netSalary = gross_pay - totalDeductions;
    var net_salary = netSalary.toFixed(2);

    document.getElementById('net_salary').innerHTML = net_salary;

    //Tax Bands
    if (gross_pay > 9200) {
        var fourthBand = ((gross_pay - 9200) * 0.37);
    }
    document.getElementById('fourth_band').innerHTML = fourthBand;
    if (7100 < gross_pay && 9200 >= gross_pay) {
        var thirdBand = ((gross_pay - 7100) * 0.30);
    }
    else if (gross_pay > 9200) {
        var thirdBand = (9200 - 7100) * 0.3;
    }
    document.getElementById('third_band').innerHTML = thirdBand;
    if (5100 < gross_pay && 7100 >= gross_pay) {
        var secondBand = (gross_pay - 5100) * 0.2;
    }
    else if (gross_pay > 7100) {
        var secondBand = (7100 - 5100) * 0.2;
    }
    document.getElementById('second_band').innerHTML = secondBand;
    if (gross_pay < 5100) {
        var firstBand = 0;
    }
    document.getElementById('first_band').innerHTML = firstBand;

    if (gross_pay <= 5100) {
        var band1 = gross_pay;
    }
    else if (gross_pay > 5100) {
        var band1 = 5100;
    }

    band_total1 = band1.toFixed(2);

    if (band1) {
        document.getElementById('band1').innerHTML = band_total1;
    }

    if (5100 < gross_pay && 7100 >= gross_pay) {
        var band2 = (gross_pay - 5100);
    }
    else if (gross_pay > 5100) {
        var band2 = (7100 - 5100);
    }

    band_totall = band2.toFixed(2);

    if (band2) {
        document.getElementById('band2').innerHTML = band_totall;
    }

    if (7100 < gross_pay && 9200 >= gross_pay) {
        var band3 = ((gross_pay - 7100));
    }
    else if (gross_pay > 9200) {
        var band3 = (9200 - 7100);
    }


    band_total2 = band3.toFixed(2);

    if (band3) {
        document.getElementById('band3').innerHTML = band_total2;
    }

    if (gross_pay > 9200) {
        var band4 = ((gross_pay - 9200));
    }

    band_total3 = band4.toFixed(2);

    if (band4) {
        document.getElementById('band4').innerHTML = band_total3;
    }



    e.preventDefault();
}