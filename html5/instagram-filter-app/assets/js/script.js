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

					// Create the original canvas.

					originalCanvas = $('<canvas>');
					var originalContext = originalCanvas[0].getContext('2d');

					// Set the attributes for centering the canvas

					originalCanvas.attr({
						width: newWidth,
						height: newHeight
					}).css({
						marginTop: -newHeight/2,
						marginLeft: -newWidth/2
					});

					// Draw the dropped image to the canvas
					// with the new dimensions
					originalContext.drawImage(this, 0, 0, newWidth, newHeight);

					// We don't need this any more
					img.remove();

					filterContainer.fadeIn();

					// Trigger the default "normal" filter
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

	// Listen for clicks on the filters

	filters.click(function(e){

		e.preventDefault();

		var f = $(this);

		if(f.is('.active')){
			// Apply filters only once
			return false;
		}

		filters.removeClass('active');
		f.addClass('active');

		// Clone the canvas
		var clone = originalCanvas.clone();

		// Clone the image stored in the canvas as well
		clone[0].getContext('2d').drawImage(originalCanvas[0],0,0);


		// Add the clone to the page and trigger
		// the Caman library on it

		photo.find('canvas').remove().end().append(clone);

		var effect = $.trim(f[0].id);

		Caman(clone[0], function () {

			// If such an effect exists, use it:

			if( effect in this){
				this[effect]();
				this.render();

				// Show the download button
				showDownload(clone[0]);
			}
			else{
				hideDownload();
			}
		});

	});

	// Use the mousewheel plugin to scroll
	// scroll the div more intuitively

	filterContainer.find('ul').on('mousewheel',function(e, delta){

		this.scrollLeft -= (delta * 50);
		e.preventDefault();

	});

	var downloadImage = $('a.downloadImage');

	function showDownload(canvas){


		downloadImage.off('click').click(function(){
			
			// When the download link is clicked, get the
			// DataURL of the image and set it as href:
			
			var url = canvas.toDataURL("image/png;base64;");
			downloadImage.attr('href', url);
			
		}).fadeIn();

	}

	function hideDownload(){
		downloadImage.fadeOut();
	}

});
