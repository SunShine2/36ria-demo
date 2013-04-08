$(function() {

	/*
		在这个js文件中，我们将实现如下几个功能：

		1. 可以拖拽显示图片，并读取图片数据
		2. 创建并保存一个最大尺寸为500*500px的canvas元素
		3. 监听各个滤镜的点击事件，当滤镜被选择时，我们完成如下动作：
				3.1 克隆一个canvas
				3.2 删除其他canvas元素
				3.3 将克隆的canvas添加到#photo层中
				3.4 如果选择的滤镜不是“Normal”，调用Caman库，处理出滤镜效果
				3.5 给元素增加个active样式名
		4. 可以触发Normal滤镜，恢复原图效果

	*/

	var	maxWidth = 500,
		maxHeight = 500,
		originalCanvas = null,
		filters = $('#filters li a'),
		filterContainer = $('#filterContainer');

	// 使用fileReader插件实现拖拽
	// #photo层为拖拽区域层容器
    var photo = $('#photo');
    photo.fileReaderJS({
		on:{
			load: function(e, file){
                //向拖拽容器添加一个图片元素
				var img = $('<img>').appendTo(photo),
					imgWidth, newWidth,
					imgHeight, newHeight,
					ratio;

				// 删除容器内的canvas元素
				photo.find('canvas').remove();
				filters.removeClass('active');

                //图片读取成功后触发，这样才能找到图片原始宽度和高度
				img.load(function() {

					imgWidth  = this.width;
					imgHeight = this.height;

					// 控制在500*500px
					if (imgWidth >= maxWidth || imgHeight >= maxHeight) {
						if (imgWidth > imgHeight) {
                            //ratio是希望处理图片时，依旧可以保证比例的正确
							ratio = imgWidth / maxWidth;
							newWidth = maxWidth;
							newHeight = imgHeight / ratio;

						} else {
							ratio = imgHeight / maxHeight;
							newHeight = maxHeight;
							newWidth = imgWidth / ratio;
						}

					} else {
						newHeight = imgHeight;
						newWidth = imgWidth;
					}

					// 创建一个Canvas
					originalCanvas = $('<canvas>');
					var originalContext = originalCanvas[0].getContext('2d');

					// 设置canvas元素的宽度、高度、外边距
					originalCanvas.attr({
						width: newWidth,
						height: newHeight
					}).css({
						marginTop: -newHeight/2,
						marginLeft: -newWidth/2
					});

					// 将图片绘制到canvas元素中
					originalContext.drawImage(this, 0, 0, newWidth, newHeight);

					// 移除图片元素（已经不需要了，接下来使用canvas处理就好）
					img.remove();

					filterContainer.fadeIn();

					// 触发默认“普通”滤镜
					filters.first().click();
				});

				// 设置图片的src，直接读取二进制图片数据
				// 触发img的load事件

				img.attr('src', e.target.result);
			},

			beforestart: function(file){
                //只接受图片
				return /^image/.test(file.type);
			}
		}
	});

	// 点击列表元素，切换滤镜效果
	filters.click(function(e){

		e.preventDefault();

		var f = $(this);
        //如果点击的滤镜没变化，不需要处理
		if(f.is('.active')){
			return false;
		}
		filters.removeClass('active');
		f.addClass('active');

		// 克隆canvas元素
		var clone = originalCanvas.clone();

		// 克隆在canvas中的图片
		clone[0].getContext('2d').drawImage(originalCanvas[0],0,0);

		// 移除源canvas元素，并将克隆的canvas元素插入到图片容器内
		photo.find('canvas').remove().end().append(clone);

        //获取a元素上的id（滤镜名称)
		var effect = $.trim(f[0].id);
        //调用CamanJs的API
		Caman(clone[0], function () {

			// 如果存在该滤镜效果，应用滤镜算法，改变图片风格

			if( effect in this){
                //设置滤镜
				this[effect]();
                //应用到图片上
				this.render();

				// 显示下载按钮
				showDownload(clone[0]);
			}
			else{
                //隐藏下载按钮
				hideDownload();
			}
		});

	});


    //使用mousewheel插件处理下滤镜列表的滚动。
	filterContainer.find('ul').on('mousewheel',function(e, delta){
		this.scrollLeft -= (delta * 50);
		e.preventDefault();
	});

    //下载按钮
	var downloadImage = $('a.downloadImage');

	function showDownload(canvas){
		downloadImage.off('click').click(function(){
			//获取canvas的图片数据，并添加到a元素按钮的href属性上，这样用户点击后就会调用本地工具下载
			var url = canvas.toDataURL("image/png;base64;");
			downloadImage.attr('href', url);
			
		}).fadeIn();

	}
	function hideDownload(){
		downloadImage.fadeOut();
	}

});
