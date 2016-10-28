//Init memory regs etc
memArray = new ArrayBuffer((2*65536)); //10k words at 16 bit each, ArrayBuffer(N), where N is bytes, hence 2 multiplier
MEM = new Int16Array(memArray); //view arraybuffer, seperate into 16 bits per index.
//end initmem
//init registers
regArray = new ArrayBuffer((2*0x1D)); //8 registers, 2 bytes each
registers = new Int16Array(regArray); 
register = {
A:registers[0x00],//'A'   0x00
B:registers[0x01],//'B'   0x01
C:registers[0x02],//'C'   0x02
X:registers[0x03],//'X'   0x03
Y:registers[0x04],//'Y'   0x04
Z:registers[0x05],//'Z'   0x05
I:registers[0x06],//'I'   0x06
J:registers[0x07],//'J'   0x07
mA:MEM[registers[0x00]],//0x08
mB:MEM[registers[0x01]],//0x09
mC:MEM[registers[0x02]],//0x0A
mX:MEM[registers[0x03]],//0x0B
mY:MEM[registers[0x04]],//0x0C
mZ:MEM[registers[0x05]],//0x0D
mI:MEM[registers[0x06]],//0x0E
mJ:MEM[registers[0x07]],//0x0F
PC:registers[0x1C],//'PC' 0x1C
EX:registers[0x1D]//'EX'  0x1D
};

var getReg = function(R){
	return registers[R];
};
var setReg = function(R,val){
	registers[R]=val;
};

//*
var memVals = [0x01,0x00,0x1F, //SET A, NEXTWORD(Literal)
			   0x22,           //literal 1
               0x01,0x1C,0x21  // SET PC 0(literal) //aka goto 0x00
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

function checkForNextWord(r){
	if (r => 0x1E){ //if above mem range
			if (r == 0x1E){
				return MEM[fetch()];
			}else if(r == 0x1F){
				return fetch() - 0x21;
			}else{
				return r - 0x21; //literals
			}
		} else if ((r<0x10)&&(r>0x07)){//if in memory range
			return MEM[(r-0x08)];
		} else { // if 0x00 to 0x07 aka registers!
            return getReg(r);
		}
}

var d2h = function(d) {
	return '0x'+('0000'+d.toString(16)).substr(-4).toUpperCase();
}

var opcodes = {
	0x00 : function NOP(){}, //NOP
	0x01 : function SET(){//SET R, r
		var R = fetch();
		var r = fetch();
		r = checkForNextWord(r);
		setReg(R,r);
	},
	0x02 : function ADD(){//ADD R,r
		var R = fetch();
		var r = fetch();
		r = checkForNextWord(r);
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