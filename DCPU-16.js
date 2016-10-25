var MEM = [0x00,//---------------- NOP
           0x01,0x01,0x05,//-- MOV B, 5
           0x01,0x02,0x01,//-- MOV C, 1
           0x02,0x00,0x02,//-- ADD A, C
           0x05,0x00,0x01,//-- IFE A, B
           0x04,0x07,//--------- JMP 1
           0x00,//---------------- NOP/\SKIPED
           0x00];//--------------- NOP
var PC = 0;
var registers = {
	A : 0,
	B : 0,
	C : 0,
	X : 0,
	Y : 0,
	Z : 0,
	I : 0,
	J : 0
};

var operands = {
	0x00 : 'A',
	0x01 : 'B',
	0x02 : 'C',
	0x03 : 'X',
	0x04 : 'Y',
	0x05 : 'Z',
	0x06 : 'I',
	0x07 : 'J',
	0x08 : MEM[registers['A']]
}

var fetch = function() {
	let A = MEM[PC];
	PC+=1;
	return A;
}

var opcodes = {
	0x00 : function nop(){}, //NOP
	0x01 : function mov(){/*MOV R, C*/
		var R = operands[fetch()];
		var c = fetch();
		//console.log(parseInt(c,16));
		registers[R] = parseInt(c,16);
	},
	0x02 : function add(){ //-- ADD R, r
        var R = operands[fetch()];
        var r = operands[fetch()];
        registers[R] = registers[R] + registers[r];
    },
    0x03 : function sub(){ //-- SUB R, r
        var R = operands[fetch()];
        var r = operands[fetch()];
        registers[R] = registers[R] - registers[r];
    },
    0x04 : function jmp(){ //-- JMP addr
        var addr = fetch();
        PC = parseInt(addr,16);
    },
    0x05 : function ife(){ //-- IFE R, r
        var R = registers[operands[fetch()]];
        var r = registers[operands[fetch()]];
        //PC = (R == r) and PC + 3 or PC
        if (R == r) PC += 3
    }
};

var d2h = function(d) {
	return '0x'+('00'+d.toString(16)).substr(-2).toUpperCase();
}


var FDX = function() {
	console.log('PC    IR   A    B    C')
	while (PC < (MEM.length)){
		var IR = fetch();
		//PC += 1;
		opcodes[IR]();
		//('000000000000000' + i.toString(16)).substr(-16)
		console.log(d2h(PC)+'  '+d2h(IR)+' '+d2h(registers['A'])+' '+d2h(registers['B'])+' '+d2h(registers['C']));
	};
};
FDX();