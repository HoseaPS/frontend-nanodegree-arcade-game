// variavel para saber qual é o estado atual do game
var gameIsEnded = false;
var Helper = function(){}
Helper.prototype.ramdomPosiY = function(){

		// irá gerar um numero aleatorio entre 0 e 606 avançando de 101 em 101
		// ou seja n1=0 n2=101 n3=202 etc...
		// como todas as imagens possuem 101 de largura
		// ira sempre criar um padrao de largura que caiba nos blocos
		return 101 * (Math.floor(Math.random() * 7));
}
Helper.prototype.ramdomSpeed = function(){

		// gerando um numero aleatorio entre 1 e 200
		return 40 * Math.floor(Math.random() * 5 + 1);
}

// Enemies our player must avoid
var Enemy = function(posiY) {

		// Variables applied to each of our instances go here,
		// we've provided one for you to get started
		this.x = -90;
		this.y = posiY;
		this.speed = myHelper.ramdomSpeed();

		// The image/sprite for our enemies, this uses
		// a helper we've provided to easily load images
		this.sprite = 'images/enemy-bug.png';
};
Enemy.prototype.checkForCollision = function() { 

		// numero negativo para dar o efeito de choque
		// pois o inimigo "deve ser renderizado para tras" e 
		// nao de x para frente.
		var enemyLimitLeftX = this.x - 85;

		// como há um pequeno espaço entre o comeco da imagem e o comeco
		// da cabeca do player (mais ou menos 15px) 
		// setei para o limite direito do inimigo ser menor que a largura da imagem
		var enemyLimitRightX = this.x + 85;
		var enemyLimitTopY = this.y;
		var enemyLimitBottomY = this.y + 80;

		// condicao para verificar nao apenas o impacto em x
		// mas tambem verifica se o impacto x é na mesma reta que y
		if (player.x > enemyLimitLeftX && player.x < enemyLimitRightX && player.y > enemyLimitTopY && player.y < enemyLimitBottomY) {
				player.resetPosi();	
				player.die();			
		}  
};
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {

		// You should multiply any movement by the dt parameter
		// which will ensure the game runs at the same speed for
		// all computers.
		this.x += this.speed * dt;

		// depois que o inimigo percorrer um numero maior que 
		// a largura do canvas volta para uma posicao
		// antes do canvas comecar para ter um efeito de estar
		// entrando e saindo no canvas
		if (this.x > ctx.canvas.width) {
				this.x = -90;			
				this.speed = myHelper.ramdomSpeed();		
		}
		this.checkForCollision();
}
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function (dt){
		this.x = 304;
		this.y = 570;

		// atrelar o movimento a um estado de posicao
		// facilita a checagem de colisao entre pedras
		this.status = 'stop';
		this.level = 1;
		this.sprite = 'images/char-boy.png';
		this.life = 3;
		this.lifeSprite = 'images/Heart.png';
};
Player.prototype.update = function(dt) {
		this.move(dt);

		// se estiver na agua é porque morreu
		if(this.status === 'onTheWater'){
				this.resetPosi();
				player.die();
		}

		// se o numero de vidsas é igual a 0, o jogo acaba
		if (this.life === 0) {
				gameIsEnded = true;
		}
}
Player.prototype.die = function(dt) {
		if (this.life > 0) {
			this.life -= 1;
		} 
}
// reseto tudo, inclsuive posicao das pedras
// chave e portal
Player.prototype.resetPosi = function () {
		this.x = 304;
		this.y = 570;
		key.resetPosi();
		door.resetPosi();
		for (var i = 0; i < allStones.length; i++) {
				allStones[i].resetPosi();
		}
		this.status = "stop"
}
Player.prototype.render = function () {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
		ctx.font = '36px Arial';
		ctx.fillStyle = 'black';
		ctx.fillText('Level: ' + this.level, 0, 30);
		var x = ctx.canvas.width - 120;
		for (var i = 0; i < this.life; i++) {
			ctx.drawImage(Resources.get(this.lifeSprite), x, 0);
			x = x + 40;
		}
}

// como preciso saber de alguma forma quando o player for se mover
// para caso tenha uma pedra eu possa parar seu movimento
// preciso ter outro método pra de fato mover meu player
// metodo tal implementado no metodo 'move'
Player.prototype.handleInput = function(key) { 
		switch (key) {
				case 'left':       
						if (this.x > 0 && this.status) {
								this.status = 'movingToLeft';               
						}
						break;   
				case "right":
						if (this.x < ctx.canvas.width - 100) {
								this.status = 'movingToRight';                
						}
						break;
				case "up":
						if (this.y < 82) {
								this.status = 'movingToWater';               
						} else if (this.y > 0) {
								this.status = 'movingToUp';
						}
						break;  
				case "down":
						if (this.y < ctx.canvas.height - 200) {
								this.status = 'movingToDown';      
						}
						break;   
		}
}
Player.prototype.move = function(dt) { 
		switch (player.status) {
				case ('movingToLeft'):
						this.x -= 101.5;
						this.status = 'stop';
						break;
				case ('movingToRight'):
						this.x += 101.5;
						this.status = 'stop';
						break;
				case ('movingToUp'):
						this.y -= 83;
						this.status = 'stop';
						break;
				case ('movingToDown'):
						this.y += 83;
						this.status = 'stop';
						break;
				case ('movingToWater'):
						this.y += 83;
						this.status = 'onTheWater';
						break;                
		}
}

