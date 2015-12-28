U3DEW.Input = {
/* Переменные */
pos : new Vector2D(0, 0),
x : 0,
y : 0,
oldX : 0,
oldY : 0,
//abs : new Vector2D(0, 0),
KeyDown : [],
KeyUp : [],
KeyPress : [],
MouseDown : [],
MouseUp : [],
MouseClick : [],
MouseWheel : 0
};

U3DEW.Input.KeyBoard = 
{
	'LEFT'      : 37,
	'RIGHT'     : 39,
	'UP'        : 38,
	'DOWN'      : 40,
	'SPACE'     : 32,
	'CTRL'      : 17,
	'SHIFT'     : 16,
	'ALT'       : 18,
	'ESC'       : 27,
	'ENTER'     : 13,
	'MINUS'     : 189,
	'PLUS'      : 187,
	'CAPS_LOCK' : 20,
	'BACKSPACE' : 8,
	'TAB'       : 9,
	'Q'         : 81,
	'W'         : 87,
	'E'         : 69,
	'R'         : 82,
	'T'         : 84,
	'Y'         : 89,
	'U'         : 85,
	'I'         : 73,
	'O'         : 79,
	'P'         : 80,
	'A'         : 65,
	'S'         : 83,
	'D'         : 68,
	'F'         : 70,
	'G'         : 71,
	'H'         : 72,
	'J'         : 74,
	'K'         : 75,
	'L'         : 76,
	'Z'         : 90,
	'X'         : 88,
	'V'         : 86,
	'B'         : 66,
	'N'         : 78,
	'M'         : 77,
	'0'         : 48,
	'1'         : 49,
	'2'         : 50,
	'3'         : 51,
	'4'         : 52,
	'5'         : 53,
	'6'         : 54,
	'7'         : 55,
	'8'         : 56,
	'C'         : 67,
	'9'         : 57,
	'NUM_0'     : 45,
	'NUM_1'     : 35,
	'NUM_2'     : 40,
	'NUM_3'     : 34,
	'NUM_4'     : 37,
	'NUM_5'     : 12,
	'NUM_6'     : 39,
	'NUM_7'     : 36,
	'NUM_8'     : 38,
	'NUM_9'     : 33,
	'NUM_MINUS' : 109,
	'NUM_PLUS'  : 107,
	'NUM_LOCK'  : 144,
	'F1'        : 112,
	'F2'        : 113,
	'F3'        : 114,
	'F4'        : 115,
	'F5'        : 116,
	'F6'        : 117,
	'F7'        : 118,
	'F8'        : 119,
	'F9'        : 120,
	'F10'       : 121,
	'F11'       : 122,
	'F12'       : 123
};

U3DEW.Input.MouseKey = 
{
	'LEFT' : 1,
	'MIDDLE' : 2,
	'RIGHT' : 3
};

U3DEW.Input.isKeyDown = function(_code)
{
	return this.KeyDown[this.KeyBoard[_code]];
}

U3DEW.Input.isKeyUp = function(_code)
{
	if(this.KeyUp[this.KeyBoard[_code]])
	{
		this.KeyUp[this.KeyBoard[_code]] = false;
		return true;
	}	
	return false;
}

U3DEW.Input.isKeyPress = function(_code)
{
	if(this.KeyPress[this.KeyBoard[_code]])
	{
		this.KeyPress[this.KeyBoard[_code]] = false;
		return true;
	}
	return false;
}

U3DEW.Input.KeyEvent = function(_e) 
{
	if (_e.type == 'keydown') 
	{
		this.KeyDown[_e.keyCode] = true;
		this.KeyPress[_e.keyCode] = true;
	} 
	else if (_e.type == 'keyup')
	{
		this.KeyPress[_e.keyCode] = false;
		this.KeyDown[_e.keyCode] = false;
		this.KeyUp[_e.keyCode] = true;
	}
}

U3DEW.Input.onNode = function (_id) 
{	
 if ((this.x > _id.pos.x && this.x < _id.pos.x+_id.size.x)&&
 	(this.y > _id.pos.y && this.y < _id.pos.y+_id.size.y)) return true;
	return false;
}

U3DEW.Input.onMouseMove = function (_e) 
{
  this.x = _e.pageX;
  this.y = _e.pageY;
}

U3DEW.Input.isMouseDown = function(_code)
{
	return this.MouseDown[this.MouseKey[_code]];
}

U3DEW.Input.isMouseUp = function(_code)
{
	if(this.MouseUp[this.MouseKey[_code]])
	{		
		this.MouseUp[this.MouseKey[_code]] = false;
		return true;
	}
	return false;
}

U3DEW.Input.isMouseClick = function(_code)
{
	if(this.MouseClick[this.MouseKey[_code]])
	{		
		this.MouseClick[this.MouseKey[_code]] = false;
		return true;
	}
	return false;
}

U3DEW.Input.isMouseWheel = function(_code) {
 return (_code == 'UP' && this.MouseWheel > 0) ||
        (_code == 'DOWN' && this.MouseWheel < 0)
};

U3DEW.Input.onMouseWheel = function(_e)
{
	this.mouseWheel = ((_e.wheelDelta) ? _e.wheelDelta : -_e.detail);
}

U3DEW.Input.onMouseEvent = function(_e)
{
	if (!_e.which && _e.button) 
	{
  		if (_e.button & 1) _e.which = 1;
  		else if (_e.button & 4) _e.which = 2;
       	else if (_e.button & 2) _e.which = 3;
 	}
	if (_e.type == 'mousedown') 
	{
			this.MouseClick[_e.which] = true;
			this.MouseDown[_e.which] = true;
	} 
	else if (_e.type == 'mouseup') 
	{
		this.MouseClick[_e.which] = false;
		this.MouseUp[_e.which] = true;
		this.MouseDown[_e.which] = false;
	}

	window.focus();
}

U3DEW.InitInput = function (_id) 
{
	window.focus();

	GetObj(_id).oncontextmenu = function() { return false; }
	GetObj(_id).onselectstart = GetObj(_id).oncontextmenu;
	GetObj(_id).ondragstart = GetObj(_id).oncontextmenu;
	GetObj(_id).onmousedown = function(e) { U3DEW.Input.onMouseEvent(e); };
	GetObj(_id).onmouseup = function(e) { U3DEW.Input.onMouseEvent(e); };
	GetObj(_id).onmousemove = function(e) { U3DEW.Input.onMouseMove(e); };
	GetObj(_id).onkeydown = function(e){ U3DEW.Input.KeyEvent(e); };
	GetObj(_id).onkeyup = function(e){ U3DEW.Input.KeyEvent(e); };
	GetObj(_id).onkeypress = function(e){ U3DEW.Input.KeyEvent(e); };
	GetObj(_id).onmousewheel = function(e) { U3DEW.Input.onMouseWheel(e); };
}