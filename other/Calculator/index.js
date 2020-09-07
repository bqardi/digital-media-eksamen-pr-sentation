document.addEventListener("DOMContentLoaded", function () {
    /* #region Variables */
    let btnClear = document.querySelector("#btn-clear");
    let btnBack = document.querySelector("#btn-back");
    // let btnPercent = document.querySelector("#btn-percent");
    let btnDivide = document.querySelector("#btn-divide");
    let btn1 = document.querySelector("#btn-1");
    let btn2 = document.querySelector("#btn-2");
    let btn3 = document.querySelector("#btn-3");
    let btnMultiply = document.querySelector("#btn-multiply");
    let btn4 = document.querySelector("#btn-4");
    let btn5 = document.querySelector("#btn-5");
    let btn6 = document.querySelector("#btn-6");
    let btnMinus = document.querySelector("#btn-minus");
    let btn7 = document.querySelector("#btn-7");
    let btn8 = document.querySelector("#btn-8");
    let btn9 = document.querySelector("#btn-9");
    let btnPlus = document.querySelector("#btn-plus");
    let btnNegate = document.querySelector("#btn-negate");
    let btn0 = document.querySelector("#btn-0");
    let btnDecimal = document.querySelector("#btn-decimal-place");
    let btnEqual = document.querySelector("#btn-equal");

    //let output = document.querySelector("#output");
    /* #endregion */

    /* #region Action buttons */
    btnClear.addEventListener("click", function () {
        ClearOutput();
    })
    btnBack.addEventListener("click", function () {
        RemoveLastFromOutput();
    })
    btnNegate.addEventListener("click", function () {
        NegateOutput();
    })
    btnEqual.addEventListener("click", function () {
        CalculateResult();
    })
    /* #endregion */

    /* #region Operators */
    btnDivide.addEventListener("click", function () {
        AddOperatorToOutput("/");
    })
    btnMultiply.addEventListener("click", function () {
        AddOperatorToOutput("*");
    })
    btnMinus.addEventListener("click", function () {
        AddOperatorToOutput("-");
    })
    btnPlus.addEventListener("click", function () {
        AddOperatorToOutput("+");
    })
    /* #endregion */

    /* #region Number Buttons */
    btn1.addEventListener("click", function () {
        AddValueToOutput(1);
    })
    btn2.addEventListener("click", function () {
        AddValueToOutput(2);
    })
    btn3.addEventListener("click", function () {
        AddValueToOutput(3);
    })
    btn4.addEventListener("click", function () {
        AddValueToOutput(4);
    })
    btn5.addEventListener("click", function () {
        AddValueToOutput(5);
    })
    btn6.addEventListener("click", function () {
        AddValueToOutput(6);
    })
    btn7.addEventListener("click", function () {
        AddValueToOutput(7);
    })
    btn8.addEventListener("click", function () {
        AddValueToOutput(8);
    })
    btn9.addEventListener("click", function () {
        AddValueToOutput(9);
    })
    btn0.addEventListener("click", function () {
        AddValueToOutput(0);
    })
    btnDecimal.addEventListener("click", function () {
        AddValueToOutput(".");
    })
    /* #endregion */
})

/* #region Functions */
function AddValueToOutput(value) {
    let current = output.innerHTML;
    if (current == "0") {
        current = value;
    } else {
        current += value;
    }
    output.innerHTML = current;
}
function AddOperatorToOutput(value) {
    let current = output.innerHTML;
    //Få fat i sidste tegn
    let last = current[current.length - 1];
    //Tjek om sidste tegn er en operator
    if (last == "/" || last == "*" || last == "-" || last == "+") {
        //Udskift eksisterende operator med ny operator
        current = current.slice(0, current.length - 1) + value;
    } else {
        //Ellers tilføj ny operator til eksisterende streng
        current += value;
    }
    output.innerHTML = current;
}
function ClearOutput() {
    output.innerHTML = "0";
}
function SetValueToOutput(value) {
    output.innerHTML = value;
}
function NegateOutput() {
    let current = output.innerHTML;
    if (current[0] == "-") {
        //Mærkeligt at dette virker
        current = current.slice(1, current.length);
    } else {
        current = "-" + current;
    }
    output.innerHTML = current;
}
function RemoveLastFromOutput() {
    let current = output.innerHTML;
    //Når man bruger negative numre, bliver de behandlet som en "offset" (der bliver talt baglæns) fra slutningen af array'et.
    current = current.slice(0, -1);
    output.innerHTML = current;
}
function CalculateResult() {
    let current = output.innerHTML;
    let result = "";
    //Har ikke ligefrem fuld forståelse for hvad følgende gør, men ser ud til at virke (fange evt. indtastningsfejl)
    try {
        result = eval(current);
    } catch (e) {
        if (e instanceof SyntaxError) {
            result = "Error, damn it!";
        }
    }
    output.innerHTML = result;
}
/* #endregion */