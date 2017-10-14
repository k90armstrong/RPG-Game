$(document).ready(function () {
    // my code here

    // Fighter class.  This will be used to create all of the fighters(objects) in the game
    // http://jsfiddle.net/alex_netkachov/ZgBrK/ check this out for model view controller example
    class Fighter {
        constructor(name, health, attackPwr, counterAttackPwr) {
            this.originalHealth = health;
            this.originalAttackPower = attackPwr;
            this.name = name;
            this.health = health;
            this.attackPwr = attackPwr;
            this.basePwr = attackPwr;
            this.counterAttackPwr = counterAttackPwr;
        }
        addView($view) {
            // can use .find(selector) in jquery to get a decendant of an element
            this.$view = $view;
        }
        attack(oponent) {
            oponent.hit(this.attackPwr);
            this.attackPwr += this.basePwr;
        }
        couterAttack(oponent) {
            oponent.hit(this.counterAttackPwr);
        }
        hit(damage) {
            this.health = Math.max(0, this.health - damage);
        }
        isAlive() {
            return (this.health > 0)
        }
        updateStats() {
            this.$view.find('.attackValue').text(this.attackPwr);
            this.$view.find('.healthValue').text(this.health);
        }
        resetFighter() {
            this.health = this.originalHealth;
            this.attackPwr = this.originalAttackPower;
            this.updateStats();
            this.$view.css('opacity', '1');
        }
    }

    // functions here
    function buildFighterCard(name, health, attack, counter, imgPath) {
        var $card = $('<div>').addClass('fighter').attr('data-name', name);
        var $title = $('<div>').addClass('title').text(name);
        var $img = $('<img>').addClass("head-shot").attr("src", imgPath);
        $img.css('display', 'block');
        var $health = $('<div>').addClass("stat health");
        $health.html('Health: <span class="healthValue">' + health + '</span>');
        var $attack = $('<div>').addClass("stat attackPower");
        $attack.html('Attack Power: <span class="attackValue">' + attack + '</span>');
        var $counter = $('<div>').addClass("stat counterAttackPower");
        $counter.html('Counter Attack Power: <span class="couterValue">' + counter + '</span>');
        $card.append($title).append($img).append($health).append($attack).append($counter);
        return $card
    }

    function fadeIn($element, cb) {
        $element.css({
            opacity: '0'
        });
        $element.removeClass('display-none').animate({
            opacity: '1'
        }, 500).promise().done(function () {
            if (cb) {
                return cb()
            }
            return undefined
        });
    }

    function fadeOut($element, cb) {
        $element.css({
            opacity: '1'
        });
        $element.animate({
            opacity: '0'
        }, 500).promise().done(function () {
            if (cb) {
                return cb()
            }
            return undefined
        });
    }

    function fighterHit($element, cb) {
        $element.addClass('animated wobble');
        setTimeout(function () {
            $element.removeClass('animated wobble');
            return cb();
        }, 1000);
    }

    function getFighter($element) {
        for (var i = 0; i < fighters.length; i++) {
            if ($element.attr('data-name') === fighters[i].name) {
                return fighters[i]
            }
        }
    }

    function changeToStartFight() {
        $yourFigtherSection.find('.section-title').text('Your Character');
        for (var i = 0; i < fighters.length; i++) {
            if (fighters[i] !== userCharacter) {
                // move to enemies left section
                console.log(fighters[i]);
                oponents.push(fighters[i]);
                var v = fighters[i].$view.detach();
                $enemiesLeftSection.append(v);
            }
        }
        showUserWeapon();
        fadeIn($enemiesLeftSection);
        fadeIn($yourFigtherSection);
    }

    function moveFighterToArena($fighter) {
        fadeOut($fighter, function () {
            $yourFigtherSection.append($fighter.detach());
            showOponentWeapon();
            $fighter.addClass('right');
            fadeIn($oponentLabel);
            fadeIn($fighter);
        });
    }

    function showUserWeapon() {
        $userWeapon = $('<div>').addClass("weapon-container");
        var $img = $('<img>').attr('src', "assets/images/gun.jpg").addClass('weapon');
        $userWeapon.on('click', userFiresWeapon);
        $userWeapon.append($img);
        $yourFigtherSection.append($userWeapon);
        fadeIn($userWeapon);
    }

    function showOponentWeapon() {
        $oponentWeapon = $('<div>').addClass("oponent-weapon-container right");
        var $img = $('<img>').attr('src', "assets/images/gun.jpg").addClass('weapon');
        $oponentWeapon.append($img);
        $yourFigtherSection.append($oponentWeapon);
        fadeIn($oponentWeapon);
    }

    function oponentFiresWeapon() {
        otherLaserSound.play();
        currentOponent.couterAttack(userCharacter);
        userCharacter.updateStats();
        fighterHit(userCharacter.$view, function () {
            console.log('user hit!');
            notInLastAttack = true;
            if (!userCharacter.isAlive()) {
                // user loses
                showLoserModal();
                console.log('you lost!');
                userWon = false;
                // change to show the loser screen
            }
        });

    }

    function allDead() {
        // check to see if the oponents are dead
        for (var i = 0; i < oponents.length; i++) {
            if (oponents[i].isAlive()) {
                return false
            }
        }
        return true
    }

    function showWinnerModal() {
        console.log('open winner modal');
        $modalHeader.text(winMessage);
        fadeIn($modal);
    }

    function showLoserModal() {
        $modalHeader.text(loseMessage);
        fadeIn($modal);
    }

    function userFiresWeapon() {
        laserSound.play();
        if (inFight && notInLastAttack) {
            notInLastAttack = false;
            userCharacter.attack(currentOponent);
            currentOponent.updateStats();
            fighterHit(currentOponent.$view, function () {
                if (!currentOponent.isAlive()) {
                    // oponent is dead
                    notInLastAttack = true;
                    inFight = false;
                    fadeOut($oponentWeapon, function () {
                        $oponentWeapon.remove();
                    });
                    fadeOut(currentOponent.$view, function () {
                        currentOponent.$view.detach();
                        currentOponent = undefined;
                        // check if all oponenets are dead
                        if (allDead()) {
                            // change to show the winner screen
                            userWon = true;
                            showWinnerModal();
                        }
                    });
                } else {
                    oponentFiresWeapon();
                }
            });
        }

    }


    // global variables here
    var luke = new Fighter('Luke Skywalker', 10, 18, 10);
    var $lukeElement = buildFighterCard(luke.name, luke.health, luke.attackPwr, luke.counterAttackPwr, "assets/images/luke.JPG");
    $('#selectionArea').append($lukeElement);
    luke.addView($lukeElement);
    var c3po = new Fighter('C3PO', 180, 18, 10);
    var $c3poElement = buildFighterCard(c3po.name, c3po.health, c3po.attackPwr, c3po.counterAttackPwr, "assets/images/c3po.jpg");
    $('#selectionArea').append($c3poElement);
    c3po.addView($c3poElement);
    var darthVader = new Fighter('Darth Vader', 180, 18, 10);
    var $darthvaderElement = buildFighterCard(darthVader.name, darthVader.health, darthVader.attackPwr, darthVader.counterAttackPwr, "assets/images/darth-vader.png");
    $('#selectionArea').append($darthvaderElement);
    darthVader.addView($darthvaderElement);
    var yoda = new Fighter('Yoda', 180, 18, 10);
    var $yodaElement = buildFighterCard(yoda.name, yoda.health, yoda.attackPwr, yoda.counterAttackPwr, "assets/images/yoda.jpg");
    $('#selectionArea').append($yodaElement);
    yoda.addView($yodaElement);

    var startOfGame = true;
    var inFight = false;
    var fighters = [luke, c3po, darthVader, yoda];
    var userCharacter;
    var currentOponent;
    notInLastAttack = true;
    var userWon;
    var oponents = [];
    var winMessage = 'Congratulations! You have won! You are a true Jedi!';
    var loseMessage = 'It looks like the Darkside was too powerful for you, but you can test your skills again!'

    // jquery element variables here
    var $yourFigtherSection = $('#selectionArea');
    var $enemiesLeftSection = $('#enemiesLeft');
    var $fightSection = $('#fightSection');
    var $attackButton = $('#attackButton');
    var $oponentLabel = $('.oponent-title');
    var $oponentWeapon;
    var $userWeapon;
    var $modal = $('.modal');
    var $modalHeader = $('.modal-header');
    var $playArea = $('#playArea');

    // sounds
    var laserSound = new Audio('assets/sounds/Laser Blaster.mp3');
    var otherLaserSound = new Audio('assets/sounds/Laser Blast2.mp3');

    // click listeners here
    $('.fighter').on('click', function () {
        if (startOfGame) {
            startOfGame = false;
            userCharacter = getFighter($(this));
            fadeOut($yourFigtherSection, changeToStartFight);
        } else if (!inFight && getFighter($(this)) !== userCharacter) {
            // user can pick a new oponent
            currentOponent = getFighter($(this));
            inFight = true;
            moveFighterToArena(currentOponent.$view);
        } else {
            // do nothing
        }
        console.log(userCharacter);
        console.log(currentOponent);
    });

    $('#playAgainButton').on('click', function () {
        inFight = false;
        startOfGame = true;
        oponents = [];

        fadeOut($playArea, function () {
            // move all fighters to the selection area
            for (var i = 0; i < fighters.length; i++) {
                fighters[i].$view.removeClass('right');
                fighters[i].resetFighter();
                var $fi = fighters[i].$view.detach();
                // $fi.removeClass('right');
                $yourFigtherSection.append($fi);
            }
            // remove the oponent label
            $oponentWeapon.remove();
            $userWeapon.remove();
            $oponentLabel.addClass('display-none');
            $enemiesLeftSection.addClass('display-none');
            $modal.addClass('display-none');
            $yourFigtherSection.find('.section-title').text('Select Your Fighter');
            fadeIn($playArea);
        });

    });


    // main process
    // wait 5 sesonds and bring in the choose your fighter
    setTimeout(function () {
        fadeIn($yourFigtherSection);
    }, 500);

});