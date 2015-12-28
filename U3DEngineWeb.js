function GetObj(_id){return document.getElementById(_id);}
function Log(_text){console.log('[Log]: '+_text);}

function degToRad(degrees) {return degrees * Math.PI / 180;}
function SetCursorImage (_id, _curImg) {GetObj(_id).style.cursor = 'url("'+_curImg+'"), auto';}
function ShowCursor(_id) {GetObj(_id).style.cursor = 'auto';}
function HideCursor(_id) {GetObj(_id).style.cursor = 'none';}

var requestAnimFrame = (function()
{	
	return window.requestAnimationFrame||
			 window.webkitRequestAnimationFrame||
			 window.mozRequestAnimationFrame||
			 window.oRequestAnimationFrame||
			 window.msRequestAnimationFrame||
			 function(callback)
			 { window.setTimeout(callback, 1000 / 60);}
})();

Vector2D = function (_x,_y)
{
	this.x = _x;
	this.y = _y;
}
Vector2D.prototype = 
{
	constructor:Vector2D,
	GetVector3DA: function()
	{
		return [this.x,this.y];
	}
}

Vector3D = function (_x,_y,_z)
{
	this.x = _x;
	this.y = _y;
	this.z = _z;
}
Vector3D.prototype = 
{
	constructor:Vector3D,
	GetVector3DA: function()
	{
		return [this.x,this.y,this.z];
	}
}

Vector4D = function (_x,_y,_z,_w)
{
	this.x = _x;
	this.y = _y;
	this.z = _z;
	this.w = _w;
}
Vector4D.prototype = 
{
	constructor:Vector4D,
	GetVector4DA: function()
	{
		return [this.x,this.y,this.z,this.w];
	}
}

/*---------------Begin 2DEngine---------------*/
{
	U2DEW = {};

	U2DEW.SetU2DEWRender = function (_function)
	{
		Active2DRender = _function;
		requestAnimFrame(U2DEW._U2DEWRender);
	}

	U2DEW._U2DEWRender = function()
	{
		if(!Active2DRender) return;
		Active2DRender();
		requestAnimFrame(U2DEW._U2DEWRender);
	}


	/*---------------Begin Scene---------------*/
	{
		U2DEW.Scene = function () 
		{
			/*Переменные*/
			this.Layers = [];			
		}

		U2DEW.Scene.prototype = 
		{
			constructor: U2DEW.Scene,

			Add: function (_layer) 
			{
				this.Layers.push(_layer);
			},

			Render: function()
			{
				for(var i = 0; i < this.Layers.length; i++)
					this.Layers[i].Draw();
			}
		}
	}
	/*---------------End Scene---------------*/

	/*---------------Begin Layer---------------*/
	{
		U2DEW.Layer = function(_width,_height,_depth)
		{
			this.Canvas = document.createElement('canvas');		
			this.Canvas.width = _width;
			this.Canvas.height = _height;
			this.width = _width;
			this.height = _height;	
			this.Canvas.style.zIndex = 1000+_depth;
			this.Canvas.style.position = 'fixed';
			this.Canvas.style.left = '0';
			this.Canvas.style.top = '0';

			this.Context = this.Canvas.getContext('2d');
			document.body.appendChild(this.Canvas);

			this.visible = true;
			this.alpha = 1;

			this.objs = [];
		}
		U2DEW.Layer.prototype = 
		{
			constructor: U2DEW.Layer,

			Add: function(_obj)
			{
				this.objs.push(_obj);
			},

			Fill: function(_color)
			{	
				this.Context.fillStyle = _color;	
				this.Context.fillRect(0, 0, this.Canvas.width, this.Canvas.height);
			},

			Clear: function()
			{
				this.Context.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
			},

			Draw: function()
			{
				if(!this.visible) return;

				this.Clear();
				for(var i = 0; i < this.objs.length; i++)
				{
					switch(this.objs[i].type)
					{
						case 'Sprite': 
						{
							if(!this.objs[i].Visible) continue;

							if(this.objs[i].isImage)
							{
								if (this.objs[i].Angle || this.objs[i].Flip.x || this.objs[i].Flip.y)
								{
									this.Context.save();
									this.Context.translate(this.objs[i].Position.x-this.objs[i].Size.x/2, this.objs[i].Position.y-this.objs[i].Size.y/2);
									this.Context.rotate(degToRad(this.objs[i].Angle));
									this.Context.scale(this.objs[i].Flip.x ? -1 : 1, this.objs[i].Flip.y ? -1 : 1);
									this.Context.translate(-this.objs[i].Position.x-this.objs[i].Size.x/2, -this.objs[i].Position.y-this.objs[i].Size.y/2);
								}

								if(this.objs[i].Animation.isAnim)
								{
									if(this.objs[i].Animation.loop)
										{ if(this.objs[i].frame > this.objs[i].Animation.Frames-1) this.objs[i].frame = 0;}
									else if(this.objs[i].frame > this.objs[i].Animation.Frames-1) return;

									this.Context.drawImage(
									this.objs[i].Image,
									(this.objs[i].Animation.Position.x+this.objs[i].Animation.Size.x*this.objs[i].frame),this.objs[i].Animation.Position.y,
									this.objs[i].Animation.Size.x, this.objs[i].Animation.Size.y,
									this.objs[i].Position.x-this.objs[i].Size.x/2, this.objs[i].Position.y-this.objs[i].Size.y/2,
									this.objs[i].Size.x, this.objs[i].Size.y);										
								}
								else
								{
									this.Context.drawImage(
									this.objs[i].Image,
									0,0,
									this.objs[i].Image.width/this.objs[i].Animation.Frames, this.objs[i].Image.height,
									this.objs[i].Position.x-this.objs[i].Size.x/2, this.objs[i].Position.y-this.objs[i].Size.y/2,
									this.objs[i].Size.x, this.objs[i].Size.y);
								}


								if (this.objs[i].Angle || this.objs[i].Flip.x || this.objs[i].Flip.y) 
									this.Context.restore();	

								if(this.objs[i].Animation.isAnim)
									if(this.objs[i].time > this.objs[i].Animation.Speed) {this.objs[i].frame++; this.objs[i].time = 0;}
									else this.objs[i].time++;	
							}							
						}
						break;
					}

				}

			},

			Visible: function (_bool)
			{
				if(_bool)
					{
						this.Canvas.style.display = 'block';
						this.visible = true;
					}
				else
					{
						this.Canvas.style.display = 'none';
						this.visible = false;
					}
			},

			SetAlpha: function (_alpha)
			{
				this.Canvas.style.opacity = _alpha;
				this.alpha = _alpha;
			}
		}		
	}
	/*---------------End Layer---------------*/

	/*---------------Begin Object---------------*/
	{
		U2DEW.Object = function()
		{
			this.Visible = true;
			this.Position = new Vector2D(0, 0);
			this.Flip = new Vector2D(0, 0);	
			this.Angle = 0;			
		}
		U2DEW.Object.prototype =
		{		
			constructor: U2DEW.Object
		}
	}
	/*---------------End Object---------------*/

	/*---------------Begin Sprite---------------*/
	{
		U2DEW.Sprite = function()
		{
			U2DEW.Object.call(this);
			this.type = 'Sprite';
			this.Image = new Image();
			this.Image.Loaded = false;
			this.isImage = false;
			this.Animation = 
			{
				Position: new Vector2D(0, 0),
				Size: new Vector2D(0, 0),
				Speed: 0,
				Loop: false,
				Frames: 1,
				isAnim: false
			};
			this.frame = 0;
			this.time = 0;
		}
		U2DEW.Sprite.prototype =
		{
			constructor: U2DEW.Sprite,
			SetImage: function(_src)
			{
				var _Image = new Image();
				_Image.src = _src;
				_Image.onload = function() 
				{ 
					_Image.Loaded = true;
				};
	       		this.Image = _Image;
	       		if(this.Image)
	       			this.isImage = true;
			}
		}
	}
	/*---------------End Sprite---------------*/
	U3DEWLogo = {};
	{
		U3DEWLogo.alpha = 0;

		U3DEWLogo.Render2D = function()
		{
			if(U3DEWLogo.Logo.Image.Loaded)
				if(U3DEWLogo.alpha<2.0||U3DEWLogo.Logo.Animation.isAnim)
					U3DEWLogo.alpha+=0.01;

			U3DEWLogo.Start.SetAlpha(U3DEWLogo.alpha);
			U3DEWLogo.Scene2D.Render();
		} 

		U3DEWLogo.Show = function()
		{
			U3DEWLogo.Scene2D = new U2DEW.Scene();
			U3DEWLogo.Background = new U2DEW.Layer(window.innerWidth,window.innerHeight,-2);
			U3DEWLogo.Start = new U2DEW.Layer(window.innerWidth,window.innerHeight,-1); 
			U3DEWLogo.Background.Fill('rgb(0,0,0');
			  

			U3DEWLogo.Logo = new U2DEW.Sprite();
			U3DEWLogo.Logo.SetImage('https://googledrive.com/host/0B_THTobyd59dck5oLTBHRFNtdVU/LogoA.jpg');
			U3DEWLogo.Logo.Position = new Vector2D(window.innerWidth/2,window.innerHeight/2);
			U3DEWLogo.Logo.Size = new Vector2D(512,512);
			U3DEWLogo.Logo.Animation.Size = new Vector2D(1024,1024);
			U3DEWLogo.Logo.Animation.Frames = 7;
			U3DEWLogo.Logo.Animation.Speed = 10;

			U3DEWLogo.Start.Add(U3DEWLogo.Logo);
			U3DEWLogo.Scene2D.Add(U3DEWLogo.Start);

			U2DEW.SetU2DEWRender(U3DEWLogo.Render2D);
		}

		U3DEWLogo.Hide = function()
		{
			if(U3DEWLogo.alpha>=2.0)
				U3DEWLogo.Logo.Animation.isAnim = true;
			if(U3DEWLogo.alpha>=3.0)
			{
				U2DEW.SetU2DEWRender(null);
				U3DEWLogo.Background.Clear();
				U3DEWLogo.Start.Clear();
				return true;
			}
			return false;
		}		
	}	
}
/*---------------End 2DEngine---------------*/

