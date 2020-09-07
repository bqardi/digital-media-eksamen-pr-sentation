/************************************************************************************************************************/
//#region Classes
/************************************************************************************************************************/
class GameBoard{
    constructor(){
        this.width = 900;
        this.height = 600;
        this.color = '#123';

        this.marginBottom = 20;
    
        this.top = 50;
        this.bottom = this.height;
        this.left = 0;
        this.right = this.width;

        this.gameBoard;
        this.Draw();
    }

    Draw(){
        let gameBoard = SVG('space-invaders').size(this.width, this.height);
        gameBoard.rect(this.width, this.height);
        gameBoard.fill(this.color);
        this.gameBoard = gameBoard;
        return gameBoard;
    }
}
class SpaceShip{
    constructor(gameBoardObj, speed, width, height, strength, color, bulletColor, bulletSpeed, bulletPower, cooldown){
        this.gameBoardObj = gameBoardObj;
        this.speed = speed;
        this.width = width;
        this.height = height;
        this.color = color;
        this.strength = strength;
        this.startStrength = strength;

        this.bulletColor = bulletColor;
        this.bulletDirection = -1;
        this.canFire = true;
        this.isActive = true;

        this.spaceShip;
        this.xStartPos;
        this.yStartPos;

        this.SetStartSettings(bulletSpeed, bulletPower, cooldown, strength);
    }
    SetStartSettings(bulletSpeed, bulletPower, cooldown){
        this.bulletSpeed = bulletSpeed;
        this.bulletPower = bulletPower;
        this.cooldown = cooldown;      
        this.bulletStartSpeed = bulletSpeed;
        this.bulletStartPower = bulletPower;
        this.startCooldown = cooldown;
    }
    Draw(xPos, yPos){
        let spaceShip = this.gameBoardObj.gameBoard.rect(this.width, this.height);
        spaceShip.cx(xPos).cy(yPos);
        spaceShip.fill(this.color);
        this.xStartPos = xPos - this.width / 2;
        this.yStartPos = yPos - this.height / 2;
        this.spaceShip = spaceShip;
        return spaceShip; 
    }
    ResetStrength(){
        this.strength = this.startStrength;
    }
    Deactivate(){
        this.spaceShip.x(-this.width);
        this.isActive = false;
    }
    Remove(){
        this.spaceShip.remove();
    }
    GunActivate(){
        this.canFire = true;
    }
    GunCooldown(){
        if (this.cooldown > 0) {
            this.canFire = false;
            setTimeout(this.GunActivate.bind(this), this.cooldown);
        }
    }
    Hit(hitPower){
        this.strength -= hitPower;
    }
}
class Player extends SpaceShip{
    SetStartValues(){
        this.bulletSpeedCost = 25;
        this.bulletSpeedUpgradeFactor = 2;
        this.bulletSpeedUpgradeMargin = 750;

        this.bulletPowerCost = 150;
        this.bulletPowerUpgradeFactor = 0.02;
        this.bulletPowerUpgradeMargin = 5;

        this.cooldownCost = 90;
        this.cooldownUpgradeFactor = 2;
        this.cooldownUpgradeMargin = 120;

        this.strengthCost = 7000;
        this.strengthUpgradeFactor = 1;
        this.strengthUpgradeMargin = 4;
    }
    ResetUpgradedValues(){
        this.bulletSpeed = this.bulletStartSpeed;
        this.bulletPower = this.bulletStartPower;
        this.cooldown = this.startCooldown;
    }
    UpgradeBulletSpeed(){
        if (this.bulletSpeed < this.bulletSpeedUpgradeMargin) {
            if (this.SpendGold(this.bulletSpeedCost)) {
                this.bulletSpeed += this.bulletSpeedUpgradeFactor;
                if (this.bulletSpeed > this.bulletSpeedUpgradeMargin) {
                    this.bulletSpeed = this.bulletSpeedUpgradeMargin;
                }
                this.bulletSpeedText.text('Speed: ' + this.bulletSpeed);
            }
        }
    }
    UpgradeBulletPower(){
        if (this.bulletPower < this.bulletPowerUpgradeMargin) {
            if (this.SpendGold(this.bulletPowerCost)) {
                this.bulletPower += this.bulletPowerUpgradeFactor;
                if (this.bulletPower > this.bulletPowerUpgradeMargin) {
                    this.bulletPower = this.bulletPowerUpgradeMargin;
                }
                this.bulletPowerText.text('Power: ' + Math.round(this.bulletPower * 100) / 100);
            }
        }
    }
    UpgradeCooldown(){
        if (this.cooldown > this.cooldownUpgradeMargin) {
            if (this.SpendGold(this.cooldownCost)) {
                this.cooldown -= this.cooldownUpgradeFactor;
                if (this.cooldown < this.cooldownUpgradeMargin) {
                    this.cooldown = this.cooldownUpgradeMargin;
                }
                this.cooldownText.text('Rate:  ' + this.cooldown);
            }
        }
    }
    UpgradeShipHealth(){
        if (this.strength < this.strengthUpgradeMargin) {
            if (this.SpendGold(this.strengthCost)) {
                this.strength += this.strengthUpgradeFactor;
                if (this.strength > this.strengthUpgradeMargin) {
                    this.strength = this.strengthUpgradeMargin;
                }
                this.UpdateUI();
            }
        }
    }
    Activate(){
        this.spaceShip.x(this.xStartPos);
        this.isActive = true;
        this.ResetStrength();
        this.UpdateUI();
    }
    CreateUI(){
        this.strengthText = this.gameBoardObj.gameBoard.text('Health: ' + this.strength).font({
            size: 28,
            family: 'VT323, monospace',
            anchor: 'start',
            fill: '#d33'
        }).move(30, 10);
        this.bulletSpeedText = this.gameBoardObj.gameBoard.text('Speed: ' + this.bulletSpeed).font({
            size: 18,
            family: 'VT323, monospace',
            anchor: 'start',
            fill: '#ccc'
        }).move(30, 40);
        this.bulletPowerText = this.gameBoardObj.gameBoard.text('Power: ' + this.bulletPower).font({
            size: 18,
            family: 'VT323, monospace',
            anchor: 'start',
            fill: '#ccc'
        }).move(30, 60);
        this.cooldownText = this.gameBoardObj.gameBoard.text('Rate:  ' + this.cooldown).font({
            size: 18,
            family: 'VT323, monospace',
            anchor: 'start',
            fill: '#ccc'
        }).move(30, 80);
        this.startGold = 7000;
        this.gold = this.startGold;
        this.goldText = this.gameBoardObj.gameBoard.text('Gold: ' + this.gold).font({
            size: 28,
            family: 'VT323, monospace',
            anchor: 'start',
            fill: '#fa5'
        }).move(150, 10);
        this.timerTime = '00:00';
        this.timerSec = 0;
        this.timerMin = 0;
        this.timerText = this.gameBoardObj.gameBoard.text('Time: ' + this.timerTime).font({
            size: 28,
            family: 'VT323, monospace',
            anchor: 'end',
            fill: '#fed'
        }).move(this.gameBoardObj.width - 30, 10);
    }
    AddGold(amount){
        this.gold += amount;
        this.goldText.text('Gold: ' + this.gold);
    }
    CanSpendGold(amount){
        return amount <= this.gold;
    }
    SpendGold(amount){
        const canSpend = this.CanSpendGold(amount);
        if (canSpend) {
            this.gold -= amount;
            this.goldText.text('Gold: ' + this.gold);
        }
        return canSpend;
    }
    ResetGold(){
        this.gold = this.startGold;
        this.goldText.text('Gold: ' + this.gold);
    }
    UpdateUI(){
        this.strengthText.text('Health: ' + this.strength);
    }
    UpdateTimer(){
        this.timerSec++;
        const sec = ("0" + this.timerSec).slice(-2);
        if (this.timerSec >= 60) {
            this.timerSec = 0;
            this.timerMin++;
        }
        const min = ("0" + this.timerMin).slice(-2);
        const time = min + ":" + sec;
        this.timerText.text('Time: ' + time);
    }
    ResetTimer(){
        this.timerSec = 0;
        this.timerMin = 0;
        this.timerText.text('Time: ' + this.timerTime);
    }
}
class Enemy extends SpaceShip{
    Set(dir, xPos, yPos){
        this.bulletDirection = dir;
        return this.Draw(xPos, yPos);
    }
}
class Bullet{
    constructor(radius){
        this.radius = radius;
        this.speed;
        this.power;
        this.isActive = false;
        
        this.bullet;
        this.direction;
    }
    Draw(gameBoardObj){
        this.bullet = gameBoardObj.gameBoard.circle(this.radius)
        this.bullet.center(-this.radius);
        return this.bullet;
    }
    Remove(){
        this.bullet.remove();
    }
    Activate(direction, speed, power, color, xPos, yPos){
        this.direction = direction;
        this.speed = speed;
        this.power = power;
        this.bullet.center(xPos, yPos);
        this.bullet.fill(color);
        this.isActive = true;
    }
    Deactivate(){
        this.bullet.center(-this.radius);
        this.isActive = false;
    }
}
class Selector{
    constructor(id){
        this.id = id;
        this.selectorID = "#" + id;
        this.reference = document.querySelector(this.selectorID);
        this.active;
        this.Active = true;
    }
    set Active(isActive){
        if (isActive) {
            this.active = true;
            this.reference.style.display = 'block';
        } else {
            this.active = false;
            this.reference.style.display = 'none';
        }
    }
    get Active(){
        return this.active;
    }
}
class SelectorText extends Selector{
    SetText(text){
        this.reference.innerHTML = text;
    }
}
class SelectorBackground extends Selector{
    set Active(isActive){
        if (isActive) {
            this.reference.style.backgroundColor = 'rgb(0, 0, 0, 0.6)';
        } else {
            this.reference.style.backgroundColor = 'rgb(0, 0, 0, 0.0)';
        }
    }
}
class htmlText{
    constructor(parent, tag, position, id, htmlClass, text){
        this.parent = parent;
        this.id = id;
        this.selectorID = "#" + id;
        this.reference = this.BuildText(tag, position, htmlClass, text);
    }
    BuildText(tag, position, htmlClass, text){
        this.parent.reference.insertAdjacentHTML(position, `<${tag} id="${this.id}" class="${htmlClass}">${text}</${this.tag}>`);
        return document.querySelector(this.selectorID);
    }
}
class ButtonGroup{
    constructor(ui, id){
        this.ui = ui;
        this.idName = id;
        this.id = id + "-button-group";
        this.buttonsBackgroundColor = "rgb(70, 133, 250)";
        this.buttonsHighlightColor = "rgb(200, 200, 100)";
        this.selectorID = "#" + this.id;
        this.html = `<div id="${this.id}" class="menu-buttons"></div>`;
        this.reference = this.CreateGroup();
    }
    CreateGroup(){
        this.ui.reference.innerHTML = this.html;
        return document.querySelector(this.selectorID);
    }
}
class Button{
    constructor(group, id, btnText, active, highlighted){
        this.group = group;
        this.id = id;
        this.selectorID = `#${this.group.idName}-${id}`;
        this.html = `<div id='${this.group.idName}-${id}' class='btn'>${btnText}</div>`;
        this.reference;
        this.active;
        this.highlighted;
        this.CreateButton();
        this.Active = active;
        this.Highlight = highlighted;
    }
    CreateButton(){
        this.group.reference.insertAdjacentHTML("beforeend", this.html);
        this.reference = document.querySelector(this.selectorID);
        this.reference.style.backgroundColor = this.group.buttonsBackgroundColor;
    }
    set Highlight(isHighlighted){
        if (this.Active) {
            if (isHighlighted) {
                this.reference.style.backgroundColor = this.group.buttonsHighlightColor;
                this.highlighted = true;
            } else {
                this.reference.style.backgroundColor = this.group.buttonsBackgroundColor;
                this.highlighted = false;
            }
        }
    }
    set Active(isActive){
        if (isActive) {
            this.reference.style.backgroundColor = this.group.buttonsBackgroundColor;
            this.active = true;
        } else {
            this.reference.style.backgroundColor = "#555";
            this.active = false;
        }
    }
    get Active(){
        return this.active;
    }
}

