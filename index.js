class PaneObj{
    constructor(pane, content){
        this.pane = pane;
        this.content = content;
    }
}

document.addEventListener('DOMContentLoaded', function(){
    //Bindings
    let qs = document.querySelector.bind(document);
    let qsa = document.querySelectorAll.bind(document);
    
    //Panes
    let paneElements = qsa(".pane");
    let panes = [];

    for (let i = 0; i < paneElements.length; i++) {
        addPane(i);
    }

    if (paneElements.length > 0) {
        clearPanes();
        selectPane(panes[0]);
    }

    function addPane(id){
        let newPane = new PaneObj(qs("#pane" + id), qs("#content" + id));
        newPane.pane.addEventListener("click", function(e){            
            e.preventDefault();
            if (newPane.pane.classList.value == "pane disabled") {
                return;
            }
            clearPanes();
            selectPane(newPane);
        })
        panes.push(newPane);
    }
    function clearPanes(){
        panes.forEach(pane => {
            if (pane.pane.classList.value != "pane disabled") {
                if (pane.content) {                    
                    pane.pane.classList.value = "pane";
                    pane.content.classList.value = "content";
                }else{
                    pane.pane.classList.value = "pane disabled";
                }
            }
        });
    }
    function selectPane(pane){
        pane.pane.classList.value = "pane active";
        pane.content.classList.value = "content active";
    }

    //Image popup
    let modals = qsa(".modal");
    let modalBackground = qs("#modal-background");
    let modalTitle = qs("#modal-title");
    let modalContent = qs("#modal-content");
    let modalClose = qs("#close");

    [modalClose, modalBackground].forEach(element => {
        element.addEventListener("click", function(e){
            e.preventDefault();
            modalBackground.style.display = "none";
        })
    })
    window.addEventListener("keydown", function(e){
        if (e.keyCode == 27) {
            modalBackground.style.display = "none";
        }
    })    
    modals.forEach(function(modal){
        modal.addEventListener("click", function(e){
            e.preventDefault();
            modalBackground.style.display = "initial";
            let datasetContent = modal.dataset.content;
            if (datasetContent) {
                modalTitle.textContent = modal.textContent;
                modalContent.innerHTML = datasetContent;
            }else{
                let modalImg = this.querySelector("img");
                modalTitle.textContent = modalImg.alt;
                modalContent.innerHTML = modalImg.outerHTML;
            }
        })
    })
})