var Stone = function (y) {
		this.x = myHelper.ramdomPosiY();
		this.y = y;
		this.sprite = 'images/Rock.png';
};
Stone.prototype.update = function(dt) {
		this.checkForCollision();
}
Stone.prototype.checkForCollision = function () {
		var stoneLimitLeftX = this.x - 90;
		var stoneLimitRightX = this.x + 90;
		var stoneLimitTopY = this.y;
		var stoneLimitBottomY = this.y + 90;

		// subtraio e adiciono a posicao do player na condição
		// para impedi-lo antes que possa se mover
		switch (player.status) {
				case ('movingToLeft'):
						if (player.x > stoneLimitLeftX && player.x - 101.5 < stoneLimitRightX && player.y > stoneLimitTopY && player.y < stoneLimitBottomY) {
								player.status = "stop";
						}
						break;
				case ('movingToRight'):
						if (player.x + 101.5 > stoneLimitLeftX && player.x < stoneLimitRightX && player.y > stoneLimitTopY && player.y < stoneLimitBottomY) {
								player.status = "stop";
						}
						break;
				case ('movingToUp'):
						if (player.x > stoneLimitLeftX && player.x < stoneLimitRightX && player.y > stoneLimitTopY && player.y - 83 < stoneLimitBottomY) {
								player.status = "stop";
						}
						break;
				case ('movingToDown'):
						if (player.x > stoneLimitLeftX && player.x < stoneLimitRightX && player.y + 83 > stoneLimitTopY && player.y < stoneLimitBottomY) {
								player.status = "stop";
						}
						break;                
		}
}
Stone.prototype.resetPosi = function () {
		this.x = myHelper.ramdomPosiY();
}
Stone.prototype.render = function () {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var Key = function(posiY) {
		this.x = myHelper.ramdomPosiY();
		this.y = posiY;
		this.sprite = 'images/Key.png';
		this.status = 'onTheCanvas';
};
Key.prototype.update = function(dt) {
		this.checkForCollision();
}
Key.prototype.checkForCollision = function () {
		var keyLimitLeftX = this.x - 60;
		var keyLimitRightX = this.x + 60;
		var keyLimitTopY = this.y;
		var keyLimitBottomY = this.y + 80;
		if (player.x > keyLimitLeftX && player.x < keyLimitRightX && player.y > keyLimitTopY && player.y < keyLimitBottomY) {
				this.status = 'picked';
		}
}
Key.prototype.resetPosi = function () {
		this.x = myHelper.ramdomPosiY();
		key.status = 'onTheCanvas';
}
Key.prototype.render = function() {
		// quando o player estiver no level 3, a key nao sera renderizada
		if (this.status === 'onTheCanvas' && player.level < 3) {
				ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
		}
} 

var Door = function(posiY) {
		this.x = myHelper.ramdomPosiY();
		this.y = posiY;
		this.sprite = 'images/Selector.png';
};
Door.prototype.update = function (dt) {
		this.checkForEntrance();
}
Door.prototype.resetPosi = function () {
		this.x = myHelper.ramdomPosiY();
}
Door.prototype.checkForEntrance = function () {
		var doorLimitLeftX = this.x - 60;
		var doorLimitRightX = this.x + 60;
		var doorLimitTopY = this.y;
		var doorLimitBottomY = this.y + 80;
		if (player.x > doorLimitLeftX && player.x < doorLimitRightX && player.y > doorLimitTopY && player.y < doorLimitBottomY) {
				if (key.status === 'picked' && player.level < 3) {
						player.level += 1;
						if (player.level === 2) {
								allEnemies.push(new Enemy(145));
								allEnemies.push(new Enemy(230));
								allEnemies.push(new Enemy(312));
								allEnemies.push(new Enemy(395));
								allEnemies.push(new Enemy(480));	
						}		
						if (player.level === 3) {
								allEnemies.push(new Enemy(145));
								allEnemies.push(new Enemy(230));
								allEnemies.push(new Enemy(312));
								allEnemies.push(new Enemy(395));
								allEnemies.push(new Enemy(480));	
						}				
						player.resetPosi();	
						this.status = 'onTheCanvas';
				}
		}
}
Door.prototype.render = function () {
		// quando o player estiver no level 3, o portal nao sera renderizado
		if (player.level < 3) {
				ctx.drawImage(Resources.get(this.sprite), this.x, this.y);            
		}
}

// classe semelhante à da key
// quando pegar a estrela, o jogo acaba
var FinalStar = function(posiY) {
		this.x = myHelper.ramdomPosiY();
		this.y = posiY;
		this.sprite = 'images/Star.png';
};
FinalStar.prototype.update = function (dt) {
		this.checkForCollision();
}
FinalStar.prototype.checkForCollision = function() {
		// só será possivel pega-la no level 3
		if (player.level === 3) {
				var finalStarLimitLeftX = this.x - 60;
				var finalStarLimitRightX = this.x + 60;
				var finalStarLimitTopY = this.y;
				var finalStarLimitBottomY = this.y + 80;
				if (player.x > finalStarLimitLeftX && player.x < finalStarLimitRightX && player.y > finalStarLimitTopY && player.y < finalStarLimitBottomY) {
						gameIsEnded = true;
				}            
		}
		
}
FinalStar.prototype.render = function() {	
		// só será possivel pega-la no level 3
		if (player.level === 3) {
				ctx.drawImage(Resources.get(this.sprite), this.x, this.y);            
		}
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
myHelper = new Helper();
var allEnemies = [new Enemy(145),
									new Enemy(230),
									new Enemy(312),
									new Enemy(395),
									new Enemy(480)];
player = new Player();
var allStones = [new Stone (145), 
									new Stone (230), 
									new Stone (312),
									new Stone (395),
									new Stone (480)];
var key = new Key (62);
var finalStar = new FinalStar (62);
var door = new Door (545);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
		var allowedKeys = {
				37: 'left',
				38: 'up',
				39: 'right',
				40: 'down'
		};

		player.handleInput(allowedKeys[e.keyCode]);
});




