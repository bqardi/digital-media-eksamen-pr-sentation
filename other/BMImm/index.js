document.addEventListener("DOMContentLoaded", function(){
    let selector = document.querySelector("#selector");
    let btn = document.querySelector("#btn");
    let label1 = document.querySelector("#label-1");
    // let label2 = document.querySelector("#label-2");
    let input1 = document.querySelector("#input-1");
    let input2 = document.querySelector("#input-2");
    let output = document.querySelector("#output");
    let visibilityWrapper = document.querySelector("#visibility-wrapper");
    let body = document.querySelector("body");
    let title = document.querySelector("#title");

    btn.addEventListener("click", function(){
        let weight = input1.value;
        let height = input2.value;
        if (NumberCheck(weight) && NumberCheck(height)) {
            let bmi = CalcBMI(weight, height);
            let res = BMIResult(bmi);
            output.innerHTML = `Dit BMI tal: ${bmi}<br><br>${res}`;
        } else {
            output.innerHTML = `Jeg tror lige du skal tjekke dine indtastninger igen!<br>Der må kun indtastes tal i felterne!`;
        }
    })
    input1.addEventListener("keypress", function(){
        if (event.which === 13) {
            btn.click();
        }
    })
    input2.addEventListener("keypress", function(){
        if (event.which === 13) {
            btn.click();
        }
    })

    selector.addEventListener("change", function(){
        //BMI beregning
        if (selector.value == "bmi") {
            label1.innerHTML = "Indtast vægt (kg)";
            // label2.innerHTML = "Indtast højde (m)";
            input1.value = "";
            input2.value = "";
            output.innerHTML = "...";
            title.innerHTML = "Beregn BMI";
            ChangeClass(visibilityWrapper, "visible");
            ChangeClass(body, "bmi-background");
            btn.addEventListener("click", function(){
                let weight = input1.value;
                let height = input2.value;
                if (NumberCheck(weight) && NumberCheck(height)) {
                    let bmi = CalcBMI(weight, height);
                    let res = BMIResult(bmi);
                    output.innerHTML = `Dit BMI tal: ${bmi}<br><br>${res}`;
                } else {
                    output.innerHTML = ErrorMessage();
                }
            })
        }

        //MOMS beregning
        if (selector.value == "moms") {
            label1.innerHTML = "Indtast beløb (u. moms)";
            //label2.innerHTML = "";
            input1.value = "";
            input2.value = "";
            output.innerHTML = "...";
            title.innerHTML = "Beregn MOMS";
            ChangeClass(visibilityWrapper, "invisible");
            ChangeClass(body, "moms-background");
            btn.addEventListener("click", function(){
                let forMoms = input1.value;
                if (NumberCheck(forMoms)) {
                    let moms = CalcMoms(forMoms);
                    let total = Number(forMoms) + Number(moms);
                    output.innerHTML = `MOMS (af ${forMoms} kr.) udgør: ${moms} kr.<br>Total: ${total} kr.`;
                } else {
                    output.innerHTML = ErrorMessage(forMoms);
                }
            })
        }

        //Omregning af Celsius til Fahrenheit
        if (selector.value == "deg") {
            label1.innerHTML = "Indtast &deg; (grader) Celsius";
            //label2.innerHTML = "";
            input1.value = "";
            input2.value = "";
            output.innerHTML = "...";
            title.innerHTML = "Omregn C&deg; til F&deg;";
            ChangeClass(visibilityWrapper, "invisible");
            ChangeClass(body, "deg-background");
            btn.addEventListener("click", function(){
                let celsius = input1.value;
                if (NumberCheck(celsius)) {
                    output.innerHTML = `Svarer til ${CelsiusToFahrenheit(celsius)}&deg; F (Fahrenheit)`;
                } else {
                    output.innerHTML = ErrorMessage(celsius);
                }
            })
        }
    })
})

//Visual
function ChangeClass(selector, className){
    selector.className = className;
}

//Error check
function NumberCheck(value){
    if(isNaN(value)){
        return false;
    }
    return true;
}
function ErrorMessage(errValue){
    if (errValue != null) {
        return `Jeg tror lige du skal tjekke din indtastning (<strong>${errValue}</strong>) igen!<br>Der må kun indtastes gyldige tal værdier!`;
    } else {
        return `Jeg tror lige du skal tjekke din indtastning igen!<br>Der må kun indtastes gyldige tal værdier!`;
    }
}

//Calculations
function CalcMoms(amount){
    return amount * 0.25;
}
function CelsiusToFahrenheit(amount){
    return amount * 1.8 + 32;
}
function CalcBMI(weight, height){
    if(isNaN(weight) || isNaN(height) || height == 0){
        return "???";
    }
    let result = weight / (height * height);
    result = Math.round(result * 1000) / 1000;
    return result;
}
function BMIResult(bmi){
    if (bmi < 16) {
        return "Tror hellere du må gå til lægen...";
    }
    if (bmi < 17) {
        return "Stop nu det der salatflip og spis nogen røde bøffer!";
    }
    if (bmi < 18.5) {
        return "Det er okay at spise en pose chips engang i mellem!";
    }
    if (bmi < 25) {
        return "Kedeligt! Du er helt normal.";
    }
    if (bmi < 27.5) {
        return "Hmm, prøv at tage trappen istedet for elevatoren de næste mange gange!";
    }
    if (bmi < 30) {
        return "Op på stairmasteren mester!";
    }
    if (bmi < 35) {
        return "Så er det vist på tide at sige farvel til Burger King og goddag til salatbaren!";
    }
    if (bmi < 10000) {
        return "Hvis du ikke selv kan gå til lægen, må lægen komme til dig, for der skal ske nogle drastiske ændringer, nu!";
    }
    return "Den forstod jeg ikke lige helt?!?!?";
}