$(document).ready(function(){
	//�õ�Ƭ
	var slideShow = $('#slideShow'),
		ul = slideShow.find('ul'),
        //�õ�Ƭ��ͼƬ����
		li = ul.find('li'),
        //ͼƬ����
		cnt = li.length;

    //����ÿ��ͼƬ������li����z-index���ݼ������þ��Զ�λ����֤Խǰ���z-indexӦ��Խ�ߣ�
	updateZindex();
	if($.support.transform){
	
		//css3��ת
		li.find('img').css('rotate',function(i){
			// ��ʱ����ת
			return (-90*i) + 'deg';
		});
	
        //��һ���Զ����¼������������򡢽Ƕȣ�
		slideShow.bind('rotateContainer',function(e,direction,degrees){
			
            //����õ�Ƭ����
			slideShow.animate({
				width		: 510,
				height		: 510,
				marginTop	: 0,
				marginLeft	: 0
			},'fast',function(){
				//��һ��
				if(direction == 'next'){
				
                    //������һ��ͼƬ����������ͼƬ��ӵ����ͬʱ��������li��z-index
					$('li:first').fadeOut('slow',function(){
						$(this).remove().appendTo(ul).show();
						updateZindex();
					});
				}
                //��һ��
				else {
					
                    //�������һ��ͼƬ���ƶ�����ͼƬ����һ��λ�ã�����li��z-index������ָ�ͼƬ
					var liLast = $('li:last').hide().remove().prependTo(ul);
					updateZindex();
					liLast.fadeIn('slow');
				}
				
				//��ת������ʹ��jquery.rotate.js����������֮��Ĳ��죩
				slideShow.animate({				
					rotate:Math.round($.rotate.radToDeg(slideShow.css('rotate'))+degrees) + 'deg'
				},'slow').animate({
					width		: 490,
					height		: 490,
					marginTop	: 10,
					marginLeft	: 10
				},'fast');
			});
		});
		
        //�󶨶����Զ����¼�����һ�š���һ�ţ�
		slideShow.bind('showNext',function(){
            //�������������򡢽Ƕ�
			slideShow.trigger('rotateContainer',['next',90]);
		});
		
		slideShow.bind('showPrevious',function(){
			slideShow.trigger('rotateContainer',['previous',-90]);
		});
	}
	
	else{
		
		// IE9�������������֧����ת���ԣ�ȥ����תЧ��
		
		slideShow.bind('showNext',function(){
			$('li:first').fadeOut('slow',function(){
				$(this).remove().appendTo(ul).show();
				updateZindex();
			});
		});
		
		slideShow.bind('showPrevious',function(){
			var liLast = $('li:last').hide().remove().prependTo(ul);
			updateZindex();
			liLast.fadeIn('slow');
		});
	}
	
	//�����һ����ͷ
	$('#previousLink').click(function(){
		//�˶�δ������ֱ�ӷ���
        if(slideShow.is(':animated')){
			return false;
		}
        //�����Զ����¼�showPrevious���л�����һ��ͼƬ
		slideShow.trigger('showPrevious');
		return false;
	});
	//�����һ����ͷ
	$('#nextLink').click(function(){
		//�˶�δ������ֱ�ӷ���
		if(slideShow.is(':animated')){
			return false;
		}
        //�����Զ����¼�showNext���л�����һ��ͼƬ
		slideShow.trigger('showNext');
		return false;
	});
	
    //����li��z-index
	function updateZindex(){
		
        //����li����z-index�ݼ�
		ul.find('li').css('z-index',function(i){
			return cnt-i;
		});
	}

});