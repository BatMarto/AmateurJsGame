
// game screens
const gameStart = document.querySelector('.game-start');
const gameArea = document.querySelector('.game-area');
const gameOver = document.querySelector('.game-over');
const gameScore = document.querySelector('.game-score');
const gamePoints = document.querySelector('.points');


// game start listener
    gameStart.addEventListener('click', onGameStart)

// game start function
function onGameStart(){
    gameStart.classList.add('hide');
    const wizard = document.createElement('div');

// render wizard
    wizard.classList.add('wizard');
    wizard.style.top = player.y + 'px';
    wizard.style.left = player.x + 'px';
    gameArea.append(wizard);

    player.width = wizard.offsetWidth;
    player.height = wizard.offsetHeight;

    // game infinite loop
    window.requestAnimationFrame(gameAction);
}

// global key listeners
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

let keys = {};
let player = {
    x: 50,
    y: 200,
    width: 0,
    height: 0,
    lastTimeFiredBall: 0
};
let game = {
    speed: 2,
    movingMultiplier: 4,
    fireBallMultiplier: 5,
    fireInterval: 600,
    cloudSpawnInvterval: 3000,
    bugSpawnInterval: 1000,
    bugKillBonus: 1500
};

let scene = {
    score: 0,
    lastCloudSpawn: 0,
    lastBugSpawn: 0,
    isActiveGame: true
};

// key handlers

function onKeyDown(e){
    keys[e.code] = true;
    console.log(keys);
}

function onKeyUp(e){
    keys[e.code] = false;    
    console.log(keys);
}
// Collision Function
function isCollision(firstElement, secondElement){
    let firstRect = firstElement.getBoundingClientRect();
    let secondRect = secondElement.getBoundingClientRect();
    
    return !(firstRect.top > secondRect.bottom ||
        firstRect.bottom < secondRect.top ||
        firstRect.right < secondRect.left ||
        firstRect.left > secondRect.right);
}

function gameIsOver(){
    scene.isActiveGame = false;
    gameOver.classList.remove('hide');
    
}

function addFireBall(){
    let fireBall = document.createElement('div');
    fireBall.classList.add('fire-ball');

    fireBall.style.top = (player.y + player.height / 3 - 5) + 'px';
    fireBall.x = player.x + player.width;
    fireBall.style.left = fireBall.x + 'px';
    gameArea.appendChild(fireBall);
}

function gameAction(timestamp){
    
   const wizard = document.querySelector('.wizard');
    //Score count 
    scene.score++;
 
        // Add Clouds 
        if(timestamp - scene.lastCloudSpawn > game.cloudSpawnInvterval + 2000 * Math.random()){
        let cloud = document.createElement('div');
        cloud.classList.add('cloud');
        cloud.x = gameArea.offsetWidth - 160;
        cloud.style.left = cloud.x + 'px';
        cloud.style.top = (gameArea.offsetHeight - 200) * Math.random() + 'px';
        gameArea.appendChild(cloud);
        scene.lastCloudSpawn = timestamp;
        }
        // Modify cloud movement
        let clouds = document.querySelectorAll('.cloud');
        clouds.forEach(c =>{
            c.x -= game.speed;
            c.style.left = c.x + 'px';

            if(c.x + clouds.offsetWidth <= 0){
                c.parentElement.remove(c);
                
            }
        })

        // add Bugs
        if(timestamp - scene.lastBugSpawn > game.bugSpawnInterval + 5000 * Math.random()){
            let bug = document.createElement('div');
            bug.classList.add('bug');
            bug.x = gameArea.offsetWidth - 60;
            bug.style.left = bug.x + 'px';
            bug.style.top = (gameArea.offsetHeight - 60) * Math.random() + 'px';
            gameArea.appendChild(bug);
            scene.lastBugSpawn = timestamp;

        }
        

    // modify bug position
    let bugs = document.querySelectorAll('.bug');
    bugs.forEach(bug => {
        bug.x -= game.speed * 3;
        bug.style.left = bug.x + 'px';
        if(bug.x + bugs.offsetWidth <= 0){
            bug.parentElement.removeChild(bug);
        }
    })




    // Apply gravitation
    let isInAir = (player.y + player.height) <= gameArea.offsetHeight;
    if(isInAir){
            player.y += game.speed;
        }
    if(keys.ArrowDown && isInAir){
        player.y += game.speed;
    }
    
    // Modify fireball positions
    let fireBalls = document.querySelectorAll('.fire-ball');
    
    fireBalls.forEach(ball => {
        ball.x += game.speed * game.fireBallMultiplier;
        ball.style.left = ball.x + 'px';

        if(ball.x + ball.offsetWidth > gameArea.offsetWidth){
            ball.parentElement.removeChild(ball);
        
        }
    });

    // register user input
    if(keys.ArrowUp && player.y > 0){
        player.y -= game.speed * game.movingMultiplier;
    }

    if(keys.ArrowDown && player.y + player.height < gameArea.offsetHeight){
        player.y += game.speed * game.movingMultiplier;
    }

    // if(keys.ArrowLeft && player.x > 0){
    //     player.x -= game.speed * game.movingMultiplier;
    // }

    // if(keys.ArrowRight && player.x + player.width < gameArea.offsetWidth){
    //     player.x += game.speed * game.movingMultiplier;
    // }
    // Fire shooting 
    if(keys.Space && timestamp - player.lastTimeFiredBall > game.fireInterval){
        addFireBall(player);
        player.lastTimeFiredBall = timestamp;
        

    }
    // Collision Detection
    bugs.forEach(bug => {
        if(isCollision(wizard,bug)){
            gameIsOver();
        }
        fireBalls.forEach(fireball => {
            if(isCollision(fireball, bug)){
                scene.score += game.bugKillBonus;
                bug.parentElement.removeChild(bug);
                fireball.parentElement.removeChild(fireball);
            }
        })
    });

    


    // apply movement
    wizard.style.top = player.y + 'px';
    wizard.style.left = player.x + 'px';

    // apply score
    gamePoints.textContent = scene.score;
    
    // Chech for GameEnd
    if(scene.isActiveGame){
        window.requestAnimationFrame(gameAction);
    }

}





