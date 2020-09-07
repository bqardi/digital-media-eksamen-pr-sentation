document.addEventListener('DOMContentLoaded', function () {
    //Opening days
    let dato = document.querySelector("#index-dato")
    let d = new Date()
    let dStr = "i dag" + "  " +d.getDate() + "." + (d.getMonth()+1)
    let abningsTid = "11-22"
    let dGetDay = d.getDay()
    let dateStr
    
    if (dGetDay==0 || dGetDay ==6) {
        abningsTid="11-18"
    }
    if(dGetDay == 1){
        dateStr = dStr + " " + "lukket"
    }
    else{
        dateStr = dStr + "  " + "åbent" + "  " + abningsTid
    }

    
    dato.textContent=dateStr;

    //Cookie
    let cookieButton = document.querySelector("#cookie-button");

    if (cookieButton) {
        let cookie = document.querySelector("#cookie");
        const cookieHeight = 100;

        cookie.style.bottom = `0px`;

        cookieButton.addEventListener("click", function(){
            cookie.style.bottom = `-${cookieHeight}px`;
        })
    }

    //Image slider
    let images = document.querySelectorAll(".top-slider img");
    const imgLength = images.length;
    
    if (imgLength > 1) {
        let imgText = document.querySelector("#top-slider-textbox");
        const imgTextHeight = imgText.getBoundingClientRect().height;
        let index = 4;
        let prevIndex = 3;
        
        slideImages();

        setInterval(function(){
            slideImages();
        }, 8000);

        function slideImages(){
            setSlides();
            setTimeout(function(){
                resetSlides();
            }, 4000);
        }
        
        function setSlides(){
            index++;
            if(index == imgLength){
                index = 0;
            }
            images[index].style.opacity = "1";
            images[index].style.transform = "scale(1.3)";
            let txt = images[index].alt;
            txt = txt.replace(", ", "<br>");
            imgText.style.bottom = `-${imgTextHeight}px`;
            setTimeout(function(){
                imgText.innerHTML = txt;
                imgText.style.bottom = `0px`;
            }, 800);
        }

        function resetSlides(){
            prevIndex++;
            if(prevIndex == imgLength){
                prevIndex = 0;
            }
            images[prevIndex].style.opacity = "0";
            images[prevIndex].style.transform = "scale(1.0)";
        }
    }

    //Sticky menu
    let btnMenu = document.querySelector("#button-menu");
    
    if (btnMenu) {
        let btnLang = document.querySelector("#button-lang");    
        let btnMenuTop = Math.floor(btnMenu.getBoundingClientRect().top);
        let btnMenuTopPos = 20;
        let btnMenuWidth = btnMenu.getBoundingClientRect().width;
        
        let btnLangTop = Math.floor(btnLang.getBoundingClientRect().top);
        let btnLangWidth = btnLang.getBoundingClientRect().width;

        const mainMenuStickyPos = 56;
        let mainMenu = document.querySelector("#menu-sticky");
        let mainMenuTop = mainMenu.getBoundingClientRect().top;
        let mainMenuTopPos = document.querySelector("#menu-top-pos").getBoundingClientRect().top + scrollY;
        let mainMenuWidth = mainMenu.getBoundingClientRect().width;
        let mainMenuHeight = mainMenu.getBoundingClientRect().height;

        document.addEventListener("scroll", function(){
            if (scrollY >= btnMenuTopPos) {
                if (scrollY >= mainMenuTopPos - mainMenuStickyPos) {
                    mainMenu.style.position = "fixed";
                    mainMenu.style.top = mainMenuStickyPos + "px";
                    mainMenu.style.width = mainMenuWidth + "px";
                    mainMenu.style.height = mainMenuHeight + "px";
                } else {
                    mainMenu.style.position = "initial";
                    mainMenu.style.top = mainMenuTop + "px";
                }
                btnMenu.style.position = "fixed";
                btnMenu.style.top = "0px";
                btnMenu.style.width = btnMenuWidth + "px";
                
                btnLang.style.position = "fixed";
                btnLang.style.top = "0px";
                btnLang.style.width = btnLangWidth + "px";
            } else {
                btnMenu.style.position = "initial";
                btnMenu.style.top = btnMenuTop + "px";
                
                btnLang.style.position = "initial";
                btnLang.style.top = btnLangTop + "px";
            }
        })
    }
})