//#endregion Classes
/************************************************************************************************************************/

document.addEventListener("DOMContentLoaded", function(){


    /************************************************************************************************************************/
    //#region Declarations
    /************************************************************************************************************************/

    let gameBoardObj;
    
    //Menus
    let background;
    let title;

    //Main menu
    let mainMenu;
    let mainMenuButtonGroup;
    let mainMenuButtons = [];
    let menuCycleIndex = 0;
    let startButton;
    let resumeButton;
    // let upgradeButton;

    //Upgrade menu    
    let upgradeMenu;
    let upgradeMenuButtonGroup;
    let upgradeMenuButtons = [];

    let upgradeCloseButton;

    let bulletSpeedButton;
    let bulletSpeedCostText;
    let bulletSpeedAmountText;

    let bulletPowerButton;
    let bulletPowerCostText;
    let bulletPowerAmountText;

    let bulletCooldownButton;
    let bulletCooldownCostText;
    let bulletCooldownAmountText;

    let healthButton;
    let healthCostText;
    let healthAmountText;

    //Player
    let player;
    let startXPos;
    let startYPos;
    let playerSpaceShip;
    let playerDirection = 0;
    let fireKeyDown = false;
    const goldBonusFactor = 500;
    
    //Enemy
    let enemyDirection = 1;
    let enemyMoveDistance = 100;
    const enemyXSpacing = 12;
    const enemyYSpacing = 8;

    let enemyStealGoldInterval = 12;
    let enemySpeedIncrease = 0.1;
    const enemyStartFireRate = 800;
    let enemyFireRate = enemyStartFireRate;
    const enemyFireRateMin = 300;
    const enemyFireRateDecreaseValue = 20;
    // let enemyFireRateChange = 98; //Percentage of enemyFireRate. Increased procedurally when closing in on the player

    let totalEnemyWidth;
    let enemyStartX;
    let enemyStartY;
    let enemyShotInterval;
    let enemyCount = 0;
    let enemies = [];
    let bullets = [];
    let goldCoins = [];
    let mines = [];

    //#endregion Declarations
    /************************************************************************************************************************/


    /************************************************************************************************************************/
    //#region Draw required elements
    /************************************************************************************************************************/

    gameBoardObj = new GameBoard();
    
    //Make parent div's the same height and width as gameBoard
    document.querySelector("#game-parent").style.maxWidth = gameBoardObj.width + "px";
    document.querySelector("#space-invaders").style.height = gameBoardObj.height + "px";

    player = new Player(gameBoardObj, 5, 70, 20, 3, '#f06', '#eee', 400, 1, 300);
    player.SetStartValues();
    player.CreateUI();

    startXPos = gameBoardObj.width / 2;
    startYPos = gameBoardObj.height - gameBoardObj.marginBottom - player.height / 2;
    playerSpaceShip = player.Draw(startXPos, startYPos);

    createMainMenu();
    createUpgradeMenu();

    //#endregion Draw required elements
    /************************************************************************************************************************/



    /************************************************************************************************************************/
    //#region Eventlisteners
    /************************************************************************************************************************/

    SVG.on(document, 'keydown', function(e) {
        if (e.keyCode != 122 && e.keyCode != 123 && e.keyCode != 116) {
            e.preventDefault();
        }
        if (player.isActive) {
            //Move player right
            if (e.keyCode == 39) {
                playerDirection = 1;
            }
            //Move player left
            if (e.keyCode == 37) {
                playerDirection = -1;
            }
            //Shoot
            if (e.keyCode == 17) {
                fireKeyDown = true;
            }
            //Pause
            if (e.keyCode == 80 && !upgradeMenu.Active) {
                if (menuDisallowed) {
                    return;
                }
                toggleMainMenu();
                title.SetText('Paused');
            }
        }
        //Menu navigation
        if (mainMenu.Active) {
            //Enter
            if (e.keyCode == 13) {
                mainMenuButtonsPressed(menuCycleIndex);
            }
            //Move up
            if (e.keyCode == 38) {
                cycleMenu(mainMenuButtons, -1);
            }
            //Move down
            if (e.keyCode == 40) {
                cycleMenu(mainMenuButtons, 1);
            }
            //ESC
            if (e.keyCode == 27) {
                toggleMainMenu();
            }
        }
        if (upgradeMenu.Active) {
            //Enter
            if (e.keyCode == 13) {
                upgradeMenuButtonsPressed(menuCycleIndex);
            }
            //Move up
            if (e.keyCode == 38) {
                cycleMenu(upgradeMenuButtons, -1);
            }
            //Move down
            if (e.keyCode == 40) {
                cycleMenu(upgradeMenuButtons, 1);
            }
            //ESC
            if (e.keyCode == 27) {
                hideUpgradeMenu();
                initiateWave();
            }
        }
    });
    SVG.on(document, 'keyup', function(e) {
        if (e.keyCode == 39 && playerDirection > 0) {
            e.preventDefault();
            playerDirection = 0;
        }
        if (e.keyCode == 37 && playerDirection < 0) {
            e.preventDefault();
            playerDirection = 0;
        }
        if (e.keyCode == 17) {
            e.preventDefault();
            fireKeyDown = false;
        }
    });

    //#endregion Eventlisteners
    /************************************************************************************************************************/


    /************************************************************************************************************************/
    //#region Functions
    /************************************************************************************************************************/

    //#region Menu
    //Main menu
    function createMainMenu(){
        background = new SelectorBackground("menu")
        title = new SelectorText("title");
        mainMenu = new Selector("main-menu"); //References an existing ui element in the DOM by its id
        mainMenuButtonGroup = new ButtonGroup(mainMenu, "menu");

        startButton = new Button(mainMenuButtonGroup, 1, "New game", true, true);
        resumeButton = new Button(mainMenuButtonGroup, 2, "Resume game", false, false);
        
        mainMenuButtons.push(startButton);
        mainMenuButtons.push(resumeButton);

        startButton.reference.addEventListener('mouseover', function(){
            highlightButton(mainMenuButtons, 0);
        });
        resumeButton.reference.addEventListener('mouseover', function(){
            highlightButton(mainMenuButtons, 1);
        });

        startButton.reference.addEventListener('click', function(){
            mainMenuButtonsPressed(0);
        });
        resumeButton.reference.addEventListener('click', function(){
            mainMenuButtonsPressed(1);
        });
    }
    function cycleMenu(buttonsArray, direction){
        menuCycleIndex += direction;
        if (menuCycleIndex >= buttonsArray.length) {
            menuCycleIndex = 0;
        } else if (menuCycleIndex < 0){
            menuCycleIndex = buttonsArray.length - 1;
        }
        if (!buttonsArray[menuCycleIndex].Active) {
            cycleMenu(buttonsArray, direction);
            return;
        }
        highlightButton(buttonsArray, menuCycleIndex);
    }
    function mainMenuButtonsPressed(index){
        switch (index) {
            case 0:
                newGame();
                break;
            case 1:
                toggleMainMenu();
                break;
        
            default:
                break;
        }
    }
    function highlightButton(buttonsArray, btnIndex){
        for (let index = 0; index < buttonsArray.length; index++) {
            const menuBtn = buttonsArray[index];
            menuBtn.Highlight = false;
        }
        menuCycleIndex = btnIndex;
        buttonsArray[menuCycleIndex].Highlight = true;
    }
    function showMainMenu(){
        clearInterval(enemyShotInterval);
        background.Active = true;
        title.SetText('Space Invaders');
        title.Active = true;
        mainMenu.Active = true;
        highlightButton(mainMenuButtons, 0);
        setEngineState(false);
    }
    function hideMainMenu(){
        enemyShootInterval();
        background.Active = false;
        title.Active = false;
        mainMenu.Active = false;
        setEngineState(true);
    }
    function toggleMainMenu(){
        if (resumeButton.Active) {
            if (engineActive) {
                timerActive = false;
                showMainMenu();
            } else {
                timerActive = true;
                hideMainMenu();
            }
        }
    }

    //Updrade menu
    function createUpgradeMenu(){
        upgradeMenu = new Selector("upgrade-menu"); //References an existing ui element in the DOM by its id
        upgradeMenuButtonGroup = new ButtonGroup(upgradeMenu, "upgrade");

        bulletSpeedButton = new Button(upgradeMenuButtonGroup, 1, "Bullet speed", true, true);
        bulletPowerButton = new Button(upgradeMenuButtonGroup, 2, "Bullet power", true, false);
        bulletCooldownButton = new Button(upgradeMenuButtonGroup, 3, "Fire rate", true, false);
        healthButton = new Button(upgradeMenuButtonGroup, 4, "Ship health", true, false);
        upgradeCloseButton = new Button(upgradeMenuButtonGroup, 5, "Close", true, false);

        const costPrefix = "Goldcost: ";
        const amountPrefix = "Amount: ";

        bulletSpeedCostText = new htmlText(bulletSpeedButton, "span", "afterBegin",
            "bullet-speed-cost", "upgrade-cost-text", costPrefix + player.bulletSpeedCost);
        bulletSpeedAmountText = new htmlText(bulletSpeedButton, "span", "beforeEnd",
            "bullet-speed-amount", "upgrade-amount-text", amountPrefix + player.bulletSpeedUpgradeFactor);

        bulletPowerCostText = new htmlText(bulletPowerButton, "span", "afterBegin",
            "bullet-power-cost", "upgrade-cost-text", costPrefix + player.bulletPowerCost);
        bulletPowerAmountText = new htmlText(bulletPowerButton, "span", "beforeEnd",
            "bullet-power-amount", "upgrade-amount-text", amountPrefix + player.bulletPowerUpgradeFactor);

        bulletCooldownCostText = new htmlText(bulletCooldownButton, "span", "afterBegin",
            "bullet-cooldown-cost", "upgrade-cost-text", costPrefix + player.cooldownCost);
        bulletCooldownAmountText = new htmlText(bulletCooldownButton, "span", "beforeEnd",
            "bullet-cooldown-amount", "upgrade-amount-text", amountPrefix + player.cooldownUpgradeFactor);

        healthCostText = new htmlText(healthButton, "span", "afterBegin",
            "health-cost", "upgrade-cost-text", costPrefix + player.strengthCost);
        healthAmountText = new htmlText(healthButton, "span", "beforeEnd",
            "health-amount", "upgrade-amount-text", "Health: +" + player.strengthUpgradeFactor);
        
        upgradeMenuButtons.push(upgradeCloseButton);
        upgradeMenuButtons.push(bulletSpeedButton);
        upgradeMenuButtons.push(bulletPowerButton);
        upgradeMenuButtons.push(bulletCooldownButton);
        upgradeMenuButtons.push(healthButton);

        for (let btnIndex = 0; btnIndex < upgradeMenuButtons.length; btnIndex++) {
            const upgrBtn = upgradeMenuButtons[btnIndex];
            upgrBtn.reference.addEventListener('mouseover', function(){
                highlightButton(upgradeMenuButtons, btnIndex);
            });
            upgrBtn.reference.addEventListener('click', function(){
                upgradeMenuButtonsPressed(btnIndex);
            });
        }

        upgradeMenu.Active = false;
    }
    function upgradeMenuButtonsPressed(index){
        switch (index) {
            case 0:
                hideUpgradeMenu();
                initiateWave();
                break;
            case 1:
                player.UpgradeBulletSpeed();
                break;
            case 2:
                player.UpgradeBulletPower();
                break;
            case 3:
                player.UpgradeCooldown();
                break;
            case 4:
                player.UpgradeShipHealth();
                break;
        
            default:
                break;
        }
    }
    function showUpgradeMenu(){
        clearInterval(enemyShotInterval);
        background.Active = true;
        title.SetText('Upgrade menu');
        title.Active = true;
        upgradeMenu.Active = true;
        highlightButton(upgradeMenuButtons, 0);
        setEngineState(false);
    }
    function hideUpgradeMenu(){
        enemyShootInterval();
        background.Active = false;
        title.Active = false;
        upgradeMenu.Active = false;
        setEngineState(true);
    }
    function toggleUpgradeMenu(){
        if (resumeButton.Active) {
            if (engineActive) {
                timerActive = false;
                showUpgradeMenu();
            } else {
                timerActive = true;
                hideUpgradeMenu();
            }
        }
    }
    //#endregion Menu

    //#region Game mechanics
    function newGame(){
        hideMainMenu();
        
        resumeButton.Active = true;
        timerEnd();
        player.ResetTimer();
        player.Activate();
        player.ResetGold();
        player.ResetUpgradedValues();
        resetActiveWave();
        enemyDirection = Math.round(Math.random()) == 0 ? -1 : 1;

        resetEnemyFireRate();
        removeEnemies();
        removeRoundObjects(bullets);
        removeRoundObjects(goldCoins);
        firstWave();
        createRoundObjects(20, bullets, 10);
        createRoundObjects(8, goldCoins, 25);
        createRoundObjects(2, mines, 30);
    }
    function gameOver(){
        timerActive = false;
        resumeButton.Active = false;
        clearInterval(enemyShotInterval);
        showMainMenu();
        title.SetText('Game Over');
    }
    //#endregion Game mechanics

    //#region Global
    function fireBullet(spaceShip){
        if (spaceShip) {
            let bulletObj;
            let bulletAvailable = false;
            //Loop through the pool (bullets[] array)
            for (let i = 0; i < bullets.length; i++) {
                const currentBullet = bullets[i];
                //If bullet is not active in the game (visible on screen), use it
                if (!currentBullet.isActive) {
                    bulletAvailable = true;
                    bulletObj = currentBullet;
                }
            }
            if (!bulletAvailable) {
                //If all bullets from the pool are active (or no bullets were created yet), create a new bullet
                bulletObj = createRoundObj(bullets, 10);
            }
            //Activate the bullet
            bulletObj.Activate(
                    spaceShip.bulletDirection,
                    spaceShip.bulletSpeed,
                    spaceShip.bulletPower,
                    spaceShip.bulletColor,
                    spaceShip.spaceShip.cx(),
                    spaceShip.spaceShip.cy()
                );

            spaceShip.GunCooldown();
        }
    }
    function moveBullets(){
        let bulletsLength = bullets.length;
        if (bulletsLength > 0) {
            for (let i = bulletsLength - 1; i >= 0 ; i--) {
                const currentBullet = bullets[i];
                //Only move bullets that are active (visible on screen)
                if (currentBullet.isActive) {
                    currentBullet.bullet.dmove(0, deltaTime * currentBullet.direction * currentBullet.speed);
                    if (currentBullet.bullet.cy() < gameBoardObj.top - currentBullet.radius ||
                        currentBullet.bullet.cy() > gameBoardObj.bottom + currentBullet.radius) {
                        //Deactivate the bullet
                        currentBullet.Deactivate();
                    } else if (currentBullet.direction < 0){
                        //Check if the bullet hit an enemy
                        for (let i = 0; i < enemies.length; i++) {
                            const enemy = enemies[i];
                            if (enemy.strength > 0 && roundObjectCollision(currentBullet, enemy)) {
                                //The bullet hit an enemy
                                currentBullet.Deactivate();
                                enemy.Hit(currentBullet.power);
                                if (enemy.strength <= 0) {
                                    hitEffect(enemy.spaceShip, 120, '#fc0');
                                    chanceToSpawnGold(enemy.spaceShip);
                                    enemy.Deactivate();
                                    enemyCount--;
                                    if (enemyCount <= 0) {
                                        //Round won
                                        const time = timerEnd();
                                        endOfWaveGold(time);
                                        nextWave();
                                    }
                                }
                            }
                        }
                    } else {
                        //Check if the bullet hit the player
                        if (player.strength > 0 && roundObjectCollision(currentBullet, player)) {
                            //The bullet hit the player
                            hitScreenEffect();
                            player.Hit(currentBullet.power);
                            player.UpdateUI();
                            // playerLifeText.text('Life: ' + player.strength + '');
                            if (player.strength <= 0) {
                                //Game over
                                hitEffect(player.spaceShip, 170, '#faa');
                                playerDirection = 0;
                                player.Deactivate();
                                gameOver();
                            }
                            currentBullet.Deactivate();
                        }
                    }
                }
            }
        }
    }
    function createRoundObj(arr, size){
        let obj = new Bullet(size);
        obj.Draw(gameBoardObj);
        arr.push(obj);
        return obj;
    }
    function createRoundObjects(amount, arr, size){
        for (let i = 0; i < amount; i++) {
            createRoundObj(arr, size);
        }
    }
    function removeRoundObjects(arr){
        for (let i = arr.length - 1; i >= 0; i--) {
            const obj = arr[i];
            obj.Remove();
        }
        bullets = [];
    }
    function moveRoundObjects(arr){
        let arrLength = arr.length;
        if (arrLength > 0) {
            for (let i = arrLength - 1; i >= 0 ; i--) {
                const obj = arr[i];
                //Only move objects that are active (visible on screen)
                if (obj.isActive) {
                    obj.bullet.dmove(0, deltaTime * obj.speed);
                    if (obj.bullet.cy() > gameBoardObj.bottom + obj.radius) {
                        //Deactivate the object
                        obj.Deactivate();
                    } else {
                        //Check if the object hit the player
                        if (roundObjectCollision(obj, player)) {
                            //The object hit the player
                            player.AddGold(obj.power);
                            obj.Deactivate();
                        }
                    }
                }
            }
        }
    }
    function roundObjectCollision(roundObj, spaceShipObj){
        let collidersIntersect = false;

        const roundObjTop = roundObj.bullet.y();
        const roundObjBottom = roundObjTop + roundObj.radius;
        const roundObjLeft = roundObj.bullet.x();
        const roundObjRight = roundObjLeft + roundObj.radius;
        
        const spaceShipTop = spaceShipObj.spaceShip.y();
        const spaceShipBottom = spaceShipTop + spaceShipObj.height;
        const spaceShipLeft = spaceShipObj.spaceShip.x();
        const spaceShipRight = spaceShipLeft + spaceShipObj.width;

        if (roundObjTop < spaceShipBottom && roundObjBottom > spaceShipTop && roundObjRight > spaceShipLeft && roundObjLeft < spaceShipRight) {
            collidersIntersect = true;
            hitEffect(roundObj.bullet, 40, '#fc5');
        }
        
        return collidersIntersect;
    }
    function enemyCollision(enemyObj, playerObj){
        let collidersIntersect = false;

        const enemyTop = enemyObj.spaceShip.y();
        const enemyBottom = enemyTop + enemyObj.height;
        const enemyLeft = enemyObj.spaceShip.x();
        const enemyRight = enemyLeft + enemyObj.width;
        
        const playerTop = playerObj.spaceShip.y();
        const playerBottom = playerTop + playerObj.height;
        const playerLeft = playerObj.spaceShip.x();
        const playerRight = playerLeft + playerObj.width;

        if (enemyTop < playerBottom && enemyBottom > playerTop && enemyRight > playerLeft && enemyLeft < playerRight) {
            collidersIntersect = true;
        }
        
        return collidersIntersect;
    }
    function hitEffect(hitPoint, magnitude, color) {
        let gradient = gameBoardObj.gameBoard.gradient('radial', function(stop) {
            stop.at(0, color, 1);
            stop.at(1, color, 0);
        })
        let effect = gameBoardObj.gameBoard.circle(magnitude);
        effect.center(hitPoint.cx(), hitPoint.cy()).fill(gradient);
        effect.animate(magnitude, '>').opacity(0).after(function() {
            effect.remove();
        })
    }
    function hitScreenEffect(){
        let effect = gameBoardObj.gameBoard.rect(gameBoardObj.width, gameBoardObj.height);
        effect.fill('#f00').opacity(0.4);
        effect.animate(500, '>').opacity(0).after(function() {
            effect.remove();
        })
    }
    //#endregion Global
    
    //#region Player
    function playerController(){
        let playerSpaceShipLeft = playerSpaceShip.x();
        let playerSpaceShipRight = playerSpaceShip.x() + player.width;
        if (playerSpaceShipLeft <= gameBoardObj.left && playerDirection < 0) {
            playerSpaceShip.x(0);
            playerDirection = 0;
        } else if (playerSpaceShipRight >= gameBoardObj.right && playerDirection > 0) {
            playerSpaceShip.x(gameBoardObj.right - player.width);
            playerDirection = 0;
        } else {
            playerSpaceShip.dx(playerDirection * player.speed);
        }
    }
    function chanceToSpawnGold(enemyShip){
        const rnd = Math.random();
        const goldCoinSpeed = randomBetween(120, 200, true);
        const goldValue = randomBetween(100, 300, true);
        if (rnd < 0.2) {
            let goldCoinObj;
            let goldCoinAvailable = false;
            //Loop through the pool (goldCoins[] array)
            for (let i = 0; i < goldCoins.length; i++) {
                const currentGoldCoin = goldCoins[i];
                //If goldCoin is not active in the game (visible on screen), use it
                if (!currentGoldCoin.isActive) {
                    goldCoinAvailable = true;
                    goldCoinObj = currentGoldCoin;
                }
            }
            if (!goldCoinAvailable) {
                //If all goldCoins from the pool are active (or no goldCoins were created yet), create a new goldCoin
                goldCoinObj = createRoundObj(goldCoins, 25);
            }
            //Activate the goldCoin
            goldCoinObj.Activate(
                    1,
                    goldCoinSpeed,
                    goldValue,
                    'rgb(255, 255, 100)',
                    enemyShip.cx(),
                    enemyShip.cy()
                );
        }
    }
    //#endregion Player

    //#region Wave
    function firstWave(){
        generateWave(); //Generated in 'spaceinvaders_waves.js'
        initiateWave();
    }
    function nextWave(){
        menuDisallowed = true;
        title.SetText('Wave ' + activeWave + ' completed!');
        title.Active = true;
        setTimeout(() => {
            title.Active = false;
            toggleUpgradeMenu();
        }, 3000);
        removeEnemies();
        generateWave(); //Generated in 'spaceinvaders_waves.js'
    }
    function initiateWave(){
        title.SetText('Get ready for wave ' + (activeWave + 1));
        title.Active = true;     
        setTimeout(() => {
            title.Active = false;
            beginWave();            
            menuDisallowed = false;
        }, 3000);
    }
    function beginWave(){
        timerStart();
        decreaseEnemyFireRate();
        enemyCount = 0;
        const currentWave = wave[activeWave - startWave];
        enemyStartX = gameBoardObj.left;
        enemyStartY = gameBoardObj.top;
        for (let i = 0; i < currentWave.rows.length; i++) {
            const row = currentWave.rows[i];
            createEnemies(
                    row.hCount,
                    row.vCount,
                    row.width,
                    row.height,
                    row.strength,
                    row.color,
                    currentWave.moveSpeed,
                    currentWave.bulletSpeed,
                    currentWave.bulletPower
                );
        }
        activeWave++;
    }
    function endOfWaveGold(time){
        let amount = Math.ceil((goldBonusFactor / time) * (player.gold / goldBonusFactor));
        player.AddGold(amount);
    }
    //#endregion Wave
    
    //#region Enemies
    function createEnemies(horizontalSpawns, verticalSpawns, enemyWidth, enemyHeight, strength, color, moveSpeed, bulletSpeed, bulletPower){
        let clusterWidth = (enemyWidth + enemyXSpacing) * horizontalSpawns - enemyXSpacing;
        if (totalEnemyWidth) {
            totalEnemyWidth = Math.max(totalEnemyWidth, clusterWidth);
        } else {
            totalEnemyWidth = clusterWidth;
        }
        let enemyDrawXLeft = (gameBoardObj.width - clusterWidth) / 2;
        let enemyDrawYTop = enemyStartY;
        enemyMoveDistance = (gameBoardObj.width - totalEnemyWidth - enemyStartX * 2) / 2;
        for (let x = 0; x < horizontalSpawns; x++) {
            for (let y = 0; y < verticalSpawns; y++) {
                const enemy = new Enemy(gameBoardObj, moveSpeed, enemyWidth, enemyHeight, strength, color, '#c30', bulletSpeed, bulletPower, 0);
                const xPos = enemyDrawXLeft + enemyWidth / 2 + (enemyWidth + enemyXSpacing) * x;
                const yPos = enemyDrawYTop + enemyHeight / 2 + (enemyHeight + enemyYSpacing) * y;
                enemyStartY = yPos + enemyHeight / 2 + enemyYSpacing;
                enemy.Set(1, xPos, yPos);
                enemies.push(enemy);
                enemyCount++;
            }
        }
    }
    function removeEnemies(){
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            enemy.Remove();
        }
        enemies = [];
    }
    function moveEnemies(){
        let atLeft = false;
        let atRight = false;
        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            if (enemy.isActive) {
                if (enemy.spaceShip.x() > enemy.xStartPos + enemyMoveDistance) {
                    enemyDirection = -1;
                    atRight = true;
                }
                if (enemy.spaceShip.x() < enemy.xStartPos - enemyMoveDistance) {
                    enemyDirection = 1;
                    atLeft = true;
                }
                enemy.spaceShip.dx(enemy.speed * enemyDirection * deltaTime);

                //Check if the enemy hit the player
                if ((player.strength > 0 && enemyCollision(enemy, player)) ||
                    enemy.spaceShip.y() + enemy.height >= gameBoardObj.height) {
                    //Game over. The enemy hit the player.
                    hitScreenEffect();
                    player.Hit(player.strength);
                    player.UpdateUI();
                    hitEffect(player.spaceShip, 240, '#f77');
                    playerDirection = 0;
                    player.Deactivate();
                    gameOver();
                }
            }
        }
        if (atRight) {
            moveEnemiesDown();
        }
        if (atLeft) {
            moveEnemiesDown();
            increaseEnemiesSpeed();
        }
    }
    function moveEnemiesDown(){
        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            if (enemy.isActive) {
                enemy.spaceShip.dy(20);
            }
        }
    }
    function increaseEnemiesSpeed(){
        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            if (enemy.isActive) {
                enemy.speed += enemySpeedIncrease;
            }
        }
    }
    function enemyShootInterval(){
        enemyShotInterval = setInterval(enemyShoot, randomBetween(0.8, 1.2, false) * enemyFireRate);
    }
    function decreaseEnemyFireRate(){
        enemyFireRate -= enemyFireRateDecreaseValue;
        if (enemyFireRate < enemyFireRateMin) {
            enemyFireRate = enemyFireRateMin;
        }
        restartEnemyShootInterval();
    }
    function restartEnemyShootInterval(){
        clearInterval(enemyShotInterval);
        enemyShotInterval = setInterval(enemyShoot, randomBetween(0.8, 1.2, false) * enemyFireRate);
    }
    function resetEnemyFireRate(){
        enemyFireRate = enemyStartFireRate;
    }
    function enemyShoot(){
        if (enemies.length > 0) {
            let activeEnemies = [];
            for (let i = 0; i < enemies.length; i++) {
                const activeEnemy = enemies[i];
                if (activeEnemy.isActive) {
                    activeEnemies.push(activeEnemy);
                }
            }
            let activeEnemyLength = activeEnemies.length;
            let rnd = Math.floor(Math.random() * activeEnemyLength);
            rnd = Math.min(rnd, activeEnemyLength - 1);
            const enemy = activeEnemies[rnd];
            fireBullet(enemy);
        }
    }
    //#endregion Enemies

    //#endregion Functions
    /************************************************************************************************************************/


    /************************************************************************************************************************/
    //#region Game engine
    /************************************************************************************************************************/

    function update(){
        playerController();
        moveEnemies();
        moveRoundObjects(goldCoins);
        moveRoundObjects(mines);

        if (fireKeyDown && player.canFire) {
            fireBullet(player);
        }
        
        moveBullets();
    }

    let lastTime;
    let animFrame;
    let deltaTime;
    let engineActive = true;

    function startEngine(timeStamp) {
        if (engineActive) {
            if (lastTime) {
                deltaTime = (timeStamp - lastTime) / 1000;
                update(); // call update and pass delta time in seconds
            }
            lastTime = timeStamp;
            animFrame = requestAnimationFrame(startEngine);
        }
    }
    function setEngineState(isActive){
        if (isActive) {
            engineActive = true;
            lastTime = 0;
            startEngine();
        } else {
            engineActive = false;
            cancelAnimationFrame(animFrame);
        }
    }

    let startTime;
    let endTime;
    let timer;
    let timerActive = false;
    let tick = 0;

    function timerStart(){
        startTime = new Date();
        player.ResetTimer();
        timerActive = true;
        tick = 0;
        timer = setInterval(function(){
            if (timerActive) {
                tick++;
                if (tick % 100 == 0) {
                    player.UpdateTimer();
                }
                if (tick % enemyStealGoldInterval == 0) {
                    player.SpendGold(1);
                }
            }
        }, 10);
    };
    
    function timerEnd(){
        clearInterval(timer);
        endTime = new Date();
        let timeDiff = (endTime - startTime) / 1000;
        let sec = Math.round(timeDiff);
        return sec;
    }

    //#endregion Game engine
    /************************************************************************************************************************/
})