//Init memory regs etc
memArray = new ArrayBuffer((2*65536)); //10k words at 16 bit each, ArrayBuffer(N), where N is bytes, hence 2 multiplier
MEM = new Int16Array(memArray); //view arraybuffer, seperate into 16 bits per index.
//end initmem
//init registers
regArray = new ArrayBuffer((2*0x1d)); //8 registers, 2 bytes each
registers = new Int16Array(regArray); 
register = {
A:registers[0x00],//'A'
B:registers[0x01],//'B'
C:registers[0x02],//'C'
X:registers[0x03],//'X'
Y:registers[0x04],//'Y'
Z:registers[0x05],//'Z'
I:registers[0x06],//'I'
J:registers[0x07],//'J'
mA:MEM[registers[0x00]],
mB:MEM[registers[0x01]],
mC:MEM[registers[0x02]],
mX:MEM[registers[0x03]],
mY:MEM[registers[0x04]],
mZ:MEM[registers[0x05]],
mI:MEM[registers[0x06]],
mJ:MEM[registers[0x07]],
PC:registers[0x1C],//'PC'
EX:registers[0x1D]//'EX'
};

var getReg = function(R){
	return registers[R];
};
var setReg = function(R,val){
	registers[R]=val;
};

//*
var memVals = [0x01,0x00,0x01,
               0x01,0x1C,0x00  // SET PC 0 //aka goto 0x00
               ];
//*/
memVals.forEach((function(val,i,_){
	MEM[i] = val;
}))


var fetch = function() {
	let A = MEM[getReg(0x1c)];
	setReg(0x1c,getReg(0x1c)+1);
	return A;
}

var d2h = function(d) {
	return '0x'+('0000'+d.toString(16)).substr(-4).toUpperCase();
}

var opcodes = {
	0x00 : function NOP(){}, //NOP
	0x01 : function SET(){//SET R, r
		var R = fetch();
		var r = fetch();
		setReg(R,r);
	},
	0x02 : function ADD(){//ADD R,r
		var R = fetch();
		var r = fetch();
		setReg(R,getReg(R)+getReg(r));
	}
};

var FDX = function() {
	while (true){
		var IR = fetch();
		if (IR != 0x00) {opcodes[IR]();};
		console.log('PC='+registers[0x1c]+'A='+registers[0x00]);

	};
};
FDX();