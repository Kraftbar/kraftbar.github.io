<div><textarea id=source cols=60 rows=15>Enter text to see result.</textarea></div>
<div id=heatmap-container><svg width=500 height=200></svg></div>
<script>



class canvasplot{
    
    // ------------------------------------------------------------------------- 
    // --------------------------------- costr ---------------------------------
    // ------------------------------------------------------------------------- 
    constructor(XTickDelta= 20,YTickDelta=50,CanvasName='xy-graph') {
        this.Canvas = document.getElementById(CanvasName);
        this.Width  = this.Canvas.width ;
        this.Height = this.Canvas.height ;
        this.XTickDelta= XTickDelta;
        this.YTickDelta= YTickDelta;
        this.MaxX= 200;
        this.MinX= 0;
        this.MaxY= 450;
        this.MinY= 0;
        this.XSTEP = (this.MaxX-this.MinX)/this.Width ;
    }


    XC(x) {return               (x - this.MinX) / (this.MaxX - this.MinX) * this.Width ;}
    YC(y) {return this.Height - (y - this.MinY) / (this.MaxY - this.MinY) * this.Height ;}




    // ------------------------------------------------------------------------- 
    // --------------------------------- init ----------------------------------
    // ------------------------------------------------------------------------- 
    Draw(arr) {
        var F = function(x) {
          return Math.sin(x)*Math.cos(2*x)*1 +9;
        };
        var Ctx = null ;
        Ctx = this.Canvas.getContext('2d');
        Ctx.clearRect(0,0,this.Width,this.Height);

        this.RenderFunction(F,Ctx);

        // this.DrawAxes(Ctx);
    }




    // ------------------------------------------------------------------------- 
    // --------------------------------- axis ----------------------------------
    // ------------------------------------------------------------------------- 
    DrawAxes(Ctx) {
        Ctx.save() ;
        Ctx.lineWidth = 1 ;
        Ctx.font = "bold 11px verdana, sans-serif";
        

        // --------------------------------- Y axis --------------------------------- 
        // Y axis tick marks
        var delta = this.YTickDelta;
        for (var y_t = this.MinY+delta ; y_t  < this.MaxY ; y_t=y_t+delta) {
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

        // X tick marks
        var delta = this.XTickDelta ;
        for (var x_t = this.MinX+delta ; x_t  < this.MaxX ; x_t=x_t+delta) {
            Ctx.beginPath() ;
            Ctx.lineWidth = 0.5; 
            Ctx.strokeStyle = 'gray';
            Ctx.moveTo(this.XC(x_t),this.YC( this.MinY)) ;
            Ctx.lineTo(this.XC(x_t),this.YC(this.MaxY)) ;
            Ctx.fillText(x_t,  this.XC(x_t +0.1), this.YC(this.MaxY)+10);
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
                Ctx.moveTo(this.XC(x),this.YC(y)) ;
        }
        Ctx.stroke() ;
    }
    
    


}

</script>