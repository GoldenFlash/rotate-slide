;
(function($) {

    var Carousel = function(poster) {
        that = this; //保存this全局变量
        this.poster = poster;
        this.posterTtemMain = poster.find('.poster-list');
        this.posterBtn = poster.find('.poster-btn');
        this.posterPreBtn = poster.find('.poster-pre-btn');
        this.posterNextBtn = poster.find('.poster-next-btn');
        this.posterItem = poster.find('li');
        this.posterItemfirst = this.posterItem.eq(0);
        this.posterItemlast = this.posterItem.last();

        // console.log(this.posteritem.length)
        //    默认配置参数
        this.setting = {
            "width": 1000, //幻灯片的宽度
            "height": 270, //幻灯片的高度
            "posterWidth": 640, //幻灯片第一帧的宽度
            "posterHeight": 270, //幻灯片第一帧的宽度
            "scale": 0.9, //图片相当于第一帧的缩放比例
            "speed": 500, //轮播速度
            "verticalAlign": "middle",
            "autoPlay": true,
            "delay": 1000,
        };

        $.extend(this.setting, this.getsetting());

        this.setValue();
        this.setPosterPos();
        var elem = this.posterItem;
        //绑定事件
        this.posterPreBtn.click(function() {

            if (!elem.is(":animated")) {
                that.rotate('left');
            }
        });
        this.posterNextBtn.click(function() {

            if (!elem.is(":animated")) {
                that.rotate('right');
            }
        });
        //   设置自动播放
        if (this.setting.autoPlay) {
            this.autoPlay();
            this.poster.hover(function() {
                clearInterval(that.timer);
            }, function() {
                that.autoPlay();
            });
        }


    };



    Carousel.prototype = {
        //自动播放函数
        autoPlay: function() {
            this.timer = setInterval(function() {
                that.posterNextBtn.click()
            }, that.setting.delay)
        },
        //旋转函数
        rotate: function(direction) {
            var zIndexArr = []; //zIndex数组
            if (direction === 'left') {
                this.posterItem.each(function() {
                    var next = $(this).next().get(0) ? $(this).next() : that.posterItemfirst,
                        width = next.width(),
                        height = next.height(),
                        right = next.css('right'),
                        top = next.css('top'),
                        zIndex = next.css('zIndex'),
                        opacity = next.css('opacity');

                    zIndexArr.push(zIndex);


                    $(this).animate({
                        // zIndex:zIndex,
                        width: width,
                        height: height,
                        top: top,
                        right: right,
                        opacity: opacity,

                    }, that.setting.speed);

                });

                that.posterItem.each(function(j) {
                    $(this).css('zIndex', zIndexArr[j])
                });
            } else if (direction === 'right') {
                that.posterItem.each(function() {
                    var pre = $(this).prev().get(0) ? $(this).prev() : that.posterItemlast,
                        width = pre.width(),
                        height = pre.height(),
                        right = pre.css('right'),
                        top = pre.css('top'),
                        zIndex = pre.css('zIndex'),
                        opacity = pre.css('opacity');

                    zIndexArr.push(zIndex);


                    $(this).animate({
                        // zIndex:zIndex,
                        width: width,
                        height: height,
                        top: top,
                        right: right,
                        opacity: opacity

                    }, that.setting.speed);

                });

                that.posterItem.each(function(j) {
                    $(this).css('zIndex', zIndexArr[j])
                });
            }
        },


        //设置top值函数
        setTopValue: function(height) {
            switch (this.setting.verticalAlign) {
                case "top":
                    return 0;
                    break;
                case "middle":
                    return (this.setting.height - height) / 2;
                    break;
                case "buttom":
                    return this.setting.height;
                    break;
            }

        },

        // setTopValue:function(height){
        //     var top = 0;
        //     var verticalAlign = this.setting.verticalAlign;
        //     if(verticalAlign==="top"){
        //         top = 0;
        //         return top;
        //     }else if(verticalAlign==="middle"){
        //         top = (this.setting.height - height)/2;
        //         return top;
        //     }else if(verticalAlign==="buttom"){
        //         top = this.setting.height;
        //         return top;
        //     }else{
        //         top = 0
        //         return top;
        //     }
        // },

        // 设置剩余帧的参数
        setPosterPos: function() {
            var that = this;

            var sliceItem = this.posterItem.slice(1);
            //    11 
            var leftNumb = Math.floor(sliceItem.length / 2);
            var rightNumb = Math.ceil(sliceItem.length / 2);
            //    11
            var leftSlice = sliceItem.slice(leftNumb); //右边图片数组
            var rightSlice = sliceItem.slice(0, rightNumb); //左边图片数组
            //    console.log(sliceItem.length/2)

            // switch(this.setting.verticalAlign){
            //     case "top":
            //     case "middle":
            //                 var top = (that.setting.posterHeight- rh)/2,
            //     case "bottom":
            //         }

            // 设置右边
            var index = Math.ceil(this.posterItem.length / 2 - 1); //右边图片的zIndex值、图片个数

            var rw = this.setting.posterWidth;
            var rh = this.setting.posterHeight;

            var lw = this.setting.posterWidth;
            var lh = this.setting.posterHeight;

            var gap = ((this.setting.width - this.setting.posterWidth) / 2) / index; //间隙宽度

            rightSlice.each(function(posterItem) {
                rw = rw * that.setting.scale;
                rh = rh * that.setting.scale; // 右边宽高计算公式
                index = index - 1;
                $(this).css({
                    zIndex: index,
                    width: rw,
                    height: rh,
                    top: that.setTopValue(rh),
                    right: gap * index,
                    opacity: 0.2 * (index + 1),

                });
            });



            var multiply = Math.ceil(this.posterItem.length / 2 - 1);

            for (var i = 0; i < multiply + 1; i++) {
                lw = lw * that.setting.scale
                lh = lh * that.setting.scale; //最小图片宽高与scale乘积
            }

            index = index - 1;
            var i = Math.ceil(this.posterItem.length / 2);
            var left = (this.setting.width - this.setting.posterWidth) / 2;
            //设置左边 
            leftSlice.each(function(posterItem) {
                lw = lw / that.setting.scale;
                lh = lh / that.setting.scale; //左边宽高计算公式
                index = index + 1;
                i = i - 1;
                // alert(that.setting.posterWidth);
                $(this).css({
                    zIndex: index,
                    width: lw,
                    height: lh,
                    top: that.setTopValue(lh),
                    right: gap * i + that.setting.posterWidth + left - lw,
                    // left:gap*index,
                    opacity: 0.3 * (index + 1),

                });

            });

        },

        // 设置基础 配置参数值  
        setValue: function() {
            var w = (this.setting.width - this.setting.posterWidth) / 2;
            var h = this.setting.height;
            var index = Math.ceil(this.posterItem.length / 2)
            this.poster.css({
                width: this.setting.width,
                height: this.setting.height,
            });
            this.posterTtemMain.css({
                width: this.setting.posterWidth,
                height: this.setting.posterHeight,
            });
            this.posterBtn.css({
                zIndex: index,
                width: w,
                height: h,


            });
            this.posterItemfirst.css({
                right: w,
                // top:(this.setting.height-this.setting.posterHeight)/2,
                width: this.setting.posterWidth,
                height: this.setting.posterHeight,
                zIndex: index - 1,
            });
        },
        // 获取传递参数
        getsetting: function() {
            var setting = this.poster.attr("data-setting");
            // var setting="";
            if (setting && setting != "") {
                return $.parseJSON(setting);
            } else {
                return {};
            }
        },

    };


    Carousel.init = function(posters) {
        // 保存Carousel对象
        var _this_ = this;
        posters.each(function(i, element) {
            // 创建Carousel实例并传递参数
            // new _this_ ($(element));
            new _this_($(this));
        });
    }
    // 注册方法
    // window.Carousel = Carousel;
    window["Carousel"] = Carousel;
})(jQuery);