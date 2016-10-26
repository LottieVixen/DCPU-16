//Init memory regs etc
memArray = new ArrayBuffer((2*65536)); //10k words at 16 bit each, ArrayBuffer(N), where N is bytes, hence 2 multiplier
MEM = new Int16Array(memArray); //view arraybuffer, seperate into 16 bits per index.
//end initmem
//init registers
regArray = new ArrayBuffer((2*8)); //8 registers, 2 bytes each
registers = new Int16Array(regArray); 
register = {
}
register.PC = registers[0x1c]

register.PC = 0
//end initreg
//*
var memVals = [0x00,//---------------- NOP 0
           0x01,0x01,0x05,//-- MOV B, 5 
           0x01,0x02,0x01,//-- MOV C, 1 
           0x02,0x00,0x02,//-- ADD A, C 
           0x05,0x00,0x01,//-- IFE A, B 
           //0x01,0x0F,//--------- JMP 1 
           0x00,
           0x00,
           0x00,                 
           0x01,0x1C,0x0D]; //SET PC 13
//*/
memVals.forEach((function(val,i,_){
	MEM[i] = val;
}))
/*
//var PC = 0;
var registers = {
	A : 0,
	B : 0,
	C : 0,
	X : 0,
	Y : 0,
	Z : 0,
	I : 0,
	J : 0,
	PC: 0,
	EX: 0
};
//*/
var operands = {
	0x00 : registers[0x00],//'A',
	0x01 : registers[0x01],//'B',
	0x02 : registers[0x02],//'C',
	0x03 : registers[0x03],//'X',
	0x04 : registers[0x04],//'Y',
	0x05 : registers[0x05],//'Z',
	0x06 : registers[0x06],//'I',
	0x07 : registers[0x07],//'J',
	0x08 : MEM[registers[0x00]],
	0x1c : registers[0x1c],//'PC',
	0x1d : registers[0x00],//'EX'
}

var fetch = function() {
	let A = MEM[registers.PC];
	registers.PC+=1;
	return A;
}

var opcodes = {
	0x00 : function NOP(){}, //NOP
	0x01 : function SET(){//SET R, r
		var R = operands[fetch()];
		var r = fetch();
		//console.log(parseInt(c,16));
		registers[R] = parseInt(r,16);
	},
	0x02 : function ADD(){ //-- ADD R, r
        var R = operands[fetch()];
        var r = operands[fetch()];
        registers[R] = registers[R] + registers[r];
    },
    0x03 : function SUB(){ //-- SUB R, r
        var R = operands[fetch()];
        var r = operands[fetch()];
        registers[R] = registers[R] - registers[r];
    },
    0x04 : function MUL(){ //-- Mul R, r
        var addr = fetch();
        var R = operands[fetch()];
        var r = operands[fetch()];
        registers[R] = registers[R] * registers[r];

    },
    0x05 : function ife(){ //-- IFE R, r
        var R = registers[operands[fetch()]];
        var r = registers[operands[fetch()]];
        //PC = (R == r) and PC + 3 or PC
        if (R == r) {registers['PC'] += 3;}
    }
};

var d2h = function(d) {
	return '0x'+('0000'+d.toString(16)).substr(-4).toUpperCase();
}


var FDX = function() {
	console.log('PC    IR   A    B    C')
	//while (registers['PC'] < (MEM.length)){
	while (true){
		var IR = fetch();
		//PC += 1;
		opcodes[IR]();
		//('000000000000000' + i.toString(16)).substr(-16)
		console.log(d2h(registers['PC'])+'  '+d2h(IR)+' '+d2h(registers['A'])+' '+d2h(registers['B'])+' '+d2h(registers['C']));
	};
};
FDX();