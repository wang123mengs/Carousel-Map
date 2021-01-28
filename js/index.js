
class CarouselMap {

    constructor(target){
        
        if(!this.isObject(target)){
            target = {
                className: target
            }
        }
        
        this.box = document.querySelector('.' + target.className);
        this.ulDome = this.box.querySelector('.images');
        this.lis = this.ulDome.querySelectorAll('li');

        this.btnUl = this.box.querySelector('.icon_line');
        this.btnLis = this.btnUl.querySelectorAll('li');
        
        this.btnLeft = this.box.querySelector('.leftBtn');
        this.btnRight = this.box.querySelector('.rightBtn');

        this.type = true;

        this.speedTime = target.speedTime || 1;
        this.interval = null;
        this.mainInterval = null;
        this.intervalR = null;
        this.minSpeed = target.minSpeed || 5;
        this.liwidth = this.lis[0].offsetWidth;
        this.moveTime = target.moveTime || 2300;

        this.init();
    }

    // 判断是否为对象
    isObject(target){
        return Object.prototype.toString.call(target) === '[object Object]';
    }

    // 初始化
    init(){
        this.ulDome.style.width = this.lis.length * this.liwidth + "px";

        this.btnUl.style.marginLeft = '-' + this.btnUl.offsetWidth/2 + "px";

        for(let i=0,l=this.lis.length;i<l;i++){
            this.lis[i].setAttribute('index',i);
            this.btnLis[i].setAttribute('index',i);
        }
        
        this.box.addEventListener('mouseenter',this.mouserenter(this));
        this.box.addEventListener('mouseleave',this.mouseleave(this));

        let _this = this;
        this.btnRight.addEventListener('click',() => {
            if(!_this.type) return;

            _this.type = false;
            
            _this.liwidth = 0;

            clearInterval(_this.interval);

            _this.interval = setInterval(_this.nextImg(_this), _this.speedTime);

        });

        this.btnLeft.addEventListener('click',() => {
            
            if(!_this.type) return;

            _this.type = false;
            
            _this.liwidth = _this.lis[0].offsetWidth;

            clearInterval(_this.intervalR);

            _this.intervalR = setInterval(_this.prevImg(_this), _this.speedTime);

        });
        this.startImg();
    }

    // 开启轮播图
    startImg(){

        let mainTimer = this.moveTime + parseInt(this.liwidth/(this.speedTime * this.minSpeed));

        let _this = this;

        this.mainInterval = setInterval(() => {

            this.liwidth = 0;

            clearInterval(this.interval);

            this.interval = setInterval(_this.nextImg(_this), _this.speedTime);

        }, mainTimer);
    }

    // 鼠标进入box事件
    mouserenter(_this){
        return () => {
            if(_this.mainInterval){
                clearInterval(_this.mainInterval);
            }
        }
    }

    // 鼠标离开box事件
    mouseleave(_this){
        return () => {
            _this.startImg();
        }
    }

    // 向左
    nextImg(_this){
        
        return () => {
            _this.ulDome.style.left = '-' + _this.liwidth + 'px';

            _this.liwidth += _this.minSpeed;

            if(_this.liwidth >= _this.lis[0].offsetWidth){

                clearInterval(_this.interval);

                _this.ulDome.appendChild(_this.lis[0]); //先删除imgli[0],然后加到末尾来，这样实现了循环

                _this.uniteBtnIcon();
                
                _this.type = true;

                _this.ulDome.style.left = 0;
            }
        }
    }

    // 向右
    prevImg(_this){
        return () => {
            
            _this.ulDome.style.left = '-' + _this.liwidth + 'px';

            _this.ulDome.insertBefore(_this.lis[_this.lis.length - 1], _this.lis[0]); //因为当前图片的位置一直都是imgli[0]，所以按照循环的思想，上一张就是imli[length-1]

            _this.liwidth -= _this.minSpeed;

            if(_this.liwidth <= -1){

                clearInterval(_this.intervalR);

                _this.uniteBtnIcon();

                _this.ulDome.style.left = 0;

                _this.type = true;
            }

        }
    }

    // 统一btn图标样式
    uniteBtnIcon(){
        
        this.lis = this.ulDome.querySelectorAll('li');

        let index = this.lis[0].getAttribute('index');

        for(let i=0;i<this.btnLis.length;i++){
            if(i == index){
                this.btnLis[i].setAttribute('class','active');
            }else{
                this.btnLis[i].setAttribute('class','');
            }
        }
    }

}