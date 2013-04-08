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

					// ����һ��Canvas
					originalCanvas = $('<canvas>');
					var originalContext = originalCanvas[0].getContext('2d');

					// ����canvasԪ�صĿ�ȡ��߶ȡ���߾�
					originalCanvas.attr({
						width: newWidth,
						height: newHeight
					}).css({
						marginTop: -newHeight/2,
						marginLeft: -newWidth/2
					});

					// ��ͼƬ���Ƶ�canvasԪ����
					originalContext.drawImage(this, 0, 0, newWidth, newHeight);

					// �Ƴ�ͼƬԪ�أ��Ѿ�����Ҫ�ˣ�������ʹ��canvas����ͺã�
					img.remove();

					filterContainer.fadeIn();

					// ����Ĭ�ϡ���ͨ���˾�
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

	// ����б�Ԫ�أ��л��˾�Ч��
	filters.click(function(e){

		e.preventDefault();

		var f = $(this);
        //���������˾�û�仯������Ҫ����
		if(f.is('.active')){
			return false;
		}
		filters.removeClass('active');
		f.addClass('active');

		// ��¡canvasԪ��
		var clone = originalCanvas.clone();

		// ��¡��canvas�е�ͼƬ
		clone[0].getContext('2d').drawImage(originalCanvas[0],0,0);

		// �Ƴ�ԴcanvasԪ�أ�������¡��canvasԪ�ز��뵽ͼƬ������
		photo.find('canvas').remove().end().append(clone);

        //��ȡaԪ���ϵ�id���˾�����)
		var effect = $.trim(f[0].id);
        //����CamanJs��API
		Caman(clone[0], function () {

			// ������ڸ��˾�Ч����Ӧ���˾��㷨���ı�ͼƬ���

			if( effect in this){
                //�����˾�
				this[effect]();
                //Ӧ�õ�ͼƬ��
				this.render();

				// ��ʾ���ذ�ť
				showDownload(clone[0]);
			}
			else{
                //�������ذ�ť
				hideDownload();
			}
		});

	});


    //ʹ��mousewheel����������˾��б�Ĺ�����
	filterContainer.find('ul').on('mousewheel',function(e, delta){
		this.scrollLeft -= (delta * 50);
		e.preventDefault();
	});

    //���ذ�ť
	var downloadImage = $('a.downloadImage');

	function showDownload(canvas){
		downloadImage.off('click').click(function(){
			//��ȡcanvas��ͼƬ���ݣ�����ӵ�aԪ�ذ�ť��href�����ϣ������û������ͻ���ñ��ع�������
			var url = canvas.toDataURL("image/png;base64;");
			downloadImage.attr('href', url);
			
		}).fadeIn();

	}
	function hideDownload(){
		downloadImage.fadeOut();
	}

});
