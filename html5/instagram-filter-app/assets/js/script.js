$(function() {

	/*
		�����js�ļ��У����ǽ�ʵ�����¼������ܣ�

		1. ������ק��ʾͼƬ������ȡͼƬ����
		2. ����������һ�����ߴ�Ϊ500*500px��canvasԪ��
		3. ���������˾��ĵ���¼������˾���ѡ��ʱ������������¶�����
				3.1 ��¡һ��canvas
				3.2 ɾ������canvasԪ��
				3.3 ����¡��canvas��ӵ�#photo����
				3.4 ���ѡ����˾����ǡ�Normal��������Caman�⣬������˾�Ч��
				3.5 ��Ԫ�����Ӹ�active��ʽ��
		4. ���Դ���Normal�˾����ָ�ԭͼЧ��

	*/

	var	maxWidth = 500,
		maxHeight = 500,
		originalCanvas = null,
		filters = $('#filters li a'),
		filterContainer = $('#filterContainer');

	// ʹ��fileReader���ʵ����ק
	// #photo��Ϊ��ק���������
    var photo = $('#photo');
    photo.fileReaderJS({
		on:{
			load: function(e, file){
                //����ק�������һ��ͼƬԪ��
				var img = $('<img>').appendTo(photo),
					imgWidth, newWidth,
					imgHeight, newHeight,
					ratio;

				// ɾ�������ڵ�canvasԪ��
				photo.find('canvas').remove();
				filters.removeClass('active');

                //ͼƬ��ȡ�ɹ��󴥷������������ҵ�ͼƬԭʼ��Ⱥ͸߶�
				img.load(function() {

					imgWidth  = this.width;
					imgHeight = this.height;

					// ������500*500px
					if (imgWidth >= maxWidth || imgHeight >= maxHeight) {
						if (imgWidth > imgHeight) {
                            //ratio��ϣ������ͼƬʱ�����ɿ��Ա�֤��������ȷ
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

				// ����ͼƬ��src��ֱ�Ӷ�ȡ������ͼƬ����
				// ����img��load�¼�

				img.attr('src', e.target.result);
			},

			beforestart: function(file){
                //ֻ����ͼƬ
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
