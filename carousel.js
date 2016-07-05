;
(function ($) {
    var Carousel = function (poster) {
        var self = this;
        //保存单个旋转木马对象
        this.poster = poster;
        this.posterItemMain = poster.find("ul.poster-list");
        this.nextBtn = poster.find("div.poster-next-btn");
        this.prevBtn = poster.find("div.poster-prev-btn");
        this.posterItems = poster.find("li.poster-item");
        if(this.posterItems.size()%2==0){
            this.posterItemMain.append(this.posterItems.eq(0).clone());
            this.posterItems = this.posterItemMain.children();
        }
        this.posterFirstItem = this.posterItems.first();
        this.posterLastItem = this.posterItems.last();
        this.rotateFlag = true;

        //默认配置参数
        this.setting = {
            "width": 1345000,           //幻灯片的宽度
            "height": 273450,           //幻灯片的高度
            "posterWidth": 634540,      //幻灯片第一帧的宽度
            "posterHeight": 234570,     //幻灯片第一帧的高度
            "scale": 0.9,               //记录显示比例关系
            "speed": 500,
            "autoPlay": false,
            "delay": 5000,
            "verticalAlign": "middle"
        };
        $.extend(this.setting, this.getSetting());
        this.setSettingValue();
        this.setPosterPos();
        this.nextBtn.click(function () {
            if (self.rotateFlag) {
                self.rotateFlag = false;
                self.carouselRotate("left");
            }
        });
        this.prevBtn.click(function () {
            if (self.rotateFlag) {
                self.rotateFlag = false;
                self.carouselRotate("right");
            }
        });
        //是否开启自动播放
        if (this.setting.autoPlay) {
            this.autoPlay();
            this.poster.hover(function(){
                window.clearInterval(self.timer);
            }, function(){
                self.autoPlay();
            });
        }
    };

    Carousel.prototype = {
        autoPlay: function () {
            var self = this;
            this.timer = window.setInterval(function () {
                self.nextBtn.click();
            }, this.setting.delay);
        },
        //旋转
        carouselRotate: function (dir) {
            var _this_ = this;
            var zIndexArr = [];
            if (dir === "left") {
                this.posterItems.each(function () {
                    var self = $(this),
                        prev = self.prev().get(0) ? self.prev() : _this_.posterLastItem,
                        width = prev.width(),
                        height = prev.height(),
                        zIndex = prev.css("zIndex"),
                        opacity = prev.css("opacity"),
                        left = prev.css("left"),
                        top = prev.css("top");
                    zIndexArr.push(zIndex);
                    self.animate({
                        width: width,
                        height: height,
//                        zIndex: zIndex,
                        opacity: opacity,
                        left: left,
                        top: top
                    }, _this_.setting.speed, function () {
                        _this_.rotateFlag = true;
                    });

                });
                this.posterItems.each(function (i) {
                    $(this).css("zIndex", zIndexArr[i]);
                });
            } else if (dir === "right") {
                this.posterItems.each(function () {
                    var self = $(this),
                        next = self.next().get(0) ? self.next() : _this_.posterFirstItem,
                        width = next.width(),
                        height = next.height(),
                        zIndex = next.css("zIndex"),
                        opacity = next.css("opacity"),
                        left = next.css("left"),
                        top = next.css("top");
                    zIndexArr.push(zIndex);
                    self.animate({
                        width: width,
                        height: height,
//                        zIndex: zIndex,
                        opacity: opacity,
                        left: left,
                        top: top
                    }, _this_.setting.speed, function () {
                        _this_.rotateFlag = true;
                    });
                });
                this.posterItems.each(function (i) {
                    $(this).css("zIndex", zIndexArr[i]);
                });
            }

        },
        //设置剩余的帧的位置关系
        setPosterPos: function () {
            var self = this;
            var sliceItems = this.posterItems.slice(1),
                sliceSize = sliceItems.size() / 2,
                rightSlice = sliceItems.slice(0, sliceSize),
                level = Math.floor(this.posterItems.size() / 2),
                leftSlice = sliceItems.slice(sliceSize);

            var rw = this.setting.posterWidth,
                rh = this.setting.posterHeight,
                gap = ((this.setting.width - this.setting.posterWidth) / 2) / level;
            //设置右边帧的位置关系和宽度高度top
            var firstLeft = (this.setting.width - this.setting.posterWidth) / 2;

            var fixOffsetLeft = firstLeft + rw;
            rightSlice.each(function (i) {
                level--;
                rw = rw * self.setting.scale;
                rh = rh * self.setting.scale;
                var j = i;
                $(this).css({
                    zIndex: level,
                    width: rw,
                    height: rh,
                    opacity: 1 / (++j),
                    left: fixOffsetLeft + (++i) * gap - rw,
                    top: self.setVerticalAlign(rh)
                });
            });
            //设置左边的位置关系
            var lw = rightSlice.last().width(),
                lh = rightSlice.last().height(),
                oloop = Math.floor(this.posterItems.size() / 2);
            leftSlice.each(function (i) {
                $(this).css({
                    zIndex: i,
                    width: lw,
                    height: lh,
                    opacity: 1 / oloop,
                    left: i * gap,
                    top: self.setVerticalAlign(lh)
                });
                lw = lw / self.setting.scale;
                lh = lh / self.setting.scale;
                oloop--;
            });

        },
        //设置垂直排列对齐
        setVerticalAlign: function (height) {
            var verticalType = this.setting.verticalAlign,
                top = 0;
            if (verticalType === "middle") {
                top = (this.setting.height - height) / 2;
            } else if (verticalType === "top") {
                top = 0;
            } else if (verticalType === "bottom") {
                top = (this.setting.height - height);
            } else {
                top = (this.setting.height - height) / 2;
            }
            return top;
        },
        //设置配置参数数值去控制基本的宽度高度
        setSettingValue: function () {
            this.poster.css({
                width: this.setting.width,
                height: this.setting.height
            });
            this.posterItemMain.css({
                width: this.setting.width,
                height: this.setting.height
            });
            //计算上下切换按钮的宽度
            var w = (this.setting.width - this.setting.posterWidth) / 2;
            this.nextBtn.css({
                width: w,
                height: this.setting.height,
                zIndex: Math.ceil(this.posterItems.size() / 2)
            });
            this.prevBtn.css({
                width: w,
                height: this.setting.height,
                zIndex: Math.ceil(this.posterItems.size() / 2)
            });
            this.posterFirstItem.css({
                width: this.setting.posterWidth,
                height: this.setting.posterHeight,
                left: w,
                zIndex: Math.floor(this.posterItems.size() / 2)
            });
        },
        //获取人工配置参数
        getSetting: function () {
            var setting = this.poster.attr("data-setting");
            if (setting && setting != "") {
                return $.parseJSON(setting);
            } else {
                return {};
            }
        }
    };

    Carousel.init = function (posters) {
        var _this_ = this;
        posters.each(function () {
            new _this_($(this));
        });
    };

    window["Carousel"] = Carousel;

})(jQuery);