class BaseCharacter {
  constructor(name, hp, ap) {
    this.name = name;
    this.hp = hp;
    this.maxHp = hp;
    this.ap = ap;
    this.alive = true;
  }
  attack(character, damage) {
    if (this.alive == false) {
      return;
    }
    character.getHurt(damage);
  }
  //恢復HP
  getheal(heal) {
    var _this = this;
    var i = 1;
    this.hp = this.hp + heal;
    _this.id = setInterval(function () {

      if (i == 1) {
        _this.element.getElementsByClassName("effect-image")[0].style.display = "block";
        _this.element.getElementsByClassName("heal-text")[0].classList.add("healed");
        _this.element.getElementsByClassName("heal-text")[0].textContent = heal;
      }
      _this.element.getElementsByClassName("effect-image")[0].src = 'images/effect/heal/' + i + '.png';
      i++;
      if (i > 8) {
        _this.element.getElementsByClassName("effect-image")[0].style.display = "none";
        _this.element.getElementsByClassName("heal-text")[0].classList.remove("healed");
        _this.element.getElementsByClassName("heal-text")[0].textContent = "";
        clearInterval(_this.id);
      }


    }, 50);
  }

  getHurt(damage) {
    var _this = this;
    var i = 1;
    this.hp -= damage;
    if (this.hp <= 0) {
      this.die();
    }

    _this.id = setInterval(function () {

      if (i == 1) {
        _this.element.getElementsByClassName("effect-image")[0].style.display = "block";
        _this.element.getElementsByClassName("hurt-text")[0].classList.add("attacked");
        _this.element.getElementsByClassName("hurt-text")[0].textContent = damage;
      }

      _this.element.getElementsByClassName("effect-image")[0].src = 'images/effect/blade/' + i + '.png';
      i++;

      if (i > 8) {
        _this.element.getElementsByClassName("effect-image")[0].style.display = "none";
        _this.element.getElementsByClassName("hurt-text")[0].classList.remove("attacked");
        _this.element.getElementsByClassName("hurt-text")[0].textContent = "";
        clearInterval(_this.id);
      }
    }, 50);
  }

  die() {
    this.alive = false;
  }
  //血條更新
  updateHtml(hpElement, hurtElement) {
    hpElement.textContent = this.hp;
    hurtElement.style.width = (100 - this.hp / this.maxHp * 100) + "%";
  }
}

class Hero extends BaseCharacter {
  constructor(name, hp, ap) {
    super(name, hp, ap);

    this.element = document.getElementById("hero-image-block");
    this.hpElement = document.getElementById("hero-hp");
    this.maxHpElement = document.getElementById("hero-max-hp");
    this.hurtElement = document.getElementById("hero-hp-hurt");

    this.hpElement.textContent = this.hp;
    this.maxHpElement.textContent = this.maxHp;

    console.log("召喚英雄 " + this.name + "！");
  }
  attack(character) {
    var damage = Math.random() * (this.ap / 2) + (this.ap / 2);
    super.attack(character, Math.floor(damage));
  }
  getHurt(damage) {
    super.getHurt(damage);
    this.updateHtml(this.hpElement, this.hurtElement);
  }
  getheal(heal) {
    if (this.hp >= 100) {
      heal = this.maxHp - this.hpElement.textContent;
      super.getheal(heal);
    } else {
      heal = 30;
      super.getheal(heal);
    }

    this.updateHtml(this.hpElement, this.hurtElement);
  }
}

class Monster extends BaseCharacter {
  constructor(name, hp, ap) {
    super(name, hp, ap);

    this.element = document.getElementById("monster-image-block");
    this.hpElement = document.getElementById("monster-hp");
    this.maxHpElement = document.getElementById("monster-max-hp");
    this.hurtElement = document.getElementById("monster-hp-hurt");

    this.hpElement.textContent = this.hp;
    this.maxHpElement.textContent = this.maxHp;

    console.log("遇到怪獸 " + this.name + "了！");
  }
  attack(character) {
    var damage = Math.random() * (this.ap / 2) + (this.ap / 2);
    super.attack(character, Math.floor(damage));
  }
  getHurt(damage) {
    super.getHurt(damage);
    this.updateHtml(this.hpElement, this.hurtElement);
  }
}

var rounds = 10;
var hero = new Hero("Bernard", 130, 30);
var monster = new Monster("Skeleton", 130, 10);

function endTurn() {
  rounds--;
  document.getElementById("round-num").textContent = rounds;
  if (rounds < 1) {
    finish();
  }
}

function heroAttack() {
  // Hero 選技能時觸發回合開始
  document.getElementsByClassName("skill-block")[0].style.display = "none";

  setTimeout(function () {
    hero.element.classList.add("attacking");
    setTimeout(function () {
      hero.attack(monster);
      hero.element.classList.remove("attacking");
    }, 500);
  }, 100);

  setTimeout(function () {
    if (monster.alive) {
      monster.element.classList.add("attacking")
      setTimeout(function () {
        monster.attack(hero);
        monster.element.classList.remove("attacking");
        endTurn();
        if (hero.alive == false) {
          finish();
        } else {
          document.getElementsByClassName("skill-block")[0].style.display = "block";
        }
      }, 500);
    } else {
      finish();
    }
  }, 1100);
}
//點擊恢復後開始的動作
function heroHeal() {
  document.getElementsByClassName("skill-block")[0].style.display = "none";

  setTimeout(function () {
    hero.getheal(heal);
  }, 100);

  setTimeout(function () {
    if (monster.alive) {
      monster.element.classList.add("attacking")
      setTimeout(function () {
        monster.attack(hero);
        monster.element.classList.remove("attacking");
        endTurn();
        if (hero.alive == false) {
          finish();
        } else {
          document.getElementsByClassName("skill-block")[0].style.display = "block";
        }
      }, 500);
    } else {
      finish();
    }
  }, 500);

}
//取得發動攻擊按鈕的 element
function addSkillEvent() {
  var skill = document.getElementById("skill");
  skill.onclick = function () {
    heroAttack();
  }
}

//取得發動恢復按鈕的 element
function addhealEvent() {
  var heal = document.getElementById("heal");
  heal.onclick = function () {
    heroHeal();
  }
}
addSkillEvent();
addhealEvent();

function finish() {
  var dialog = document.getElementById("dialog")
  dialog.style.display = "block";
  if (monster.alive == false) {
    dialog.classList.add("win");
  } else {
    dialog.classList.add("lose");
  }
}

//新增鍵盤事件 A:攻擊，D恢復血量
document.onkeyup = function(event) {
    var key = String.fromCharCode(event.keyCode);
    if (key == "A") {
       heroAttack();
    }
    else if(key == "D"){
        heroHeal();
    } 
  }

