//Init memory regs etc
memArray = new ArrayBuffer((2*65536)); //10k words at 16 bit each, ArrayBuffer(N), where N is bytes, hence 2 multiplier
MEM = new Int16Array(memArray); //view arraybuffer, seperate into 16 bits per index.
//end initmem
//init registers
regArray = new ArrayBuffer((2*10)); //8 registers, 2 bytes each
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
PC:registers[0x1c],//'PC'
EX:registers[0x1d]//'EX'
};
register.A = 0;
register.B = 0;
register.C = 0;
register.X = 0;
register.Y = 0;
register.Z = 0;
register.I = 0;
register.J = 0;
register.mA = 0;
register.mB = 0;
register.mC = 0;
register.mX = 0;
register.mY = 0;
register.mZ = 0;
register.mI = 0;
register.mJ = 0;
register.PC = 0;
register.EX = 0;

var getReg = function(R){
	return registers[R];
};
var setReg = function(R,val){
	registers[R]=val;
};

//end initreg
//*
var memVals = [0x01,0x1C,0x00  //0x00: SET PC 0 //aka goto 0x00
               ];
//*/
memVals.forEach((function(val,i,_){
	MEM[i] = val;
}))


var fetch = function() {
	let A = MEM[getReg(0x01c)];
	register.PC+=1;
	return A;
}

var opcodes = {
	0x00 : function NOP(){}, //NOP
	0x01 : function SET(){//SET R, r
		var R = fetch();
		var r = fetch();
		console.log(R.toString(16)+' '+r);
		//register.PC = registers[r];
		setReg(R,getReg(r));
		console.log(registers[R]);
	}
};

var d2h = function(d) {
	return '0x'+('0000'+d.toString(16)).substr(-4).toUpperCase();
}


var FDX = function() {
	var i = 0
	//while (registers['PC'] < (MEM.length)){
	while (true){
		i++;
		var IR = fetch();
		//PC += 1;
		console.log('PC:'+register.PC+'IR:'+IR);
		if (IR != 0x00) {opcodes[IR]();};
		//('000000000000000' + i.toString(16)).substr(-16)
		//console.log(d2h(register.PC)+'  '+d2h(IR)+' '+d2h(register.A)+' '+d2h(register.B)+' '+d2h(register.C));
	};
};
FDX();