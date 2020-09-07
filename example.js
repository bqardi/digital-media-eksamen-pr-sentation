document.addEventListener('DOMContentLoaded', function(){
    //Deklaration af variabler
    let qs = document.querySelector.bind(document);

    let btn = qs("#button");

    //Initialisering
    btn.addEventListener("click", function(){
        buttonClick(this);
    })

    //Funktioner
    function buttonClick(element){
        if (getColor(element) == "rgb(255, 0, 0)") {
            setColor(element, "rgb(0, 0, 255)");
        } else {
            setColor(element, "rgb(255, 0, 0)");
        }
    }
    function getColor(element){
        return element.style.backgroundColor;
    }
    function setColor(element, color){
        element.style.backgroundColor = color;
    }
})