$(document).ready(function () {
    // my code here

    // Fighter class.  This will be used to create all of the fighters(objects) in the game
    // http://jsfiddle.net/alex_netkachov/ZgBrK/ check this out for model view controller example
    class Fighter {
        constructor(name, health, attackPwr, counterAttackPwr) {
            this.name = name;
            this.health = health;
            this.attackPwr = attackPwr;
            this.basePwr = attackPwr;
            this.counterAttackPwr = counterAttackPwr;
        }
        attack(oponent) {
            oponent.hit(this.attackPwr);
            this.attackPwr += this.basePwr;
        }
        couterAttack(oponent) {
            oponent.hit(this.counterAttackPwr);
        }
        hit(damage) {
            this.health -= damage;
        }
        isAlive() {
            return (this.health > 0)
        }
    }

    // functions here
    function buildFighterCard(name, health, attack, counter, imgPath) {
        var $card = $('<div>').addClass('fighter');
        var $title = $('<div>').addClass('title').text(name);
        var $img = $('<img>').addClass("head-shot").attr("src", imgPath);
        var $health = $('<div>').addClass("stat health");
        $health.html('Health: <span class="healthValue">' + health + '</span>');
        var $attack = $('<div>').addClass("stat attackPower");
        $attack.html('Attack Power: <span class="attackValue">' + attack + '</span>');
        var $counter = $('<div>').addClass("stat counterAttackPower");
        $counter.html('Counter Attack Power: <span class="couterValue">' + counter + '</span>');
        $card.append($title).append($img).append($health).append($attack).append($counter);
        return $card
    }


    // global variables here



    // jquery element variables here



    // click listeners here



    // main process
    var $lukeElement = buildFighterCard('Luke Skywalker', 180, 18, 10, "holder.js/300x200");
    $('#selectionArea').append($lukeElement);



});