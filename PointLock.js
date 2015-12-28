var mouseX = 0, mouseY = 0;

function PointLock(_id)
{
    var event = false;
    var havePointerLock = 'pointerLockElement' in document ||
                        'mozPointerLockElement' in document ||
                        'webkitPointerLockElement' in document;

    document.exitPointerLock =  document.exitPointerLock ||
                                  document.mozExitPointerLock ||
                                  document.webkitExitPointerLock;


    var request = document.getElementById(_id);
    request.requestPointerLock = request.requestPointerLock ||
                                    request.mozRequestPointerLock ||
                                    request.webkitRequestPointerLock;
    var isLocked = function()
    {
        return request === document.pointerLockElement ||
              request === document.mozPointerLockElement ||
              request === document.webkitPointerLockElement;
    }
    var PointLock = function()
    {
        if(!isLocked())
        {
            request.requestPointerLock();
        } 
        else 
        {
            document.exitPointerLock();
        }
    }

    var onMouseMove = function (_e) 
    {
      var X = _e.movementX ||
              _e.mozMovementX ||
              _e.webkitMovementX ||
              0;
      var Y = _e.movementY ||
              _e.mozMovementY ||
              _e.webkitMovementY ||
              0;

      mouseX = X;
      mouseY = Y;        

    if(event)
      {
        mouseX = Math.abs(X)>0?0:X;
        mouseY = Math.abs(Y)>0?0:Y; 
        event = false;
      }

    }

    request.addEventListener('click', 
    function()
    {
        if(!isLocked()){
        request.requestPointerLock();   
        } else {
        document.exitPointerLock();
        }
    }, false);

    var changeCallback = function() 
    {
        if(!havePointerLock){
          alert('Ваш браузер не поддерживает pointer-lock');
          return;
        }
        if (isLocked()) {
            document.addEventListener("mousemove", onMouseMove, false);
          document.body.classList.add('locked');
          event = true;

        } else {
            document.removeEventListener("mousemove", onMouseMove, false);
          document.body.classList.remove('locked');

        }
    }

    document.addEventListener('pointerlockchange', changeCallback, false);
    document.addEventListener('mozpointerlockchange', changeCallback, false);
    document.addEventListener('webkitpointerlockchange', changeCallback, false);
}