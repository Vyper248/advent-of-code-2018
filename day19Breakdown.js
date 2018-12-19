let a = 1;
let b = 0;
let c = 0;
let d = 0;
let e = 0;
let f = 0;
a = 1;

//17
e += 2; //17 (e=2)
e *= e; //(e=4)
e *= 19; //(e=76)
e *= 11; //(e=836)
d += 1; //(d=1)
d *= 22; //(d=22)
d += 3; //(d=25)
e += d; //(e=861)
b += a; //skip next command (a=1)

//skipped - b = 1; - loop to first while loop

d = 10550400; //27-32
e += d; //(e = 10551261) - value to test against
a = 0; // 34

f = 1;
while (true){ //testing for all values that e can divide evenly by
    c = 1;
    while (true) {
        d = f * c; //05
        if (e === d) { //works, so add to total
            a += f; //07
        }
        c++; //08
        if (d > e) { //09 //changed c to d to greatly optimise
            f++; //12
            if (f > e){ //if sum of values becomes greater than e, end program
                console.log('Second Star: ', a);
                return;
            } else {
                break;
            }
        }
    }
}