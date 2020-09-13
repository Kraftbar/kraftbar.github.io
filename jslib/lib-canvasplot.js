
class canvasplot{
    
    // ------------------------------------------------------------------------- 
    // --------------------------------- costr ---------------------------------
    // ------------------------------------------------------------------------- 
    constructor(Canvas_name) {
        this.Canvas = document.getElementById('xy-graph');  
        this.Width  = this.Canvas.width ;
        this.Height = this.Canvas.height ;
        this.MaxX= 200;
        this.MinX= 0;
        this.MaxY= 450;
        this.MinY= 0;
        this.XTickDelta= 20;
        this.YTickDelta= 50;
        this.XSTEP = (this.MaxX-this.MinX)/this.Width ;
    }


    XC(x) {return               (x - this.MinX) / (this.MaxX - this.MinX) * this.Width ;}
    YC(y) {return this.Height - (y - this.MinY) / (this.MaxY - this.MinY) * this.Height ;}




    // ------------------------------------------------------------------------- 
    // --------------------------------- init ----------------------------------
    // ------------------------------------------------------------------------- 
    Draw(arr) {
        var F = function(x) {
          return Math.sin(x)*Math.cos(2*x)*1 +9 ;
        };
        var Ctx = null ;
        Ctx = this.Canvas.getContext('2d');
        Ctx.clearRect(0,0,this.Width,this.Height) ;

//        this.RenderFunction(F,Ctx);
        this.RenderArr(arr,Ctx);
        this.DrawAxes(Ctx) ;
    }




    // ------------------------------------------------------------------------- 
    // --------------------------------- axis ----------------------------------
    // ------------------------------------------------------------------------- 
    DrawAxes(Ctx) {
        Ctx.save() ;
        Ctx.lineWidth = 1 ;
        Ctx.font = "bold 11px verdana, sans-serif";
        

        // --------------------------------- Y axis --------------------------------- 
        Ctx.beginPath() ;
        Ctx.moveTo(this.XC(this.MinX),this.YC(this.MinY)) ;
        Ctx.lineTo(this.XC(this.MinX),this.YC(this.MaxY)) ;
        Ctx.moveTo(this.XC(this.MaxX),this.YC(this.MinY)) ;
        Ctx.lineTo(this.XC(this.MaxX),this.YC(this.MaxY)) ;
        Ctx.stroke() ;
        // Y axis tick marks
        var delta = this.YTickDelta;
        for (var y_t = this.MinY+delta ; y_t  < this.MaxY ; y_t=y_t+delta) {
            Ctx.beginPath() ;
            Ctx.moveTo(this.XC(this.MinX) - 5,this.YC(y_t )) ;
            Ctx.lineTo(this.XC(this.MinX) + 5,this.YC(y_t )) ;
            Ctx.moveTo(this.XC(this.MaxX) - 5,this.YC(y_t )) ;
            Ctx.lineTo(this.XC(this.MaxX) + 5,this.YC(y_t )) ;
            Ctx.moveTo(this.XC(this.MaxX) - 5,this.YC(y_t )) ;
            Ctx.lineTo(this.XC(this.MaxX) + 5,this.YC(y_t )) ;
            Ctx.stroke() ;  
            
            Ctx.beginPath() ;
            Ctx.lineWidth = 0.5; 
            Ctx.strokeStyle = 'gray';
            Ctx.fillText(y_t, this.XC(this.MinX) , this.YC(y_t +0.1));
            Ctx.moveTo(this.XC(this.MinX),this.YC( y_t)) ;
            Ctx.lineTo(this.XC(this.MaxX),this.YC(y_t)) ;
            Ctx.stroke() ;  
            Ctx.lineWidth = 1; 
            Ctx.strokeStyle = 'black';
        }


        // --------------------------------- X axis --------------------------------- 
        Ctx.beginPath() ;
        Ctx.moveTo(this.XC(this.MinX),this.YC(this.MinY)) ;
        Ctx.lineTo(this.XC(this.MaxX),this.YC(this.MinY)) ;
        Ctx.moveTo(this.XC(this.MinX),this.YC(this.MaxY)) ;
        Ctx.lineTo(this.XC(this.MaxX),this.YC(this.MaxY)) ;
        Ctx.stroke() ;
        // X tick marks
        var delta = this.XTickDelta ;
        for (var x_t = this.MinX+delta ; x_t  < this.MaxX ; x_t=x_t+delta) {
            Ctx.beginPath() ;
            Ctx.moveTo(this.XC(x_t ),this.YC(this.MinY)-5) ;
            Ctx.lineTo(this.XC(x_t ),this.YC(this.MinY)+5) ;
            Ctx.moveTo(this.XC(x_t ),this.YC(this.MaxY)-5) ;
            Ctx.lineTo(this.XC(x_t ),this.YC(this.MaxY)+5) ;
            Ctx.stroke() ;  

            Ctx.beginPath() ;
            Ctx.lineWidth = 0.5; 
            Ctx.strokeStyle = 'gray';
            Ctx.moveTo(this.XC(x_t),this.YC( this.MinY)) ;
            Ctx.lineTo(this.XC(x_t),this.YC(this.MaxY)) ;
            Ctx.fillText(x_t,  this.XC(x_t +0.1), this.YC(this.MaxY-13));
            Ctx.stroke() ;  
            Ctx.lineWidth = 1; 
            Ctx.strokeStyle = 'black';
        }
        

        Ctx.restore() ;
    }



    // ------------------------------------------------------------------------- 
    // --------------------------------- func ----------------------------------
    // ------------------------------------------------------------------------- 
    RenderFunction(f,Ctx) {
        var first = true;
        Ctx.beginPath() ;
        for (var x = this.MinX; x <= this.MaxX; x += this.XSTEP) {
            var y = f(x) ;
            if (first) {
                Ctx.moveTo(this.XC(x),this.YC(y)) ;
                first = false ;
            } else {
                Ctx.lineTo(this.XC(x),this.YC(y)) ;
            }
        }
        Ctx.stroke() ;
    }
    
    
    
    // set XmaX and YmaX
    RenderArr(arr_y,Ctx) {
        this.MinX=-10;
        this.MaxX=arr_y.length+10;
        this.YmaX=Math.max(arr_y)*1.2;
        var first = true;
        Ctx.beginPath();
        var MinX=0;
        var MaxX=arr_y.length-1; 
        var XSTEP=1;
        for (var x = MinX; x <= MaxX; x += XSTEP) {
            var y = arr_y[x] ;
            console.log(x +"  " +y);
            if (first) {
                Ctx.moveTo(this.XC(x),this.YC(y)) ;
                first = false ;
            } else {
                Ctx.lineTo(this.XC(x),this.YC(y)) ;
            }
        }
        Ctx.stroke() ;
    }


}