/*---------------Begin 3DEngine---------------*/
{
	U3DEW = {};

	U3DEW.SetU3DEWRender = function (_function)
	{
		ActiveRender = _function;
		requestAnimFrame(U3DEW._U3DEWRender);
	}

	U3DEW._U3DEWRender = function()
	{
		if(U3DEWLogo.Hide())
		{
			ActiveRender();			
		}
		requestAnimFrame(U3DEW._U3DEWRender);
	}


	/*---------------Begin Scene---------------*/
	{
		U3DEW.Scene = function () 
		{
			/*Переменные*/
			this.Objs = [];
			this.Lights = [];
		}

		U3DEW.Scene.prototype = 
		{
			constructor: U3DEW.Scene,

			Add: function (_obj) 
			{
				if(_obj.Type == 'Light')
					this.Lights.push(_obj);
				else
					this.Objs.push(_obj);
			}
		}
	}
	/*---------------End Scene---------------*/

	/*---------------Begin Renderer---------------*/
	{
		U3DEW.Renderer = function (_width, _height)
		{
			/*Переменные*/
			U3DEWLogo.Show();
			this.Canvas = document.createElement('canvas');	
			this.Canvas.width = _width;
			this.Canvas.height = _height;
			this.width = _width;
			this.height = _height;
			this.Canvas.style.position = 'fixed';
			this.Canvas.style.left = '0';
			this.Canvas.style.top = '0';
			try 
			{
				this.Context = this.Canvas.getContext('webgl');
				this.Context.viewport(0, 0, this.width, this.height);
				
				this.Context.blendFunc(this.Context.SRC_ALPHA, this.Context.ONE);
				this.Context.enable(this.Context.DEPTH_TEST);
				this.Context.enable(this.Context.CULL_FACE);
				this.ClearColor = new Vector3D(0.0,0.0,0.0);
				this.PostRT = [];
				this.PostRT[0] = new U3DEW.RenderTexture();
				this.PostRT[1] = new U3DEW.RenderTexture();
			}
			catch(e) {}
			if(!this.Context) Log("Ошибка! Renderer не инициализирован!");
			document.body.appendChild(this.Canvas);

			this.FpsConteiner =  document.createElement( 'div' );
			this.FpsConteiner.style.position = 'fixed';
			this.FpsConteiner.style.left = '0';
			this.FpsConteiner.style.top = '0';
			this.FpsConteiner.style.fontFamily = 'Helvetica,Arial,sans-seri';
			this.FpsConteiner.style.fontSize = '14px';
			this.FpsConteiner.style.color = '#fff';
			this.FpsConteiner.frames = 0;
			this.FpsConteiner.prevTime = 0;
			this.FpsConteiner.fps = 0;
			this.FpsConteiner.style.display = 'none';
			document.body.appendChild( this.FpsConteiner );
		}

		U3DEW.Renderer.prototype = 
		{
			constructor: U3DEW.Renderer,

			SetSize: function(_width, _height)
			{
				this.Canvas.width = _width;
				this.Canvas.height = _height;
				this.width = _width;
				this.height = _height;

				this.Context.viewport(0, 0, _width, _height);
			},

			Clear: function(_r,_g,_b,_a,_d)
			{
				this.ClearColor = new Vector3D(_r,_g,_b);
				this.Context.clearColor(_r,_g,_b,_a);
				this.Context.clearDepth(_d);
				this.Context.clear(this.Context.COLOR_BUFFER_BIT | this.Context.DEPTH_BUFFER_BIT);
			},

			CompileFragmentShaderCode: function(_text)
			{
				var shader = this.Context.createShader(this.Context.FRAGMENT_SHADER);
				this.Context.shaderSource(shader, _text);
				this.Context.compileShader(shader);
				if (!this.Context.getShaderParameter(shader, this.Context.COMPILE_STATUS)) 
				{
					Log(this.Context.getShaderInfoLog(shader));
					return null;
				}

				return shader;
			},

			CompileVertexShaderCode: function(_text)
			{
				var shader = this.Context.createShader(this.Context.VERTEX_SHADER);
				this.Context.shaderSource(shader, _text);
				this.Context.compileShader(shader);
				if (!this.Context.getShaderParameter(shader, this.Context.COMPILE_STATUS)) 
				{
					Log(this.Context.getShaderInfoLog(shader));
					return null;
				}
				return shader;
			},

			CreateShaderProgram: function(_fshader,_vshader)
			{
				var shaderProgram = this.Context.createProgram();
				this.Context.attachShader(shaderProgram, _vshader);
				this.Context.attachShader(shaderProgram, _fshader);
				this.Context.linkProgram(shaderProgram);

				if (!this.Context.getProgramParameter(shaderProgram, this.Context.LINK_STATUS)) 
				{
				  Log("Could not initialise shaders");
				}
				return shaderProgram;
			},

			CreateBuffer: function(_buf)
			{
				var Buffer = this.Context.createBuffer();
				this.Context.bindBuffer(this.Context.ARRAY_BUFFER, Buffer);	
				this.Context.bufferData(this.Context.ARRAY_BUFFER, new Float32Array(_buf), this.Context.STATIC_DRAW);
				return Buffer;
			},

			CreateElementBuffer: function(_buf)
			{
				var Buffer = this.Context.createBuffer();
				this.Context.bindBuffer(this.Context.ELEMENT_ARRAY_BUFFER, Buffer);	
				this.Context.bufferData(this.Context.ELEMENT_ARRAY_BUFFER, new Uint16Array(_buf), this.Context.STATIC_DRAW);
				return Buffer;
			},

			CreateTexture2D: function(_texture)
			{
				_texture.Texture = this.Context.createTexture();
				this.Context.bindTexture(this.Context.TEXTURE_2D, _texture.Texture);
		    	this.Context.pixelStorei(this.Context.UNPACK_FLIP_Y_WEBGL, true); 		
		   		this.Context.texParameteri(this.Context.TEXTURE_2D, this.Context.TEXTURE_MAG_FILTER, this.Context.LINEAR);
		    	this.Context.texParameteri(this.Context.TEXTURE_2D, this.Context.TEXTURE_MIN_FILTER, this.Context.LINEAR);
		    	this.Context.texParameteri(this.Context.TEXTURE_2D, this.Context.TEXTURE_WRAP_S, this.Context.CLAMP_TO_EDGE);
		    	this.Context.texParameteri(this.Context.TEXTURE_2D, this.Context.TEXTURE_WRAP_T, this.Context.CLAMP_TO_EDGE);
		    	this.Context.texImage2D(this.Context.TEXTURE_2D, 0, this.Context.RGBA, this.Context.RGBA, this.Context.UNSIGNED_BYTE, _texture.Image);
		    	this.Context.bindTexture(this.Context.TEXTURE_2D, null);
			},

			CreateRenderTexture: function(_texture,_width,_height)
			{
		        _texture.FBuffer = this.Context.createFramebuffer();
		       	this.Context.bindFramebuffer(this.Context.FRAMEBUFFER, _texture.FBuffer);
		        _texture.width = _width;
		        _texture.height = _height;

		        _texture.Texture = this.Context.createTexture();
		        this.Context.bindTexture(this.Context.TEXTURE_2D, _texture.Texture);
		       	this.Context.texParameteri(this.Context.TEXTURE_2D, this.Context.TEXTURE_MAG_FILTER, this.Context.LINEAR);
		        this.Context.texParameteri(this.Context.TEXTURE_2D, this.Context.TEXTURE_MIN_FILTER, this.Context.LINEAR);
		        this.Context.texParameteri(this.Context.TEXTURE_2D, this.Context.TEXTURE_WRAP_S, this.Context.CLAMP_TO_EDGE);
		    	this.Context.texParameteri(this.Context.TEXTURE_2D, this.Context.TEXTURE_WRAP_T, this.Context.CLAMP_TO_EDGE);
		        this.Context.texImage2D(this.Context.TEXTURE_2D, 0, this.Context.RGBA, _texture.width, _texture.height, 0, this.Context.RGBA, this.Context.UNSIGNED_BYTE, null);

		        _texture.Rbuffer = this.Context.createRenderbuffer();
		        this.Context.bindRenderbuffer(this.Context.RENDERBUFFER, _texture.Rbuffer);
		        this.Context.renderbufferStorage(this.Context.RENDERBUFFER, this.Context.DEPTH_COMPONENT16, _texture.width, _texture.height);
		        this.Context.framebufferTexture2D(this.Context.FRAMEBUFFER, this.Context.COLOR_ATTACHMENT0, this.Context.TEXTURE_2D, _texture.Texture, 0);
		        this.Context.framebufferRenderbuffer(this.Context.FRAMEBUFFER, this.Context.DEPTH_ATTACHMENT, this.Context.RENDERBUFFER, _texture.Rbuffer);

		        this.Context.bindTexture(this.Context.TEXTURE_2D, null);
		        this.Context.bindRenderbuffer(this.Context.RENDERBUFFER, null);
		        this.Context.bindFramebuffer(this.Context.FRAMEBUFFER, null);
			},

			GetImageFromCanvas:function(_image,_x)
			{
				var canvas = document.createElement( 'canvas' );
				canvas.width = _image.height;
				canvas.height = _image.height;
				var context = canvas.getContext( '2d' );

				context.fillStyle = 'rgb(255,255,255)';	
				context.fillRect(0, 0, canvas.width, canvas.height);

				context.drawImage( _image, _x, 0, _image.height, _image.height, 0, 0, _image.height, _image.height);
				return canvas;
			},

			CrerateCubeTexture: function(_texture)
			{
				_texture.Texture = this.Context.createTexture();
				this.Context.bindTexture(this.Context.TEXTURE_CUBE_MAP, _texture.Texture);
				this.Context.pixelStorei(this.Context.UNPACK_FLIP_Y_WEBGL, true );
				this.Context.texParameteri(this.Context.TEXTURE_CUBE_MAP, this.Context.TEXTURE_MAG_FILTER, this.Context.LINEAR);
				this.Context.texParameteri(this.Context.TEXTURE_CUBE_MAP, this.Context.TEXTURE_MIN_FILTER, this.Context.LINEAR);
				this.Context.texParameteri(this.Context.TEXTURE_CUBE_MAP, this.Context.TEXTURE_WRAP_S, this.Context.CLAMP_TO_EDGE);
				this.Context.texParameteri(this.Context.TEXTURE_CUBE_MAP, this.Context.TEXTURE_WRAP_T, this.Context.CLAMP_TO_EDGE);

				
				this.Context.texImage2D(this.Context.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, this.Context.RGBA, this.Context.RGBA, this.Context.UNSIGNED_BYTE, 
				this.GetImageFromCanvas(_texture.Image, _texture.Image.height*0));
				this.Context.texImage2D(this.Context.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, this.Context.RGBA, this.Context.RGBA, this.Context.UNSIGNED_BYTE, 
				this.GetImageFromCanvas(_texture.Image, _texture.Image.height*1));

				this.Context.texImage2D(this.Context.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, this.Context.RGBA, this.Context.RGBA, this.Context.UNSIGNED_BYTE, 
				this.GetImageFromCanvas(_texture.Image, _texture.Image.height*2));
				this.Context.texImage2D(this.Context.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, this.Context.RGBA, this.Context.RGBA, this.Context.UNSIGNED_BYTE, 
				this.GetImageFromCanvas(_texture.Image, _texture.Image.height*3));

				this.Context.texImage2D(this.Context.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, this.Context.RGBA, this.Context.RGBA, this.Context.UNSIGNED_BYTE, 
				this.GetImageFromCanvas(_texture.Image, _texture.Image.height*4));
				this.Context.texImage2D(this.Context.TEXTURE_CUBE_MAP_POSITIVE_X, 0, this.Context.RGBA, this.Context.RGBA, this.Context.UNSIGNED_BYTE, 
				this.GetImageFromCanvas(_texture.Image, _texture.Image.height*5));
													
				this.Context.generateMipmap( this.Context.TEXTURE_CUBE_MAP );
				this.Context.bindTexture(this.Context.TEXTURE_CUBE_MAP, null);
			},

			SetRenderTexture: function(_texture)
			{
				this.Context.bindFramebuffer(this.Context.FRAMEBUFFER, _texture.FBuffer);
				this.Context.viewport(0, 0, _texture.width, _texture.height);
			},

			SetDefaultRenderTexture: function()
			{
				this.Context.bindFramebuffer(this.Context.FRAMEBUFFER, null);
	        	this.Context.viewport(0, 0, this.width, this.height);
			},	

			Render: function(_scene, _camera, _postrender)
			{
				if(_postrender)
				{
					if(!this.PostRT[0].Texture || this.PostRT[0].width != this.width || this.PostRT[0].height != this.height) this.CreateRenderTexture(this.PostRT[0],this.width,this.height);

					this.SetRenderTexture(this.PostRT[0]);
					this.Clear(this.ClearColor.x,this.ClearColor.y,this.ClearColor.z,1.0,1.0);

					_camera.Aspect = this.width / this.height;
	    			_camera.Update();				
				}

				if(_camera.SkyBox.Image.Loaded)
				{
					if(!_camera.SkyBox.Texture) this.CrerateCubeTexture(_camera.SkyBox);
					if(!_camera.SkyBox.VertexBuffer) _camera.SkyBox.VertexBuffer = this.CreateBuffer(_camera.SkyBox.Vertices);
					if(!_camera.SkyBox.IndexBuffer) _camera.SkyBox.IndexBuffer = this.CreateElementBuffer(_camera.SkyBox.Indices); 

					if(!_camera.SkyBox.ShaderProgram)
					{
						var FS = this.CompileFragmentShaderCode(_camera.SkyBox.CodeFragmentShader);
						var VS = this.CompileVertexShaderCode(_camera.SkyBox.CodeVertexShader);
						_camera.SkyBox.ShaderProgram = this.CreateShaderProgram(FS,VS);
															
						_camera.SkyBox.ShaderProgram.Pos = this.Context.getAttribLocation(_camera.SkyBox.ShaderProgram, "Pos");						
							        				
		    			_camera.SkyBox.ShaderProgram.World = this.Context.getUniformLocation(_camera.SkyBox.ShaderProgram, "World");
						_camera.SkyBox.ShaderProgram.Projection = this.Context.getUniformLocation(_camera.SkyBox.ShaderProgram, "Projection");
						_camera.SkyBox.ShaderProgram.View = this.Context.getUniformLocation(_camera.SkyBox.ShaderProgram, "View");

						_camera.SkyBox.ShaderProgram.Sampler = this.Context.getUniformLocation(_camera.SkyBox.ShaderProgram, "Sampler");
					}

					this.Context.useProgram(_camera.SkyBox.ShaderProgram);
					this.Context.enableVertexAttribArray(_camera.SkyBox.ShaderProgram.Pos);

					this.Context.bindBuffer(this.Context.ARRAY_BUFFER, _camera.SkyBox.VertexBuffer);
					this.Context.vertexAttribPointer(_camera.SkyBox.ShaderProgram.Pos, _camera.SkyBox.CountVertexItem, this.Context.FLOAT, false, 0, 0);
					
					this.Context.bindBuffer(this.Context.ELEMENT_ARRAY_BUFFER, _camera.SkyBox.IndexBuffer);

					this.Context.uniformMatrix4fv(_camera.SkyBox.ShaderProgram.World, false, _camera.GetWorldMatrix());
					this.Context.uniformMatrix4fv(_camera.SkyBox.ShaderProgram.View, false, _camera.GetViewMatrix());
					this.Context.uniformMatrix4fv(_camera.SkyBox.ShaderProgram.Projection, false, _camera.Projection);
								
					this.Context.activeTexture(this.Context.TEXTURE0);
					this.Context.bindTexture(this.Context.TEXTURE_CUBE_MAP, _camera.SkyBox.Texture);
					this.Context.uniform1i(_camera.SkyBox.ShaderProgram.Sampler, 0);

					this.Context.frontFace(this.Context.CW);
					this.Context.depthFunc(this.Context.LEQUAL);
					this.Context.drawElements(this.Context.TRIANGLES, _camera.SkyBox.CountIndex, this.Context.UNSIGNED_SHORT, 0);
					this.Context.depthFunc(this.Context.LESS);
					this.Context.frontFace(this.Context.CCW);														
				}

				for(var i = 0; i < _scene.Objs.length; i++)
				{
					if(!_scene.Objs[i].VertexBuffer) _scene.Objs[i].VertexBuffer = this.CreateBuffer(_scene.Objs[i].Vertices);
					if(!_scene.Objs[i].IndexBuffer) _scene.Objs[i].IndexBuffer = this.CreateElementBuffer(_scene.Objs[i].Indices); 
					if(!_scene.Objs[i].TexCoordBuffer) _scene.Objs[i].TexCoordBuffer = this.CreateBuffer(_scene.Objs[i].TexCoords);
					if(!_scene.Objs[i].NormalBuffer && !_scene.Objs[i].TangentBuffer && !_scene.Objs[i].BinormalBuffer) 
					{
						_scene.Objs[i].CalcNormal(); 
						_scene.Objs[i].NormalBuffer = this.CreateBuffer(_scene.Objs[i].Normals);
						_scene.Objs[i].TangentBuffer = this.CreateBuffer(_scene.Objs[i].Tangents);
						_scene.Objs[i].BinormalBuffer = this.CreateBuffer(_scene.Objs[i].Binormals);
					}				
					if(_scene.Objs[i].Material.TextureDiffuse.Image.Loaded && !_scene.Objs[i].Material.TextureDiffuse.Texture) this.CreateTexture2D(_scene.Objs[i].Material.TextureDiffuse);
					if(_scene.Objs[i].Material.TextureBump.Image.Loaded && !_scene.Objs[i].Material.TextureBump.Texture) this.CreateTexture2D(_scene.Objs[i].Material.TextureBump);
					if(_scene.Objs[i].Material.TextureSpecular.Image.Loaded && !_scene.Objs[i].Material.TextureSpecular.Texture) this.CreateTexture2D(_scene.Objs[i].Material.TextureSpecular);
					if(_scene.Objs[i].Material.TextureEmissive.Image.Loaded && !_scene.Objs[i].Material.TextureEmissive.Texture) this.CreateTexture2D(_scene.Objs[i].Material.TextureEmissive);

					for(var j = 0; j < _scene.Lights.length; j++)
					{
						//ShadowMap
						{
							if(_scene.Objs[i].isCastShadow&&_scene.Lights[j].isShadows)
							{
								if(!_scene.Lights[j].ShadowMap.RT.Texture || _scene.Lights[j].ShadowMap.RT.width != _scene.Lights[j].ShadowMap.width || _scene.Lights[j].ShadowMap.RT.height != _scene.Lights[j].ShadowMap.height) 
									{
										this.CreateRenderTexture(_scene.Lights[j].ShadowMap.RT,_scene.Lights[j].ShadowMap.width,_scene.Lights[j].ShadowMap.height);
										_scene.Lights[j].Dimensions = new Vector4D(_scene.Lights[j].ShadowMap.width,_scene.Lights[j].ShadowMap.height,1/_scene.Lights[j].ShadowMap.width,1/_scene.Lights[j].ShadowMap.height);
									}
								this.SetRenderTexture(_scene.Lights[j].ShadowMap.RT);							
								if(i == 0) this.Clear(1.0,1.0,1.0,1.0,1.0);

								if(!_scene.Lights[j].ShadowMap.ShaderProgram)
								{
									var FS = this.CompileFragmentShaderCode(_scene.Lights[j].ShadowMap.CodeFragmentShader);
									var VS = this.CompileVertexShaderCode(_scene.Lights[j].ShadowMap.CodeVertexShader);
									_scene.Lights[j].ShadowMap.ShaderProgram = this.CreateShaderProgram(FS,VS);

									_scene.Lights[j].ShadowMap.ShaderProgram.Pos = this.Context.getAttribLocation(_scene.Lights[j].ShadowMap.ShaderProgram, "Pos");						
									        				
				    				_scene.Lights[j].ShadowMap.ShaderProgram.World = this.Context.getUniformLocation(_scene.Lights[j].ShadowMap.ShaderProgram, "World");
									_scene.Lights[j].ShadowMap.ShaderProgram.Projection = this.Context.getUniformLocation(_scene.Lights[j].ShadowMap.ShaderProgram, "Projection");
									_scene.Lights[j].ShadowMap.ShaderProgram.View = this.Context.getUniformLocation(_scene.Lights[j].ShadowMap.ShaderProgram, "View");																
								}

								this.Context.useProgram(_scene.Lights[j].ShadowMap.ShaderProgram);
								this.Context.enableVertexAttribArray(_scene.Lights[j].ShadowMap.ShaderProgram.Pos);

								this.Context.bindBuffer(this.Context.ARRAY_BUFFER, _scene.Objs[i].VertexBuffer);
			    				this.Context.vertexAttribPointer(_scene.Lights[j].ShadowMap.ShaderProgram.Pos, _scene.Objs[i].CountVertexItem, this.Context.FLOAT, false, 0, 0);
			    				
			    				this.Context.bindBuffer(this.Context.ELEMENT_ARRAY_BUFFER, _scene.Objs[i].IndexBuffer);

			    				this.Context.uniformMatrix4fv(_scene.Lights[j].ShadowMap.ShaderProgram.World, false, _scene.Objs[i].GetWorldMatrix());
			    				this.Context.uniformMatrix4fv(_scene.Lights[j].ShadowMap.ShaderProgram.View, false, _scene.Lights[j].GetViewMatrix());
			    				this.Context.uniformMatrix4fv(_scene.Lights[j].ShadowMap.ShaderProgram.Projection, false, _scene.Lights[j].Projection);	

			    				this.Context.drawElements(this.Context.TRIANGLES, _scene.Objs[i].CountIndex, this.Context.UNSIGNED_SHORT, 0);		    																			
								
								this.SetRenderTexture(this.PostRT[0]);
							}							
						}

						//Light
						{
							if(!_scene.Lights[j].ShaderProgram)
							{
								var FS = this.CompileFragmentShaderCode(_scene.Lights[j].CodeFragmentShader);
								var VS = this.CompileVertexShaderCode(_scene.Lights[j].CodeVertexShader);
								_scene.Lights[j].ShaderProgram = this.CreateShaderProgram(FS,VS);
																	
								_scene.Lights[j].ShaderProgram.Pos = this.Context.getAttribLocation(_scene.Lights[j].ShaderProgram, "Pos");						
								_scene.Lights[j].ShaderProgram.TexCoord = this.Context.getAttribLocation(_scene.Lights[j].ShaderProgram, "TexCoord");
									        				
				    			_scene.Lights[j].ShaderProgram.World = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "World");
								_scene.Lights[j].ShaderProgram.Projection = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "Projection");
								_scene.Lights[j].ShaderProgram.View = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "View");

				    			_scene.Lights[j].ShaderProgram.LWorld = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "LWorld");
								_scene.Lights[j].ShaderProgram.LProjection = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "LProjection");
								_scene.Lights[j].ShaderProgram.LView = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "LView");

								_scene.Lights[j].ShaderProgram.Ambient = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "Ambient");
								_scene.Lights[j].ShaderProgram.Diffuse = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "Diffuse");
								_scene.Lights[j].ShaderProgram.DiffuseSampler = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "DiffuseSampler");
								_scene.Lights[j].ShaderProgram.isDiffuseTexture = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "isDiffuseTexture");

								if(_scene.Lights[j].TypeLight != 'AmbientLight')
								{
									_scene.Lights[j].ShaderProgram.Specular = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "Specular");
									_scene.Lights[j].ShaderProgram.Shininess = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "Shininess");

									_scene.Lights[j].ShaderProgram.Normal = this.Context.getAttribLocation(_scene.Lights[j].ShaderProgram, "Normal");
									_scene.Lights[j].ShaderProgram.Tangent = this.Context.getAttribLocation(_scene.Lights[j].ShaderProgram, "Tangent");
									_scene.Lights[j].ShaderProgram.Binormal = this.Context.getAttribLocation(_scene.Lights[j].ShaderProgram, "Binormal");

									_scene.Lights[j].ShaderProgram.BumpSampler = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "BumpSampler");
									_scene.Lights[j].ShaderProgram.SpecularSampler = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "SpecularSampler");	
									_scene.Lights[j].ShaderProgram.ShadowMapSampler = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "ShadowMapSampler");
									_scene.Lights[j].ShaderProgram.isBumpTexture = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "isBumpTexture");	
									_scene.Lights[j].ShaderProgram.isShadows = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "isShadows");
									_scene.Lights[j].ShaderProgram.isSpecularTexture = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "isSpecularTexture");

						    		_scene.Lights[j].ShaderProgram.NormalWorld = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "NormalWorld");
									_scene.Lights[j].ShaderProgram.Camera = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "Camera");
									_scene.Lights[j].ShaderProgram.Dimensions = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "Dimensions");
									_scene.Lights[j].ShaderProgram.isSpecular = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "isSpecular");
									_scene.Lights[j].ShaderProgram.isLight = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "isLight");
								}

								switch(_scene.Lights[j].TypeLight)
								{
									case 'AmbientLight': 
									{
										_scene.Lights[j].ShaderProgram.EmissiveSampler = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "EmissiveSampler");
										_scene.Lights[j].ShaderProgram.isEmissiveTexture = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "isEmissiveTexture");

										_scene.Lights[j].ShaderProgram.AmbientColor = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "AmbientColor");
									}
									break;

									case 'DirectionalLight' :
									{
										_scene.Lights[j].ShaderProgram.Direction = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "Direction");
										_scene.Lights[j].ShaderProgram.DirectionColor = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "DirectionColor");
									}
									break;

									case 'PointLight' :
									{
										_scene.Lights[j].ShaderProgram.Point = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "Point");
										_scene.Lights[j].ShaderProgram.PointColor = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "PointColor");
										_scene.Lights[j].ShaderProgram.Range = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "Range");
									}
									break;

									case 'SpotLight' :
									{
										_scene.Lights[j].ShaderProgram.Spot = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "Spot");
										_scene.Lights[j].ShaderProgram.SpotColor = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "SpotColor");
										_scene.Lights[j].ShaderProgram.Direction = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "Direction");
										_scene.Lights[j].ShaderProgram.Exp = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "Exp");
										_scene.Lights[j].ShaderProgram.Range = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "Range");
										_scene.Lights[j].ShaderProgram.Distance = this.Context.getUniformLocation(_scene.Lights[j].ShaderProgram, "Distance");
									}
									break;
								}
							}

							this.Context.useProgram(_scene.Lights[j].ShaderProgram);
							this.Context.enableVertexAttribArray(_scene.Lights[j].ShaderProgram.Pos);
							this.Context.enableVertexAttribArray(_scene.Lights[j].ShaderProgram.TexCoord);

							switch(_scene.Lights[j].TypeLight)
							{
								case 'AmbientLight': 
								{
									this.DisableBlend();
								}
								break;

								default :
								{
									this.EnableBlend();
									this.Context.enableVertexAttribArray(_scene.Lights[j].ShaderProgram.Normal);
									this.Context.enableVertexAttribArray(_scene.Lights[j].ShaderProgram.Tangent);
									this.Context.enableVertexAttribArray(_scene.Lights[j].ShaderProgram.Binormal);
								}
								break;						
							}


							this.Context.bindBuffer(this.Context.ARRAY_BUFFER, _scene.Objs[i].VertexBuffer);
		    				this.Context.vertexAttribPointer(_scene.Lights[j].ShaderProgram.Pos, _scene.Objs[i].CountVertexItem, this.Context.FLOAT, false, 0, 0);
		    				
		    				this.Context.bindBuffer(this.Context.ELEMENT_ARRAY_BUFFER, _scene.Objs[i].IndexBuffer);

							this.Context.bindBuffer(this.Context.ARRAY_BUFFER, _scene.Objs[i].TexCoordBuffer);
							this.Context.vertexAttribPointer(_scene.Lights[j].ShaderProgram.TexCoord, _scene.Objs[i].CountTexCoordItem, this.Context.FLOAT, false, 0, 0);

		    				this.Context.uniformMatrix4fv(_scene.Lights[j].ShaderProgram.World, false, _scene.Objs[i].GetWorldMatrix());
		    				this.Context.uniformMatrix4fv(_scene.Lights[j].ShaderProgram.View, false, _camera.GetViewMatrix());
		    				this.Context.uniformMatrix4fv(_scene.Lights[j].ShaderProgram.Projection, false, _camera.Projection);

		    				this.Context.uniformMatrix4fv(_scene.Lights[j].ShaderProgram.LWorld, false, _scene.Objs[i].GetWorldMatrix());
		    				this.Context.uniformMatrix4fv(_scene.Lights[j].ShaderProgram.LView, false, _scene.Lights[j].GetViewMatrix());
		    				this.Context.uniformMatrix4fv(_scene.Lights[j].ShaderProgram.LProjection, false, _scene.Lights[j].Projection);

							this.Context.uniform4fv(_scene.Lights[j].ShaderProgram.Ambient, _scene.Objs[i].Material.Ambient.GetVector4DA());
							this.Context.uniform4fv(_scene.Lights[j].ShaderProgram.Diffuse, _scene.Objs[i].Material.Diffuse.GetVector4DA());
		    				this.Context.uniform1i(_scene.Lights[j].ShaderProgram.isDiffuseTexture, _scene.Objs[i].Material.TextureDiffuse.isTexture);
										
							this.Context.activeTexture(this.Context.TEXTURE0);
							this.Context.bindTexture(this.Context.TEXTURE_2D, _scene.Objs[i].Material.TextureDiffuse.Texture);
							this.Context.uniform1i(_scene.Lights[j].ShaderProgram.DiffuseSampler, 0);
					

							if(_scene.Lights[j].TypeLight != 'AmbientLight')
							{
								this.Context.uniform4fv(_scene.Lights[j].ShaderProgram.Specular, _scene.Objs[i].Material.Specular.GetVector4DA());
								this.Context.uniform1f(_scene.Lights[j].ShaderProgram.Shininess, _scene.Objs[i].Material.Shininess);
								
								this.Context.activeTexture(this.Context.TEXTURE2);
								this.Context.bindTexture(this.Context.TEXTURE_2D, _scene.Objs[i].Material.TextureBump.Texture);
								this.Context.uniform1i(_scene.Lights[j].ShaderProgram.BumpSampler, 2);
									
								this.Context.activeTexture(this.Context.TEXTURE3);
								this.Context.bindTexture(this.Context.TEXTURE_2D, _scene.Objs[i].Material.TextureSpecular.Texture);
								this.Context.uniform1i(_scene.Lights[j].ShaderProgram.SpecularSampler, 3);

								this.Context.activeTexture(this.Context.TEXTURE4);
								this.Context.bindTexture(this.Context.TEXTURE_2D, _scene.Lights[j].ShadowMap.RT.Texture);
								this.Context.uniform1i(_scene.Lights[j].ShaderProgram.ShadowMapSampler, 4);

								this.Context.bindBuffer(this.Context.ARRAY_BUFFER, _scene.Objs[i].NormalBuffer);					
								this.Context.vertexAttribPointer(_scene.Lights[j].ShaderProgram.Normal, _scene.Objs[i].CountNormalItem, this.Context.FLOAT, false, 0, 0);

								this.Context.bindBuffer(this.Context.ARRAY_BUFFER, _scene.Objs[i].TangentBuffer);					
								this.Context.vertexAttribPointer(_scene.Lights[j].ShaderProgram.Tangent, _scene.Objs[i].CountTangentItem, this.Context.FLOAT, false, 0, 0);

								this.Context.bindBuffer(this.Context.ARRAY_BUFFER, _scene.Objs[i].BinormalBuffer);					
								this.Context.vertexAttribPointer(_scene.Lights[j].ShaderProgram.Binormal, _scene.Objs[i].CountBinormalItem, this.Context.FLOAT, false, 0, 0);

		    					this.Context.uniform1i(_scene.Lights[j].ShaderProgram.isBumpTexture, _scene.Objs[i].Material.TextureBump.isTexture);
		    					this.Context.uniform1i(_scene.Lights[j].ShaderProgram.isSpecularTexture, _scene.Objs[i].Material.TextureSpecular.isTexture);
		    					this.Context.uniform1i(_scene.Lights[j].ShaderProgram.isShadows, _scene.Lights[j].isShadows);

								this.Context.uniformMatrix3fv(_scene.Lights[j].ShaderProgram.NormalWorld, false, _scene.Objs[i].NormalWorld);
								this.Context.uniform3fv(_scene.Lights[j].ShaderProgram.Camera, _camera.Position.GetVector3DA());
								this.Context.uniform4fv(_scene.Lights[j].ShaderProgram.Dimensions, _scene.Lights[j].Dimensions.GetVector4DA());

								this.Context.uniform1i(_scene.Lights[j].ShaderProgram.isSpecular, _scene.Lights[j].isSpecular);
								this.Context.uniform1i(_scene.Lights[j].ShaderProgram.isLight, _scene.Lights[j].isLight);
							}

							switch(_scene.Lights[j].TypeLight)
							{
								case 'AmbientLight': 
								{
									this.Context.uniform1i(_scene.Lights[j].ShaderProgram.isEmissiveTexture, _scene.Objs[i].Material.TextureEmissive.isTexture);

									this.Context.activeTexture(this.Context.TEXTURE1);
									this.Context.bindTexture(this.Context.TEXTURE_2D, _scene.Objs[i].Material.TextureEmissive.Texture);
									this.Context.uniform1i(_scene.Lights[j].ShaderProgram.EmissiveSampler, 1);	

									this.Context.uniform4fv(_scene.Lights[j].ShaderProgram.AmbientColor, _scene.Lights[j].Color.GetVector4DA());
								}
								break;

								case 'DirectionalLight':
								{
									var Direction = vec3.create();
									Direction = _scene.Lights[j].Direction.GetVector3DA();
									vec3.normalize(Direction, Direction);
									vec3.scale(Direction, -1);

									this.Context.uniform3fv(_scene.Lights[j].ShaderProgram.Direction, Direction);
									this.Context.uniform4fv(_scene.Lights[j].ShaderProgram.DirectionColor, _scene.Lights[j].Color.GetVector4DA());														
								}
								break;

								case 'PointLight':
								{
									this.Context.uniform3fv(_scene.Lights[j].ShaderProgram.Point, _scene.Lights[j].Position.GetVector3DA());
									this.Context.uniform4fv(_scene.Lights[j].ShaderProgram.PointColor, _scene.Lights[j].Color.GetVector4DA());
									this.Context.uniform1f(_scene.Lights[j].ShaderProgram.Range, _scene.Lights[j].Range);								
								}
								break;	

								case 'SpotLight':
								{
									var Direction = vec3.create();
									Direction = _scene.Lights[j].Direction.GetVector3DA();
									vec3.normalize(Direction, Direction);
									vec3.scale(Direction, -1);

									this.Context.uniform3fv(_scene.Lights[j].ShaderProgram.Spot, _scene.Lights[j].Position.GetVector3DA());
									this.Context.uniform4fv(_scene.Lights[j].ShaderProgram.SpotColor, _scene.Lights[j].Color.GetVector4DA());
									this.Context.uniform3fv(_scene.Lights[j].ShaderProgram.Direction, Direction);
									this.Context.uniform1f(_scene.Lights[j].ShaderProgram.Exp, _scene.Lights[j].Exp);
									this.Context.uniform1f(_scene.Lights[j].ShaderProgram.Range, Math.cos(degToRad(_scene.Lights[j].Range)));
									this.Context.uniform1f(_scene.Lights[j].ShaderProgram.Distance, _scene.Lights[j].Distance);								
								}
								break;												
							}

		     				//this.Context.drawArrays(this.Context.TRIANGLE_STRIP, 0, _scene.Objs[j].CountIndex);
		     				this.Context.drawElements(this.Context.TRIANGLES, _scene.Objs[i].CountIndex, this.Context.UNSIGNED_SHORT, 0);
	     				}
					}
				}

				this.DisableBlend();
			},

			Effect: function(_rt, _effect)
			{
				if(!_rt.Screen.VertexBuffer) _rt.Screen.VertexBuffer = this.CreateBuffer(_rt.Screen.Vertices);
				if(!_rt.Screen.IndexBuffer) _rt.Screen.IndexBuffer = this.CreateElementBuffer(_rt.Screen.Indices); 
				if(!_rt.Screen.TexCoordBuffer) _rt.Screen.TexCoordBuffer = this.CreateBuffer(_rt.Screen.TexCoords);

				switch(_effect)
				{
					case 'FXAA':
					{
						if(!U3DEW.FXAA.ShaderProgram)
						{
							var FS = this.CompileFragmentShaderCode(U3DEW.FXAA.CodeFragmentShader);
							var VS = this.CompileVertexShaderCode(U3DEW.FXAA.CodeVertexShader);
							U3DEW.FXAA.ShaderProgram = this.CreateShaderProgram(FS,VS);

							U3DEW.FXAA.ShaderProgram.Pos = this.Context.getAttribLocation(U3DEW.FXAA.ShaderProgram, "Pos");	
							U3DEW.FXAA.ShaderProgram.RTSampler = this.Context.getUniformLocation(U3DEW.FXAA.ShaderProgram, "RTSampler");
							U3DEW.FXAA.ShaderProgram.Resolution = this.Context.getUniformLocation(U3DEW.FXAA.ShaderProgram, "Resolution");						
						}

						this.Context.useProgram(U3DEW.FXAA.ShaderProgram);
						this.Context.enableVertexAttribArray(U3DEW.FXAA.ShaderProgram.Pos);

						this.Context.bindBuffer(this.Context.ARRAY_BUFFER, _rt.Screen.VertexBuffer);
						this.Context.vertexAttribPointer(U3DEW.FXAA.ShaderProgram.Pos, _rt.Screen.CountVertexItem, this.Context.FLOAT, false, 0, 0);
						
						this.Context.bindBuffer(this.Context.ELEMENT_ARRAY_BUFFER, _rt.Screen.IndexBuffer);
						
						this.Context.activeTexture(this.Context.TEXTURE0);
						this.Context.bindTexture(this.Context.TEXTURE_2D, _rt.Texture);
						this.Context.uniform1i(U3DEW.FXAA.ShaderProgram.RTSampler, 0);	

						this.Context.uniform2f(U3DEW.FXAA.ShaderProgram.Resolution, 1/this.width, 1/this.height);					
					}
					break;

					default:
					{
						if(!_rt.Screen.ShaderProgram)
						{
							var FS = this.CompileFragmentShaderCode(_rt.Screen.CodeFragmentShader);
							var VS = this.CompileVertexShaderCode(_rt.Screen.CodeVertexShader);
							_rt.Screen.ShaderProgram = this.CreateShaderProgram(FS,VS);

							_rt.Screen.ShaderProgram.Pos = this.Context.getAttribLocation(_rt.Screen.ShaderProgram, "Pos");	
							_rt.Screen.ShaderProgram.RTSampler = this.Context.getUniformLocation(_rt.Screen.ShaderProgram, "RTSampler");								
							_rt.Screen.ShaderProgram.TexCoord = this.Context.getAttribLocation(_rt.Screen.ShaderProgram, "TexCoord");
						}

						this.Context.useProgram(_rt.Screen.ShaderProgram);
						this.Context.enableVertexAttribArray(_rt.Screen.ShaderProgram.Pos);
						this.Context.enableVertexAttribArray(_rt.Screen.ShaderProgram.TexCoord);

						this.Context.bindBuffer(this.Context.ARRAY_BUFFER, _rt.Screen.VertexBuffer);
						this.Context.vertexAttribPointer(_rt.Screen.ShaderProgram.Pos, _rt.Screen.CountVertexItem, this.Context.FLOAT, false, 0, 0);
						
						this.Context.bindBuffer(this.Context.ELEMENT_ARRAY_BUFFER, _rt.Screen.IndexBuffer);

						this.Context.bindBuffer(this.Context.ARRAY_BUFFER, _rt.Screen.TexCoordBuffer);
						this.Context.vertexAttribPointer(_rt.Screen.ShaderProgram.TexCoord, _rt.Screen.CountTexCoordItem, this.Context.FLOAT, false, 0, 0);						
						
						this.Context.activeTexture(this.Context.TEXTURE0);
						this.Context.bindTexture(this.Context.TEXTURE_2D, _rt.Texture);
						this.Context.uniform1i(_rt.Screen.ShaderProgram.RTSampler, 0);																
					}
					break;
				}

				this.Context.drawElements(this.Context.TRIANGLES, _rt.Screen.CountIndex, this.Context.UNSIGNED_SHORT, 0);	
			},

			PostRender: function(_effects)
			{
				if(!this.PostRT[1].Texture || this.PostRT[1].width != this.width || this.PostRT[1].height != this.height) this.CreateRenderTexture(this.PostRT[1],this.width,this.height);

				for(var i = 0; i < _effects.length-1; i++)
				{	
					this.SetDefaultRenderTexture();			
					this.SetRenderTexture(this.PostRT[i+1%2>0?1:0]);
					this.Clear(this.ClearColor.x,this.ClearColor.y,this.ClearColor.z,1.0,1.0);			
					this.Effect(this.PostRT[i+2%2>0?1:0],_effects[0]);
				}

				this.SetDefaultRenderTexture();
				this.Effect(this.PostRT[_effects.length-1%2>0?1:0],_effects[_effects.length-1]);
			},

			UpdateFps: function()
			{
				var time = Date.now();

				this.FpsConteiner.frames ++;

				if ( time > this.FpsConteiner.prevTime + 1000 ) 
				{

					this.FpsConteiner.fps = Math.round( ( this.FpsConteiner.frames * 1000 ) / ( time - this.FpsConteiner.prevTime ) );
					this.FpsConteiner.textContent = 'FPS: '+ this.FpsConteiner.fps;
					this.FpsConteiner.prevTime = time;
					this.FpsConteiner.frames = 0;
				}
			},

			EnableFps: function()
			{
				this.FpsConteiner.style.display = 'block';
			},

			DisbaleFps: function()
			{
				this.FpsConteiner.style.display = 'none';
			},

			EnableDepthTest: function()
			{
				this.Context.enable(this.Context.DEPTH_TEST);
			},

			DisbaleDepthTest: function()
			{
				this.Context.disable(this.Context.DEPTH_TEST);
			},

			EnableCullFace: function()
			{
				this.Context.enable(this.Context.CULL_FACE);
			},

			DisbaleCullFace: function()
			{
				this.Context.disable(this.Context.CULL_FACE);
			},

			EnableBlend: function()
			{
				this.Context.enable(this.Context.BLEND);
				this.Context.disable(this.Context.DEPTH_TEST);
			},

			DisableBlend: function()
			{
				this.Context.disable(this.Context.BLEND);
				this.Context.enable(this.Context.DEPTH_TEST);
			}
		}
	}
	/*---------------End Renderer---------------*/

	/*---------------Begin Screen---------------*/
	{
		U3DEW.Screen = function()
		{
			U3DEW.Plane.call( this );
			this.ShaderProgram = null;
			this.CodeFragmentShader = 
			[
			'precision mediump float;',
			'varying vec2 fTexCoord;',

			'uniform sampler2D RTSampler;',

			'void main() {',
				'gl_FragColor = texture2D(RTSampler, vec2(fTexCoord.s, fTexCoord.t));',
			'}'].join( '\n' );

			this.CodeVertexShader = 
			[
			'attribute vec3 Pos;',
			'attribute vec2 TexCoord;',
			'varying vec2 fTexCoord;',

			'void main() {',
				'gl_Position = vec4(Pos.xy, 0.0, 1.0);',
				'fTexCoord = TexCoord;',
			'}'
			].join( '\n' );
		}
		U3DEW.Screen.prototype =
		{
			constructor: U3DEW.Screen
		}
	}
	/*---------------End Screen---------------*/

	/*---------------Begin RenderTexture---------------*/
	{
		U3DEW.RenderTexture = function()
		{
			this.Screen = new U3DEW.Screen();
			this.Texture = null;
			this.FBuffer = null;
			this.RBuffer = null;
			this.width = 0;
			this.height = 0;
		}
		U3DEW.RenderTexture.prototype =
		{
			constructor: U3DEW.RenderTexture
		}
	}
	/*---------------End RenderTexture---------------*/

	/*---------------Begin Texture---------------*/
	{
		U3DEW.Texture = function()
		{
			this.Texture = null;
			this.Image = new Image();
			this.Image.Loaded = false;
			this.isTexture = false;
		}
		U3DEW.Texture.prototype =
		{
			constructor: U3DEW.Texture,
			SetTexture: function(_src)
			{
				var _Image = new Image();
				_Image.src = _src;
				_Image.onload = function() 
				{ 
					_Image.Loaded = true;
				};
	       		this.Image = _Image;
	       		if(this.Image)
	       			this.isTexture = true;
			}
		}
	}
	/*---------------End Texture---------------*/

	/*---------------Begin ShadowMap---------------*/
	{
		U3DEW.ShadowMap = function()
		{
			this.RT = new U3DEW.RenderTexture();
			this.width = 512;
			this.height = 512;
			this.ShaderProgram = null;
			this.CodeVertexShader = [
				"attribute vec3 Pos;",

				'uniform mat4 Projection;',
				'uniform mat4 World;',
				'uniform mat4 View;',

				'varying vec3 fColor;',
				"void main() {",
					'gl_Position = Projection * View * World * vec4(Pos, 1.0);',
					'fColor = vec3(0.0,0.0,0.0);',
				"}"

			].join("\n");

			this.CodeFragmentShader = [
				"precision mediump float;",
				'varying vec3 fColor;',
				"uniform samplerCube Sampler;",

				"void main() {",				
					'gl_FragColor = vec4(fColor,1.0);',
				"}"

			].join("\n");		
		}
		U3DEW.ShadowMap.prototype =
		{
			constructor: U3DEW.ShadowMap
		}
	}
	/*---------------End ShadowMap---------------*/

	/*---------------Begin SkyBox---------------*/
	{
		U3DEW.SkyBox = function()
		{
			U3DEW.Texture.call( this );
			U3DEW.Cube.call( this );
			this.ShaderProgram = null;
			this.CodeVertexShader = [
				"attribute vec3 Pos;",

				'uniform mat4 Projection;',
				'uniform mat4 World;',
				'uniform mat4 View;',

				'varying vec3 fTexCoord;',
				"void main() {",
					'gl_Position = (Projection * View * World * vec4(Pos, 1.0)).xyww;',
					'fTexCoord = Pos.xyz;',
				"}"

			].join("\n");

			this.CodeFragmentShader = [
				"precision mediump float;",
				'varying vec3 fTexCoord;',
				"uniform samplerCube Sampler;",

				"void main() {",				
					'gl_FragColor = textureCube(Sampler, fTexCoord);',
				"}"

			].join("\n");		
		}
		U3DEW.SkyBox.prototype = Object.create( U3DEW.Texture.prototype );
	}
	/*---------------End SkyBox---------------*/

	/*---------------Begin Material---------------*/
	{
		U3DEW.Material = function()
		{
			this.TextureDiffuse = new U3DEW.Texture();
			this.TextureBump = new U3DEW.Texture();
			this.TextureSpecular = new U3DEW.Texture();
			this.TextureEmissive = new U3DEW.Texture();

			this.Ambient = new Vector4D(0.0,0.0,0.0,1.0);
			this.Diffuse = new Vector4D(1.0,1.0,1.0,1.0);
			this.Specular = new Vector4D(1.0,1.0,1.0,1.0);
			this.Emissive = new Vector4D(1.0,1.0,1.0,1.0);
			this.Shininess = 32.0;

			this.isTexture = false;
		}
		U3DEW.Material.prototype =
		{
			constructor: U3DEW.Material
		}
	}
	/*---------------End Material---------------*/

	/*---------------Begin Transform---------------*/
	{
		U3DEW.Transform = function()
		{
			this.Position = new Vector3D(0,0,0);
			this.Rotate = new Vector3D(0,0,0);
			this.Scale = new Vector3D(1,1,1);

			this.World = mat4.create();
			this.Projection =  mat4.create();
			this.View = mat4.create();
			this.NormalWorld = mat3.create();
		}
			U3DEW.Transform.prototype =
		{
			constructor: U3DEW.Transform,
			GetWorldMatrix: function()
			{
				var MP = mat4.create(); mat4.identity(MP);
				var MRx = mat4.create(); mat4.identity(MRx);
				var MRy = mat4.create(); mat4.identity(MRy);
				var MRz = mat4.create(); mat4.identity(MRz);
				var MS = mat4.create(); mat4.identity(MS);

				mat4.scale(MS, [this.Scale.x, this.Scale.y, this.Scale.z]);

			    mat4.rotate(MRx, degToRad(this.Rotate.x), [1, 0, 0]);
				mat4.rotate(MRy, degToRad(this.Rotate.y), [0, 1, 0]);
				mat4.rotate(MRz, degToRad(this.Rotate.z), [0, 0, 1]);

				mat4.translate(MP, [this.Position.x, this.Position.y, this.Position.z]);

				mat4.multiply(MRx, MS, this.World);
				mat4.multiply(this.World, MRy, this.World);
				mat4.multiply(this.World, MRz, this.World);
				mat4.multiply(MP, this.World, this.World);

				mat3.identity(this.NormalWorld);
				mat4.toInverseMat3(this.World, this.NormalWorld);
				mat3.transpose(this.NormalWorld);

				return this.World ;
			}
		}
	}
	/*---------------End Transform---------------*/

	/*---------------Begin PerspectiveCamera---------------*/
	{
		U3DEW.PerspectiveCamera = function(_fovy, _aspect, _znear, _zfar)
		{
			U3DEW.Transform.call( this );
			this.Type = 'PerspectiveCamera';
			this.Fovy = _fovy;
			this.Aspect = _aspect;
			this.Znear = _znear;
			this.Zfar = _zfar;
			this.SkyBox = new U3DEW.SkyBox();

			mat4.identity(this.Projection);
			mat4.perspective(_fovy, _aspect, _znear, _zfar, this.Projection);
		}
		U3DEW.PerspectiveCamera.prototype = 
		{
			constructor: U3DEW.PerspectiveCamera,

			Update: function()
			{
				mat4.identity(this.Projection);
				mat4.perspective(this.Fovy, this.Aspect, this.Znear, this.Zfar, this.Projection);
			},

			GetViewMatrix: function()
			{
				var MRx = mat4.create(); mat4.identity(MRx);
				var MRy = mat4.create(); mat4.identity(MRy);
				var MRz = mat4.create(); mat4.identity(MRz);
				var MR = mat4.create(); mat4.identity(MR);

				mat4.rotate(MRx, degToRad(this.Rotate.x), [1, 0, 0]);
				mat4.rotate(MRy, degToRad(this.Rotate.y), [0, 1, 0]);
				mat4.rotate(MRz, degToRad(this.Rotate.z), [0, 0, 1]);

				mat4.multiply(MRy, MRx, MR);
				mat4.multiply(MR, MRz, MR);

				var Direction = mat4.multiplyVec3(MR, [0,0,-1]);
			   	var Up = mat4.multiplyVec3(MR, [0,1,0]);
				Direction = vec3.add(Direction, this.Position.GetVector3DA());

				mat4.lookAt(this.Position.GetVector3DA(), Direction, Up, this.View);
				return this.View;					
			},

			Move: function(_x,_y,_z)
			{
				var MRx = mat4.create(); mat4.identity(MRx);
				var MRy = mat4.create(); mat4.identity(MRy);
				var MRz = mat4.create(); mat4.identity(MRz);
				var MR = mat4.create(); mat4.identity(MR);

				mat4.rotate(MRx, degToRad(this.Rotate.x), [1, 0, 0]);
				mat4.rotate(MRy, degToRad(this.Rotate.y), [0, 1, 0]);
				mat4.rotate(MRz, degToRad(this.Rotate.z), [0, 0, 1]);

				mat4.multiply(MRy, MRx, MR);
				mat4.multiply(MR, MRz, MR);

				var Direction = mat4.multiplyVec3(MR, [_x,_y,_z]);

				this.Position.x += Direction[0];
				this.Position.y += Direction[1];
				this.Position.z += Direction[2];
			},

			GetWorldMatrix: function()
			{
				var MP = mat4.create(); mat4.identity(MP);
				mat4.translate(MP, [this.Position.x, this.Position.y, this.Position.z]);
				return MP;
			}
		}
	}
	/*---------------End PerspectiveCamera---------------*/

	/*---------------Begin 3DObject---------------*/
	{
		/*---------------Begin Object3D---------------*/
		{
			U3DEW.Object3D = function()
			{
				U3DEW.Transform.call( this );

				this.Material = new U3DEW.Material();

				this.VertexBuffer = 0;
				this.IndexBuffer = 0;
				this.NormalBuffer = 0;
				this.TangentBuffer = 0;
				this.BinormalBuffer = 0;
				this.TexCoordBuffer = 0;

				this.Vertices = [];
				this.CountVertex = 0;
				this.CountVertexItem = 0;

				this.Indices = [];
				this.CountIndex = 0;
				this.CountIndexItem = 0;

				this.Normals = [];	
				this.CountNormal = 0;
				this.CountNormalItem = 0;

				this.Tangents = [];	
				this.CountTangent = 0;
				this.CountTangentItem = 0;

				this.Binormals = [];	
				this.CountBinormal = 0;
				this.CountBinormalItem = 0;

				this.TexCoords = [];
				this.CountTexCoord = 0;
				this.CountTexCoordItem = 0;	

				this.isCastShadow	= false;			
			}
			U3DEW.Object3D.prototype = Object.create( U3DEW.Transform.prototype );
			U3DEW.Object3D.prototype.CalcNormal = function()
			{
				ComputeTangentBinormal = function(vertex1,vertex2,vertex3,texcoord1,texcoord2,texcoord3,tangent,binormal)
				{
					var vector1 = [], vector2 = [];
					var tuVector = [], tvVector = [];
					var den;
					var length;

					vector1[0] = vertex2[0] - vertex1[0];
					vector1[1] = vertex2[1] - vertex1[1];
					vector1[2] = vertex2[2] - vertex1[2];

					vector2[0] = vertex3[0] - vertex1[0];
					vector2[1] = vertex3[1] - vertex1[1];
					vector2[2] = vertex3[2] - vertex1[2];

					tuVector[0] = texcoord2[0] - texcoord1[0];
					tvVector[0] = texcoord2[1] - texcoord1[1];

					tuVector[1] = texcoord3[0] - texcoord1[0];
					tvVector[1] = texcoord3[1] - texcoord1[1];

					den = 1.0 / (tuVector[0] * tvVector[1] - tuVector[1] * tvVector[0]);


					tangent[0] = (tvVector[1] * vector1[0] - tvVector[0] * vector2[0]) * den;
					tangent[1] = (tvVector[1] * vector1[1] - tvVector[0] * vector2[1]) * den;
					tangent[2] = (tvVector[1] * vector1[2] - tvVector[0] * vector2[2]) * den;

					binormal[0] = (tuVector[0] * vector2[0] - tuVector[1] * vector1[0]) * den;
					binormal[1] = (tuVector[0] * vector2[1] - tuVector[1] * vector1[1]) * den;
					binormal[2] = (tuVector[0] * vector2[2] - tuVector[1] * vector1[2]) * den;

					length = Math.sqrt((tangent[0] * tangent[0]) + (tangent[1] * tangent[1]) + (tangent[2] * tangent[2]));

					tangent[0] = tangent[0] / length;
					tangent[1] = tangent[1] / length;
					tangent[2] = tangent[2] / length;

					length = Math.sqrt((binormal[0] * binormal[0]) + (binormal[1] * binormal[1]) + (binormal[2] * binormal[2]));

					binormal[0] = binormal[0] / length;
					binormal[1] = binormal[1] / length;
					binormal[2] = binormal[2] / length;
				}

				for (var i = 0; i < this.CountIndex-2; i++)
				{
					var tangent = [], binormal = [];

					var vertex1 = [];
					vertex1[0] = this.Vertices[this.Indices[i]*3];
					vertex1[1] = this.Vertices[this.Indices[i]*3+1];
					vertex1[2] = this.Vertices[this.Indices[i]*3+2];
					var texcoord1 = [];
					texcoord1[0] = this.TexCoords[this.Indices[i]*2];
					texcoord1[1] = this.TexCoords[this.Indices[i]*2+1];

					var vertex2 = [];
					vertex2[0] = this.Vertices[this.Indices[i+1]*3];
					vertex2[1] = this.Vertices[this.Indices[i+1]*3+1];
					vertex2[2] = this.Vertices[this.Indices[i+1]*3+2];
					var texcoord2 = [];
					texcoord2[0] = this.TexCoords[this.Indices[i+1]*2];
					texcoord2[1] = this.TexCoords[this.Indices[i+1]*2+1];			

					var vertex3 = [];
					vertex3[0] = this.Vertices[this.Indices[i+2]*3];
					vertex3[1] = this.Vertices[this.Indices[i+2]*3+1];
					vertex3[2] = this.Vertices[this.Indices[i+2]*3+2];
					var texcoord3 = [];
					texcoord3[0] = this.TexCoords[this.Indices[i+2]*2];
					texcoord3[1] = this.TexCoords[this.Indices[i+2]*2+1];

					ComputeTangentBinormal(vertex1, vertex2, vertex3,
										texcoord1, texcoord2, texcoord3, 
										tangent, binormal);

					this.Tangents[this.Indices[i]*3] = tangent[0];
					this.Tangents[this.Indices[i]*3+1] = tangent[1];
					this.Tangents[this.Indices[i]*3+2] = tangent[2];
					this.Binormals[this.Indices[i]*3] = binormal[0];
					this.Binormals[this.Indices[i]*3+1] = binormal[1];
					this.Binormals[this.Indices[i]*3+2] = binormal[2];

					this.Tangents[this.Indices[i+1]*3] = tangent[0];
					this.Tangents[this.Indices[i+1]*3+1] = tangent[1];
					this.Tangents[this.Indices[i+1]*3+2] = tangent[2];
					this.Binormals[this.Indices[i+1]*3] = binormal[0];
					this.Binormals[this.Indices[i+1]*3+1] = binormal[1];
					this.Binormals[this.Indices[i+1]*3+2] = binormal[2];

					this.Tangents[this.Indices[i+2]*3] = tangent[0];
					this.Tangents[this.Indices[i+2]*3+1] = tangent[1];
					this.Tangents[this.Indices[i+2]*3+2] = tangent[2];
					this.Binormals[this.Indices[i+2]*3] = binormal[0];
					this.Binormals[this.Indices[i+2]*3+1] = binormal[1];
					this.Binormals[this.Indices[i+2]*3+2] = binormal[2];

				}

				this.CountTangent = this.CountBinormal = this.CountVertex;
				this.CountTangentItem = this.CountBinormalItem = this.CountVertexItem;		
			};	
		}
		/*---------------End Object3D---------------*/

		/*---------------Begin Plane---------------*/
		{
			U3DEW.Plane = function(_width, _height)
			{
				U3DEW.Object3D.call( this );
				this.Scale = new Vector3D(_width,_height,1);

				this.Vertices = [
									// Front face
									-1.0, -1.0,  1.0,
									1.0, -1.0,  1.0,
									1.0,  1.0,  1.0,
									-1.0,  1.0,  1.0
								];
				this.CountVertex = 4;
				this.CountVertexItem = 3;

				this.Indices = [
				    0, 1, 2,      0, 2, 3    // Front face
				];

				this.CountIndex = 6;
				this.CountIndexItem = 1;

		    	this.Normals = [
										// Front face
										0.0,  0.0,  1.0,
										0.0,  0.0,  1.0,
										0.0,  0.0,  1.0,
										0.0,  0.0,  1.0
		    	];

				this.CountNormal = 4;
				this.CountNormalItem = 3;

				this.TexCoords = [
									// Front face
									0.0, 0.0,
									1.0, 0.0,
									1.0, 1.0,
									0.0, 1.0
		        ];

				this.CountTexCoord = 4;
				this.CountTexCoordItem = 2;		
			}
			U3DEW.Plane.prototype = Object.create( U3DEW.Object3D.prototype );
		}
		/*---------------End Plane---------------*/

		/*---------------Begin Cube---------------*/
		{
			U3DEW.Cube = function(_width, _height, _depth)
			{
				U3DEW.Object3D.call( this );
				this.Scale = new Vector3D(_width,_height,_depth);

				this.Vertices = [
									// Front face
									-1.0, -1.0,  1.0,
									1.0, -1.0,  1.0,
									1.0,  1.0,  1.0,
									-1.0,  1.0,  1.0,

									// Back face
									-1.0, -1.0, -1.0,
									-1.0,  1.0, -1.0,
									1.0,  1.0, -1.0,
									1.0, -1.0, -1.0,

									// Top face
									-1.0,  1.0, -1.0,
									-1.0,  1.0,  1.0,
									1.0,  1.0,  1.0,
									1.0,  1.0, -1.0,

									// Bottom face
									-1.0, -1.0, -1.0,
									1.0, -1.0, -1.0,
									1.0, -1.0,  1.0,
									-1.0, -1.0,  1.0,

									// Right face
									1.0, -1.0, -1.0,
									1.0,  1.0, -1.0,
									1.0,  1.0,  1.0,
									1.0, -1.0,  1.0,

									// Left face
									-1.0, -1.0, -1.0,
									-1.0, -1.0,  1.0,
									-1.0,  1.0,  1.0,
									-1.0,  1.0, -1.0,
				];

				this.CountVertex = 24;
				this.CountVertexItem = 3;

				this.Indices = [
				    0, 1, 2,      0, 2, 3,    // Front face
				    4, 5, 6,      4, 6, 7,    // Back face
				    8, 9, 10,     8, 10, 11,  // Top face
				    12, 13, 14,   12, 14, 15, // Bottom face
				    16, 17, 18,   16, 18, 19, // Right face
				    20, 21, 22,   20, 22, 23  // Left face
				];

				this.CountIndex = 36;
				this.CountIndexItem = 1;

		    	this.Normals = [
										// Front face
										0.0,  0.0,  1.0,
										0.0,  0.0,  1.0,
										0.0,  0.0,  1.0,
										0.0,  0.0,  1.0,

										// Back face
										0.0,  0.0, -1.0,
										0.0,  0.0, -1.0,
										0.0,  0.0, -1.0,
										0.0,  0.0, -1.0,

										// Top face
										0.0,  1.0,  0.0,
										0.0,  1.0,  0.0,
										0.0,  1.0,  0.0,
										0.0,  1.0,  0.0,

										// Bottom face
										0.0, -1.0,  0.0,
										0.0, -1.0,  0.0,
										0.0, -1.0,  0.0,
										0.0, -1.0,  0.0,

										// Right face
										1.0,  0.0,  0.0,
										1.0,  0.0,  0.0,
										1.0,  0.0,  0.0,
										1.0,  0.0,  0.0,

										// Left face
										-1.0,  0.0,  0.0,
										-1.0,  0.0,  0.0,
										-1.0,  0.0,  0.0,
										-1.0,  0.0,  0.0,
		    	];

				this.CountNormal = 24;
				this.CountNormalItem = 3;

				this.TexCoords = [
									// Front face
									0.0, 0.0,
									1.0, 0.0,
									1.0, 1.0,
									0.0, 1.0,

									// Back face
									1.0, 0.0,
									1.0, 1.0,
									0.0, 1.0,
									0.0, 0.0,

									// Top face
									0.0, 1.0,
									0.0, 0.0,
									1.0, 0.0,
									1.0, 1.0,

									// Bottom face
									1.0, 1.0,
									0.0, 1.0,
									0.0, 0.0,
									1.0, 0.0,

									// Right face
									1.0, 0.0,
									1.0, 1.0,
									0.0, 1.0,
									0.0, 0.0,

									// Left face
									0.0, 0.0,
									1.0, 0.0,
									1.0, 1.0,
									0.0, 1.0,
		        ];

				this.CountTexCoord = 24;
				this.CountTexCoordItem = 2;
			
			}
			U3DEW.Cube.prototype = Object.create( U3DEW.Object3D.prototype );
		}
		/*---------------End Cube---------------*/
	}
	/*---------------End 3DObject---------------*/

	/*---------------Begin Light---------------*/
	{
		/*---------------Begin Light---------------*/
		{
			U3DEW.Light = function()
			{
				U3DEW.Transform.call( this );
				this.Type = 'Light';
				this.Color = new Vector4D(1.0,1.0,1.0,1.0);
				this.ShaderProgram = null;
				this.ShadowMap = new U3DEW.ShadowMap();
				this.isShadows = false;
				mat4.identity(this.Projection);
				mat4.perspective(45, this.ShadowMap.width/this.ShadowMap.height, 0.1, 1000, this.Projection);
				this.Dimensions = new Vector4D(this.ShadowMap.width,this.ShadowMap.height,1/this.ShadowMap.width,1/this.ShadowMap.height);
				this.Direction = new Vector3D(0.0,0.0,-1.0);
				this.isSpecular = false;
				this.isLight = true;
			}
			U3DEW.Light.prototype = 
			{
				constructor: U3DEW.Light,
				GetWorldMatrix: function()
				{
					var MP = mat4.create(); mat4.identity(MP);
					mat4.translate(MP, [this.Position.x, this.Position.y, this.Position.z]);
					return MP;
				},
				GetViewMatrix: function()
				{
					var MRx = mat4.create(); mat4.identity(MRx);
					var MRy = mat4.create(); mat4.identity(MRy);
					var MRz = mat4.create(); mat4.identity(MRz);
					var MR = mat4.create(); mat4.identity(MR);

					mat4.rotate(MRx, degToRad(this.Rotate.x), [1, 0, 0]);
					mat4.rotate(MRy, degToRad(this.Rotate.y), [0, 1, 0]);
					mat4.rotate(MRz, degToRad(this.Rotate.z), [0, 0, 1]);

					mat4.multiply(MRy, MRx, MR);
					mat4.multiply(MR, MRz, MR);

					var Direction = mat4.multiplyVec3(MR, this.Direction.GetVector3DA());
				   	var Up = mat4.multiplyVec3(MR, [0,1,0]);
					Direction = vec3.add(Direction, this.Position.GetVector3DA());

					mat4.lookAt(this.Position.GetVector3DA(), Direction, Up, this.View);
					return this.View;					
				}				
			}
		}
		/*---------------End Light---------------*/

		/*---------------Begin ShadowFragment---------------*/
		{
			ShadowFragment = 
			[
				'#define FILTER_SIZE    11',
				'#define FS  FILTER_SIZE',
				'#define FS2 ( FILTER_SIZE / 2 )',

				// 4 control matrices for a dynamic cubic bezier filter weights matrix
				
				'float C3[121];',
				'float C2[121];',
				'float C1[121];',
				'float C0[121];',

				'void initWeights() {',

					'if(C3[0] == 1.0) return;',

					'for(int i = 0; i < 121; i++) {',
						'C3[i] = 1.0;',

						'if(i>12 && i<22)',
							'C2[i] = 0.2;',
						'if(i==24 || i==35 || i==46 || i==57 || i==68 || i==79 || i==90)',
							'C2[i] = 0.2;',
						'if(i>100 && i<110)',
							'C2[i] = 0.2;',
						'if(i==32 || i==43 || i==54 || i==65 || i==76 || i==87 || i==98)',
							'C2[i] = 0.2;',	

						'if(i>24 && i<32)',
							'C2[i] = 1.0;',
						'if(i>35 && i<43)',
							'C2[i] = 1.0;',	
						'if(i>46 && i<54)',
							'C2[i] = 1.0;',		
						'if(i>57 && i<65)',
							'C2[i] = 1.0;',
						'if(i>68 && i<76)',
							'C2[i] = 1.0;',
						'if(i>79 && i<87)',
							'C2[i] = 1.0;',
						'if(i>90 && i<98)',
							'C2[i] = 1.0;',

						'if(i>23 && i<32)',
							'C1[i] = 0.2;',
						'if(i==35 || i==46 || i==57 || i==68 || i==79 )',
							'C1[i] = 0.2;',
						'if(i>90 && i<101)',
							'C1[i] = 0.2;',
						'if(i==42 || i==53 || i==64 || i==75 || i==86 )',
							'C1[i] = 0.2;',

						'if(i>35 && i<42)',
							'C1[i] = 1.0;',
						'if(i>46 && i<53)',
							'C1[i] = 1.0;',	
						'if(i>57 && i<64)',
							'C1[i] = 1.0;',		
						'if(i>68 && i<75)',
							'C1[i] = 1.0;',
						'if(i>79 && i<86)',
							'C1[i] = 1.0;',	

						'if(i>59 && i<64)',
							'C0[i] = 0.8;',
						'if(i==72 || i==83)',
							'C0[i] = 0.8;',
						'if(i>94 && i<96)',
							'C0[i] = 0.8;',
						'if(i==74 || i==85)',
							'C0[i] = 0.8;',

						'if(i==84)',
							'C0[i] = 1.0;',																											
					'}',
				'}',
				
				// compute dynamic weight at a certain row, column of the matrix
				'float Fw( const int r, float fL )',
				'{',
				    'return (1.0-fL)*(1.0-fL)*(1.0-fL) * C0[r] +',
				           'fL*fL*fL * C3[r] +',
				           '3.0 * (1.0-fL)*(1.0-fL)*fL * C1[r]+',
				           '3.0 * fL*fL*(1.0-fL) * C2[r];',
				'}', 

				'#define BLOCKER_FILTER_SIZE    11',
				'#define BFS  BLOCKER_FILTER_SIZE',
				'#define BFS2 ( BLOCKER_FILTER_SIZE / 2 )',

				   
				//======================================================================================
				// This shader computes the contact hardening shadow filter
				//======================================================================================
				'float shadow( vec3 tc, vec4 vShadowMapDimensions, sampler2D  txShadowMap, float fSunWidth) {',
				    'float  s   = 0.0;',
				   	'vec2 stc = ( vShadowMapDimensions.xy * tc.xy ) + vec2( 0.5, 0.5 );',
				    'vec2 tcs = floor( stc );',
				   	'vec2 fc;',
				    'int    row;',
				    'int    col;',
				    'float  w = 0.0;',
				    'float  avgBlockerDepth = 0.0;',
				    'float  blockerCount = 0.0;',
				    'float  fRatio;',
				    'vec4 v1[ FS2 + 1 ];',
				    'vec2 v0[ FS2 + 1 ];',
				    'vec2 off;',

				    'fc     = stc - tcs;',
				    'tc.xy  = tc.xy - ( fc * vShadowMapDimensions.zw );',

				    // find number of blockers and sum up blocker depth
				    'for( row = -BFS2; row <= BFS2; row += 2 )',
				        'for( col = -BFS2; col <= BFS2; col += 2 ) {',
				            'vec4 d4 = texture2D( txShadowMap, tc.xy + vec2( col, row )).xxxx;',
				            'vec4 b4  = ( tc.z <= d4.x && tc.z <= d4.y && tc.z <= d4.z && tc.z <= d4.w) ? vec4(0.0).xxxx : vec4(1.0).xxxx;',  

				            'blockerCount += dot( b4, vec4(1.0).xxxx );',
				            'avgBlockerDepth += dot( d4, b4 );',
				       '}',

				    // compute ratio using formulas from PCSS
				    'if( blockerCount > 0.0 ) {',
				        'avgBlockerDepth /= blockerCount;',
				        'fRatio = max(( ( ( tc.z - avgBlockerDepth ) * fSunWidth ) / avgBlockerDepth), 0.0);',
				        'fRatio *= fRatio;',
				    '}',
				    'else',
				        'fRatio = 0.0;', 

				    // sum up weights of dynamic filter matrix
				    'for( row = 0; row < FS; ++row )',
				       'for( col = 0; col < FS; ++col )',
				          'w += Fw(row*11+col,fRatio);',

				    // filter shadow map samples using the dynamic weights
				    'for( row = -FS2; row <= FS2; row += 2 ) {',
				        'for( col = -FS2; col <= FS2; col += 2 ) {',
				            'v1[(col+FS2)/2] = texture2D( txShadowMap, tc.xy + vec2( col, row )).xxxx;',
				          
				            'if( col == -FS2 ) {',
				                's += ( 1.0 - fc.y ) * ( v1[0].w * ( Fw((row+FS2)*11,fRatio) -', 
				                                      'Fw((row+FS2)*11,fRatio) * fc.x ) + v1[0].z * ',
				                                    '( fc.x * ( Fw((row+FS2)*11,fRatio) -', 
				                                      'Fw((row+FS2)*11+1,fRatio) ) +  ',
				                                      'Fw((row+FS2)*11+1,fRatio) ) );',
				                's += (     fc.y ) * ( v1[0].x * ( Fw((row+FS2)*11,fRatio) -', 
				                                      'Fw((row+FS2)*11,fRatio) * fc.x ) +', 
				                                      'v1[0].y * ( fc.x * ( Fw((row+FS2)*11,fRatio) - ',
				                                      'Fw((row+FS2)*11+1,fRatio) ) + ', 
				                                      'Fw((row+FS2)*11+1,fRatio) ) );',
				               ' if( row > -FS2 ) {',
				                    's += ( 1.0 - fc.y ) * ( v0[0].x * ( Fw((row+FS2-1)*11,fRatio) -', 
				                                          'Fw((row+FS2-1)*11,fRatio) * fc.x ) + v0[0].y * ',
				                                        '( fc.x * ( Fw((row+FS2-1)*11,fRatio) -',
				                                          'Fw((row+FS2-1)*11+1,fRatio) ) + ', 
				                                          'Fw((row+FS2-1)*11+1,fRatio) ) );',
				                    's += (     fc.y ) * ( v1[0].w * ( Fw((row+FS2-1)*11,fRatio) -', 
				                                          'Fw((row+FS2-1)*11,fRatio) * fc.x ) + v1[0].z *', 
				                                        '( fc.x * ( Fw((row+FS2-1)*11,fRatio) -', 
				                                          'Fw((row+FS2-1)*11+1,fRatio) ) + ', 
				                                          'Fw((row+FS2-1)*11+1,fRatio) ) );',
				                '}',
				            '}',
				            'else if( col == FS2 ) {',
				                's += ( 1.0 - fc.y ) * ( v1[FS2].w * ( fc.x * ( Fw((row+FS2)*11+FS-2,fRatio) -', 
				                                      'Fw((row+FS2)*11+FS-1,fRatio) ) + ',
				                                      'Fw((row+FS2)*11+FS-1,fRatio) ) + v1[FS2].z * fc.x *', 
				                                      'Fw((row+FS2)*11+FS-1,fRatio) );',
				                's += (     fc.y ) * ( v1[FS2].x * ( fc.x * ( Fw((row+FS2)*11+FS-2,fRatio) -', 
				                                      'Fw((row+FS2)*11+FS-1,fRatio) ) + ',
				                                      'Fw((row+FS2)*11+FS-1,fRatio) ) + v1[FS2].y * fc.x *', 
				                                      'Fw((row+FS2)*11+FS-1,fRatio) );',
				                'if( row > -FS2 ) {',
				                    's += ( 1.0 - fc.y ) * ( v0[FS2].x * ( fc.x *', 
				                                        '( Fw((row+FS2-1)*11+FS-2,fRatio) - ',
				                                          'Fw((row+FS2-1)*11+FS-1,fRatio) ) + ',
				                                          'Fw((row+FS2-1)*11+FS-1,fRatio) ) + ',
				                                          'v0[FS2].y * fc.x * Fw((row+FS2-1)*11+FS-1,fRatio) );',
				                    's += (     fc.y ) * ( v1[FS2].w * ( fc.x * ',
				                                        '( Fw((row+FS2-1)*11+FS-2,fRatio) -', 
				                                          'Fw((row+FS2-1)*11+FS-1,fRatio) ) +', 
				                                          'Fw((row+FS2-1)*11+FS-1,fRatio) ) + ',
				                                          'v1[FS2].z * fc.x * Fw((row+FS2-1)*11+FS-1,fRatio) );',
				                '}',
				            '}',
				            'else {',
				                's += ( 1.0 - fc.y ) * ( v1[(col+FS2)/2].w * ( fc.x *', 
				                                    '( Fw((row+FS2)*11+col+FS2-1,fRatio) -', 
				                                      'Fw((row+FS2)*11+col+FS2+0,fRatio) ) + ',
				                                      'Fw((row+FS2)*11+col+FS2+0,fRatio) ) +',
				                                      'v1[(col+FS2)/2].z * ( fc.x * ',
				                                    '( Fw((row+FS2)*11+col+FS2-0,fRatio) -', 
				                                      'Fw((row+FS2)*11+col+FS2+1,fRatio) ) +', 
				                                      'Fw((row+FS2)*11+col+FS2+1,fRatio) ) );',
				                's += (     fc.y ) * ( v1[(col+FS2)/2].x * ( fc.x *', 
				                                    '( Fw((row+FS2)*11+col+FS2-1,fRatio) -', 
				                                      'Fw((row+FS2)*11+col+FS2+0,fRatio) ) +', 
				                                      'Fw((row+FS2)*11+col+FS2+0,fRatio) ) +',
				                                      'v1[(col+FS2)/2].y * ( fc.x * ',
				                                    '( Fw((row+FS2)*11+col+FS2-0,fRatio) -', 
				                                      'Fw((row+FS2)*11+col+FS2+1,fRatio) ) + ',
				                                      'Fw((row+FS2)*11+col+FS2+1,fRatio) ) );',
				                'if( row > -FS2 ) {',
				                    's += ( 1.0 - fc.y ) * ( v0[(col+FS2)/2].x * ( fc.x *', 
				                                        '( Fw((row+FS2-1)*11+col+FS2-1,fRatio) -', 
				                                          'Fw((row+FS2-1)*11+col+FS2+0,fRatio) ) +', 
				                                          'Fw((row+FS2-1)*11+col+FS2+0,fRatio) ) +',
				                                          'v0[(col+FS2)/2].y * ( fc.x * ',
				                                        '( Fw((row+FS2-1)*11+col+FS2-0,fRatio) -', 
				                                          'Fw((row+FS2-1)*11+col+FS2+1,fRatio) ) +', 
				                                          'Fw((row+FS2-1)*11+col+FS2+1,fRatio) ) );',
				                    's += (     fc.y ) * ( v1[(col+FS2)/2].w * ( fc.x * ',
				                                        '( Fw((row+FS2-1)*11+col+FS2-1,fRatio) - ',
				                                          'Fw((row+FS2-1)*11+col+FS2+0,fRatio) ) +', 
				                                          'Fw((row+FS2-1)*11+col+FS2+0,fRatio) ) +',
				                                          'v1[(col+FS2)/2].z * ( fc.x *', 
				                                        '( Fw((row+FS2-1)*11+col+FS2-0,fRatio) -', 
				                                          'Fw((row+FS2-1)*11+col+FS2+1,fRatio) ) +', 
				                                          'Fw((row+FS2-1)*11+col+FS2+1,fRatio) ) );',
				                '}',
				            '}',
				            
				            'if( row != FS2 )',
				                'v0[(col+FS2)/2] = v1[(col+FS2)/2].xy;',
				        '}',
				    '}',

				    'return s/w;',
				'}'			
			].join('\n');
		}
		/*---------------End ShadowFragment---------------*/

		/*---------------Begin AmbientLight---------------*/
		{
			U3DEW.AmbientLight = function()
			{
				U3DEW.Light.call( this );
				this.TypeLight = 'AmbientLight';
				this.CodeFragmentShader = 
				[
				'precision mediump float;',
				'varying vec2 fTexCoord;',

				//Color Light
				'uniform vec4 AmbientColor;',

				//Object
				'uniform vec4 Ambient;',
				'uniform vec4 Diffuse;',

				'uniform bool isDiffuseTexture;',
				'uniform bool isEmissiveTexture;',

				'uniform sampler2D DiffuseSampler;',
				'uniform sampler2D EmissiveSampler;',

				'void main() {',
					'vec4 EmissiveTexture = vec4(0.0,0.0,0.0,1.0);',
					'if(isEmissiveTexture) {',
						'EmissiveTexture = texture2D(EmissiveSampler, vec2(fTexCoord.s, fTexCoord.t));',
					'}',
					'if(isDiffuseTexture)',
						'gl_FragColor = AmbientColor*(Ambient+Diffuse)*texture2D(DiffuseSampler, vec2(fTexCoord.s, fTexCoord.t))+EmissiveTexture;',
					'else',
						'gl_FragColor = AmbientColor*(Ambient+Diffuse)+EmissiveTexture;',
				'}'].join( '\n' );

				this.CodeVertexShader = 
				[
				'attribute vec3 Pos;',
				'attribute vec2 TexCoord;',
				'uniform mat4 Projection;',
				'uniform mat4 World;',
				'uniform mat4 View;',
				'varying vec2 fTexCoord;',
				'void main() {',
					'gl_Position = Projection * View * World * vec4(Pos, 1.0);',
					'fTexCoord = TexCoord;',
				'}'
				].join( '\n' );
			}
			U3DEW.AmbientLight.prototype = Object.create( U3DEW.Light.prototype );
		}
		/*---------------End AmbientLight---------------*/

		/*---------------Begin DirectionalLight---------------*/
		{
			U3DEW.DirectionalLight = function()
			{
				U3DEW.Light.call( this );
				this.TypeLight = 'DirectionalLight';
				
				

				this.CodeFragmentShader = 
				[
				'precision mediump float;',
				'varying vec2 fTexCoord;',
				'varying vec3 fTransformedNormal;',
				'varying vec3 fTransformedTangent;',
				'varying vec3 fTransformedBinormal;',
				'varying vec4 fPos;',
				'varying vec4 fLightPos;',

				'uniform vec3 Direction;',
				'uniform vec4 DirectionColor;',
				

				//Object
				'uniform vec4 Ambient;',
				'uniform vec4 Diffuse;',
				'uniform vec4 Specular;',
				'uniform float Shininess;',

				'uniform bool isDiffuseTexture;',
				'uniform bool isSpecularTexture;',
				'uniform bool isBumpTexture;',
				'uniform bool isShadows;',

				'uniform sampler2D DiffuseSampler;',
				'uniform sampler2D BumpSampler;',
				'uniform sampler2D SpecularSampler;',
				'uniform sampler2D ShadowMapSampler;',


				//Light
				'uniform bool isLight;',
				'uniform bool isSpecular;',	

				'uniform vec3 Camera;',
				'uniform vec4 Dimensions;',

				'void main() {',
					'vec3 LightWeighting;',
					'vec3 Normal = fTransformedNormal;',
					'float fShininess = Shininess;',
					'vec4 Shadow = vec4(1.0,1.0,1.0,1.0);',

					'if(isShadows) {',
						'vec3 LSp  = fLightPos.xyz / fLightPos.w;',
						'vec2 ShadowTexC = 0.5 * LSp.xy + vec2( 0.5, 0.5 );',
						'ShadowTexC.y = 1.0 - ShadowTexC.y;',
						'Shadow = texture2D(ShadowMapSampler, ShadowTexC);',
					'}',	

					'if(isBumpTexture) {',
						'vec3 bumpMap = texture2D(BumpSampler, vec2(fTexCoord.s, fTexCoord.t)).xyz * 2.0 - 1.0;',
						'Normal = (bumpMap.x * fTransformedTangent) + (bumpMap.y * fTransformedBinormal) + (bumpMap.z * fTransformedNormal);',
						'Normal = normalize(Normal);',
					'}',
					
					'if(!isLight){ LightWeighting = vec3(1.0,1.0,1.0); }',
					'else {',
						'float directionalLightWeight = max(dot(Normal, Direction), 0.0);',
						'LightWeighting = max(DirectionColor.rgb * directionalLightWeight,0.0);',
					'}',

					'if(isSpecularTexture){ fShininess = texture2D(SpecularSampler, vec2(fTexCoord.s, fTexCoord.t)).r * 255.0; }',

					'float SpecularWeighting = 0.0;',
					'if(!isSpecular && fShininess < 255.0 ){ SpecularWeighting = 0.0; }',
					'else {',
						'vec3 eyeDirection = normalize(Camera-fPos.xyz);',
						'vec3 reflectionDirection = reflect(-normalize(Direction), fTransformedNormal*Normal);',
						'SpecularWeighting = pow(max(dot(reflectionDirection, eyeDirection), 0.0), fShininess);',
					'}',	

					'if(isDiffuseTexture){',
						'vec4 TextureColor = texture2D(DiffuseSampler, vec2(fTexCoord.s, fTexCoord.t));',
						'gl_FragColor = (Ambient + Diffuse) * vec4(TextureColor.rgb * (SpecularWeighting * Specular.rgb + LightWeighting ) * Shadow.rgb, TextureColor.a);}',
					'else',
					'gl_FragColor = (Ambient + Diffuse) * vec4(SpecularWeighting * Specular.rgb + LightWeighting, 1.0) * Shadow;',	
				'}'].join( '\n' );

				this.CodeVertexShader = 
				[
				'attribute vec3 Pos;',
				'attribute vec3 Normal;',
				'attribute vec3 Tangent;',
				'attribute vec3 Binormal;',
				'attribute vec2 TexCoord;',

				'uniform mat4 Projection;',
				'uniform mat4 World;',
				'uniform mat4 View;',
				'uniform mat3 NormalWorld;',

				'uniform mat4 LProjection;',
				'uniform mat4 LWorld;',
				'uniform mat4 LView;',

				'varying vec2 fTexCoord;',
				'varying vec3 fTransformedNormal;',
				'varying vec3 fTransformedTangent;',
				'varying vec3 fTransformedBinormal;',
				'varying vec4 fPos;',
				'varying vec4 fLightPos;',

				'void main() {',
					'fLightPos =   LProjection * LView * LWorld * vec4(Pos, 1.0);',
					'fPos =   World * vec4(Pos, 1.0);',
					'gl_Position = Projection * View * World * vec4(Pos, 1.0);',
					'fTexCoord = TexCoord;',
					'fTransformedNormal = normalize(NormalWorld * Normal);',
					'fTransformedTangent = normalize(NormalWorld * Tangent);',
					'fTransformedBinormal = normalize(NormalWorld * Binormal);',
				'}'
				].join( '\n' );		
			}
			U3DEW.DirectionalLight.prototype = Object.create( U3DEW.Light.prototype );
		}
		/*---------------End DirectionalLight---------------*/

		/*---------------Begin PointLight---------------*/
		{
			U3DEW.PointLight = function()
			{
				U3DEW.Light.call( this );
				this.TypeLight = 'PointLight';
				this.Range = 1.0;
				this.CodeFragmentShader = 
				[
				'precision mediump float;',
				'varying vec2 fTexCoord;',
				'varying vec3 fTransformedNormal;',
				'varying vec3 fTransformedTangent;',
				'varying vec3 fTransformedBinormal;',		
				'varying vec4 fPos;',

				//Object
				'uniform vec4 Ambient;',
				'uniform vec4 Diffuse;',
				'uniform vec4 Specular;',
				'uniform float Shininess;',
				'uniform bool isDiffuseTexture;',
				'uniform bool isBumpTexture;',
				'uniform bool isSpecularTexture;',
				'uniform sampler2D DiffuseSampler;',
				'uniform sampler2D BumpSampler;',
				'uniform sampler2D SpecularSampler;',

				'uniform bool isLight;',
				'uniform bool isSpecular;',	

				'uniform vec3 Point;',
				'uniform vec4 PointColor;',
				'uniform float Range;',

				'uniform vec3 Camera;',

				'void main() {',
					'vec3 LightWeighting;',
					'vec3 Normal = fTransformedNormal;',
					'float fShininess = Shininess;',

					'if(isBumpTexture) {',
						'vec3 bumpMap = texture2D(BumpSampler, vec2(fTexCoord.s, fTexCoord.t)).xyz * 2.0 - 1.0;',
						'Normal = (bumpMap.x * fTransformedTangent) + (bumpMap.y * fTransformedBinormal) + (bumpMap.z * fTransformedNormal);',
						'Normal = normalize(Normal);',
					'}',

					'if(!isLight){ LightWeighting = vec3(1.0,1.0,1.0); }',
					'else {',				
						'vec3 L = Point - fPos.xyz;',
						'float LenSq = dot( L, L );',
						'LightWeighting = PointColor.rgb * (Range * Range) * dot(Normal, L) / LenSq;',
					'}',

					'if(isSpecularTexture){ fShininess = texture2D(SpecularSampler, vec2(fTexCoord.s, fTexCoord.t)).r * 255.0; }',

					'float SpecularWeighting = 0.0;',
					'if(!isSpecular && fShininess < 255.0 ){ SpecularWeighting = 0.0; }',
					'else {',
						'vec3 eyeDirection = normalize(Camera-fPos.xyz);',
						'vec3 reflectionDirection = reflect(-normalize(Point - fPos.xyz), fTransformedNormal*Normal);',
						'SpecularWeighting = pow(max(dot(reflectionDirection, eyeDirection), 0.0), fShininess);',
					'}',

					'if(isDiffuseTexture){',
						'vec4 TextureColor = texture2D(DiffuseSampler, vec2(fTexCoord.s, fTexCoord.t));',
						'gl_FragColor = (Ambient+Diffuse)*vec4(TextureColor.rgb * (SpecularWeighting * Specular.rgb + LightWeighting), TextureColor.a);}',
					'else',
					'gl_FragColor = (Ambient+Diffuse)*vec4(SpecularWeighting * Specular.rgb + LightWeighting, 1.0);',	
				'}'].join( '\n' );

				this.CodeVertexShader = 
				[
				'attribute vec3 Pos;',
				'attribute vec3 Normal;',
				'attribute vec3 Tangent;',
				'attribute vec3 Binormal;',		
				'attribute vec2 TexCoord;',

				'uniform mat4 Projection;',
				'uniform mat4 World;',
				'uniform mat4 View;',
				'uniform mat3 NormalWorld;',

				'varying vec2 fTexCoord;',
				'varying vec3 fTransformedNormal;',
				'varying vec3 fTransformedTangent;',
				'varying vec3 fTransformedBinormal;',		
				'varying vec4 fPos;',

				'void main() {',
					'fPos =   World * vec4(Pos, 1.0);',
					'gl_Position = Projection * View * World * vec4(Pos, 1.0);',
					'fTexCoord = TexCoord;',
					'fTransformedNormal = normalize(NormalWorld * Normal);',
					'fTransformedTangent = normalize(NormalWorld * Tangent);',
					'fTransformedBinormal = normalize(NormalWorld * Binormal);',
				'}'
				].join( '\n' );			
			}
			U3DEW.PointLight.prototype = Object.create( U3DEW.Light.prototype );
		}
		/*---------------End PointLight---------------*/

		/*---------------Begin SpotLight---------------*/
		{
			U3DEW.SpotLight = function()
			{
				U3DEW.Light.call( this );
				this.TypeLight = 'SpotLight';
				this.Direction = new Vector3D(0.0, 0.0, -1.0);
				this.Exp = 10.0;
				this.Range = 30.0;
				this.Distance = 5.0;
				this.CodeFragmentShader = 
				[
				'precision mediump float;',
				'varying vec2 fTexCoord;',
				'varying vec3 fTransformedNormal;',
				'varying vec3 fTransformedTangent;',
				'varying vec3 fTransformedBinormal;',		
				'varying vec4 fPos;',

				//Object
				'uniform vec4 Ambient;',
				'uniform vec4 Diffuse;',
				'uniform vec4 Specular;',
				'uniform float Shininess;',
				'uniform bool isDiffuseTexture;',
				'uniform bool isBumpTexture;',
				'uniform bool isSpecularTexture;',
				'uniform sampler2D DiffuseSampler;',
				'uniform sampler2D BumpSampler;',
				'uniform sampler2D SpecularSampler;',

				'uniform bool isLight;',
				'uniform bool isSpecular;',	

				'uniform vec3 Spot;',
				'uniform vec3 Direction;',
				'uniform vec4 SpotColor;',
				'uniform float Exp;',
				'uniform float Range;',
				'uniform float Distance;',

				'uniform vec3 Camera;',

				'void main() {',
					'vec3 LightWeighting;',
					'vec3 Normal = fTransformedNormal;',
					'float fShininess = Shininess;',

					'if(isBumpTexture) {',
						'vec3 bumpMap = texture2D(BumpSampler, vec2(fTexCoord.s, fTexCoord.t)).xyz * 2.0 - 1.0;',
						'Normal = (bumpMap.x * fTransformedTangent) + (bumpMap.y * fTransformedBinormal) + (bumpMap.z * fTransformedNormal);',
						'Normal = normalize(Normal);',
					'}',

					'if(!isLight){ LightWeighting = vec3(1.0,1.0,1.0); }',
					'else {',
						'vec3 L = Spot - fPos.xyz;',
						'float D = 1.0;',
						'if(Distance > 0.0)',
							'D = 1.0 - min(length(L) / Distance, 1.0);',
						'float SpotEffect = dot(normalize(L), Direction);',
						'if(SpotEffect > Range) {',
							'SpotEffect = max(pow(max(SpotEffect, 0.0), Exp), 0.0);',
							'LightWeighting = SpotColor.rgb * D * SpotEffect * dot( Normal, Direction );',
						'}',
					'}',

					'if(isSpecularTexture){ fShininess = texture2D(SpecularSampler, vec2(fTexCoord.s, fTexCoord.t)).r * 255.0; }',

					'float SpecularWeighting = 0.0;',
					'if(!isSpecular && fShininess < 255.0 ){ SpecularWeighting = 0.0; }',
					'else {',
						'vec3 eyeDirection = normalize(Camera-fPos.xyz);',
						'vec3 reflectionDirection = reflect(-normalize(Spot - fPos.xyz), fTransformedNormal*Normal);',
						'SpecularWeighting = pow(max(dot(reflectionDirection, eyeDirection), 0.0), fShininess);',
					'}',

					'if(isDiffuseTexture){',
						'vec4 TextureColor = texture2D(DiffuseSampler, vec2(fTexCoord.s, fTexCoord.t));',
						'gl_FragColor = (Ambient+Diffuse)*vec4(TextureColor.rgb * (SpecularWeighting * Specular.rgb + LightWeighting), TextureColor.a);}',
					'else',
					'gl_FragColor = (Ambient+Diffuse)*vec4(SpecularWeighting * Specular.rgb + LightWeighting, 1.0);',	
				'}'].join( '\n' );

				this.CodeVertexShader = 
				[
				'attribute vec3 Pos;',
				'attribute vec3 Normal;',
				'attribute vec3 Tangent;',
				'attribute vec3 Binormal;',		
				'attribute vec2 TexCoord;',

				'uniform mat4 Projection;',
				'uniform mat4 World;',
				'uniform mat4 View;',
				'uniform mat3 NormalWorld;',

				'varying vec2 fTexCoord;',
				'varying vec3 fTransformedNormal;',
				'varying vec3 fTransformedTangent;',
				'varying vec3 fTransformedBinormal;',		
				'varying vec4 fPos;',

				'void main() {',
					'fPos =   World * vec4(Pos, 1.0);',
					'gl_Position = Projection * View * World * vec4(Pos, 1.0);',
					'fTexCoord = TexCoord;',
					'fTransformedNormal = normalize(NormalWorld * Normal);',
					'fTransformedTangent = normalize(NormalWorld * Tangent);',
					'fTransformedBinormal = normalize(NormalWorld * Binormal);',			
				'}'
				].join( '\n' );					
			}
			U3DEW.SpotLight.prototype = Object.create( U3DEW.Light.prototype );
		}
		/*---------------End SpotLight---------------*/
	}
	/*---------------End Light---------------*/

	/*---------------Begin FXAA---------------*/
	{
		U3DEW.FXAA = 
		{
			ShaderProgram: null,
			CodeVertexShader: [
				"attribute vec3 Pos;",

				"void main() {",
					"gl_Position = vec4(Pos.xy, 0.0, 1.0);",
				"}"

			].join("\n"),

			CodeFragmentShader: [
				"precision mediump float;",
				"uniform sampler2D RTSampler;",
				"uniform vec2 Resolution;",

				"#define FXAA_REDUCE_MIN   (1.0/128.0)",
				"#define FXAA_REDUCE_MUL   (1.0/8.0)",
				"#define FXAA_SPAN_MAX     8.0",

				"void main() {",

					"vec3 rgbNW = texture2D( RTSampler, ( gl_FragCoord.xy + vec2( -1.0, -1.0 ) ) * Resolution ).xyz;",
					"vec3 rgbNE = texture2D( RTSampler, ( gl_FragCoord.xy + vec2( 1.0, -1.0 ) ) * Resolution ).xyz;",
					"vec3 rgbSW = texture2D( RTSampler, ( gl_FragCoord.xy + vec2( -1.0, 1.0 ) ) * Resolution ).xyz;",
					"vec3 rgbSE = texture2D( RTSampler, ( gl_FragCoord.xy + vec2( 1.0, 1.0 ) ) * Resolution ).xyz;",
					"vec4 rgbaM  = texture2D( RTSampler,  gl_FragCoord.xy  * Resolution );",
					"vec3 rgbM  = rgbaM.xyz;",
					"float opacity  = rgbaM.w;",

					"vec3 luma = vec3( 0.299, 0.587, 0.114 );",

					"float lumaNW = dot( rgbNW, luma );",
					"float lumaNE = dot( rgbNE, luma );",
					"float lumaSW = dot( rgbSW, luma );",
					"float lumaSE = dot( rgbSE, luma );",
					"float lumaM  = dot( rgbM,  luma );",
					"float lumaMin = min( lumaM, min( min( lumaNW, lumaNE ), min( lumaSW, lumaSE ) ) );",
					"float lumaMax = max( lumaM, max( max( lumaNW, lumaNE) , max( lumaSW, lumaSE ) ) );",

					"vec2 dir;",
					"dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));",
					"dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));",

					"float dirReduce = max( ( lumaNW + lumaNE + lumaSW + lumaSE ) * ( 0.25 * FXAA_REDUCE_MUL ), FXAA_REDUCE_MIN );",

					"float rcpDirMin = 1.0 / ( min( abs( dir.x ), abs( dir.y ) ) + dirReduce );",
					"dir = min( vec2( FXAA_SPAN_MAX,  FXAA_SPAN_MAX),",
						  "max( vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),",
								"dir * rcpDirMin)) * Resolution;",

					"vec3 rgbA = 0.5 * (",
						"texture2D( RTSampler, gl_FragCoord.xy  * Resolution + dir * ( 1.0 / 3.0 - 0.5 ) ).xyz +",
						"texture2D( RTSampler, gl_FragCoord.xy  * Resolution + dir * ( 2.0 / 3.0 - 0.5 ) ).xyz );",

					"vec3 rgbB = rgbA * 0.5 + 0.25 * (",
						"texture2D( RTSampler, gl_FragCoord.xy  * Resolution + dir * -0.5 ).xyz +",
						"texture2D( RTSampler, gl_FragCoord.xy  * Resolution + dir * 0.5 ).xyz );",

					"float lumaB = dot( rgbB, luma );",

					"if ( ( lumaB < lumaMin ) || ( lumaB > lumaMax ) ) {",

						"gl_FragColor = vec4( rgbA, opacity );",

					"} else {",

						"gl_FragColor = vec4( rgbB, opacity );",

					"}",

				"}"

			].join("\n")
		}
	}
	/*---------------End FXAA---------------*/

}
/*---------------End 3DEngine---------------*/	