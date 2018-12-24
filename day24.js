const readFile = require('./readFile').readFile;

const runFunctions = (input) => {
    first(input);
    second(input);
}

//23385
const first = (input) => {   
    let winner = iterate(input)
    console.log('First Star: ', winner.reduce((a,c) => a += c.units, 0));
};

//2344
const second = (input) => {
    let boostAmount = 1;
    let winner = iterate(input, boostAmount);
    
    //cycle through in larger amounts
    while (winner[0].type !== 'Immune') {
        boostAmount += 15;
        winner = iterate(input,boostAmount);
    }
    
    //once winning condition is met, try small amounts to find exact value
    let units = winner.reduce((a,c) => a += c.units, 0);
    while (winner[0].type === 'Immune') {
        boostAmount--;
        winner = iterate(input, boostAmount);
        if (winner[0].type === 'Immune') units = winner.reduce((a,c) => a += c.units, 0);
    }
    
    console.log('Second Star: ', units);
};

const iterate = (input, boostAmount=0) => {
    let groups = getGroups(input);
    if (boostAmount > 0) boost(groups, boostAmount);
    return battle(groups);
};

const boost = (groups, amount) => {
    groups.forEach(group => {
        if (group.type === 'Immune') {
            group.damage += amount;
            group.power = group.units * group.damage;
        }
    });
};

const battle = (groups) => {
    let unitsRemain = true;
    let counter = 0;
    while (unitsRemain) {
        counter++;
        targetSelection(groups);
        attackPhase(groups);
        groups = groups.filter(group => group.units > 0);
        let inf = groups.filter(group => group.type === 'Infection' && group.units > 0).length > 0;
        let imm = groups.filter(group => group.type === 'Immune' && group.units > 0).length > 0;
        if (!inf || !imm) unitsRemain = false;
        if (counter > 2000) return [{type:'Infection'}]; //if this goes too high, battle becomes endless, to stop
    }
        
    let inf = groups.filter(group => group.type === 'Infection' && group.units > 0);
    let imm = groups.filter(group => group.type === 'Immune' && group.units > 0);
    let winner = inf.length > 0 ? inf : imm;
    return winner;
};

const attackPhase = (groups) => {    
    groups = groups.sort((a,b) => {
        return b.initiative - a.initiative;
    });
    
    groups.forEach(group => {
        let toAttack = group.toAttack;
        if (toAttack) takeDamage(toAttack, group);
    });
};

const takeDamage = (target, enemy) => {
    let damage = possibleDamage(enemy, target);
    let unitsToKill = parseInt(damage / target.hp);
    if (target.units < unitsToKill) unitsToKill = target.units;
    target.units -= unitsToKill;
    target.power = target.units * target.damage;
};

const targetSelection = (groups) => {
    const chosen = [];
    
    groups = groups.sort((a,b) => {
        if (b.power !== a.power) return b.power - a.power;
        else return b.initiative - a.initiative;
    });
    
    groups.forEach(group => {
        group.toAttack = null;
        let enemies = groups.filter(enemy => enemy.type !== group.type && !chosen.includes(enemy));

        let chosenEnemy;
        let highestDamage = 0;
        enemies.forEach(enemy => {
            let damage = possibleDamage(group, enemy);
                        
            if (damage > highestDamage){
                highestDamage = damage;
                chosenEnemy = enemy;
            }
        });
        
        if (chosenEnemy){
            chosen.push(chosenEnemy);
            group.toAttack = chosenEnemy;
        }
    });
};

const possibleDamage = (a, b) => {
    let damage = a.power;
    if (b.immunities.includes(a.damageType)) damage = 0;
    if (b.weaknesses.includes(a.damageType)) damage *= 2;
    return damage;
};

const getGroups = (input) => {
    const arr = [];
    input.split('\n\n').forEach(system => {
        let groups = system.split('\n');
        let type = groups.shift().replace(/( System)?:/, '');
        groups.forEach((line,id) => {
            let values = line.match(/[0-9]+/g).map(Number);
            let weak = /weak to ([a-z ,]+)/.test(line);
            let weaknesses = weak ? line.match(/weak to ([a-z ,]+)/)[1].replace('weak to ', '').split(', ') : [];
            let immune = /immune to ([a-z ,]+)/.test(line);
            let immunities = immune ? line.match(/immune to ([a-z ,]+)/)[1].replace('weak to ', '').split(', ') : [];
            let damageType = line.match(/([a-z]+) damage/)[1];
            let power = values[0] * values[2];
            let group = {id:id+1, type, units: values[0], hp: values[1], damage: values[2], damageType, initiative: values[3], power, weaknesses, immunities};
            arr.push(group);
        });
    });
    return arr;
};

readFile('day24Input.txt', runFunctions);