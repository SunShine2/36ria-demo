/**
 * @class yijs.SwfSlide
 * @fileOverview flash�õ�Ƭ
 * @author л�ĺ�
 * @email mohaiguyan12@126.com
 * @version 0.1
 * @date 2009-01-07
 * Copyright (c) 2010-2010 л�ĺ�
 */

/**�����ռ�*/
var yijs = yijs || {};
/**
 * @constructor
 * @param {Object} options ����
 */
yijs.SwfSlide = function(options){
	//�����Ĭ�ϲ���
	var defaults = {
		/** �Ƿ��Զ�������������Ϊfalse������ʵ���������󣬵���render����������*/
		autoRender : false,
		/** flash·��*/
		swf : null,
		/** ����������õĶ���*/
		applyTo : null,
		/** ͼƬ����*/
		images : null,
		/** flash���������*/
		width : 325,
		/** flash�������߶�*/
		height : 250,
		/** /��Ťλ�� 1�� 2�� 3�� 4��*/
		buttonPos : 4,
		/**ͼƬ�л��ٶ�*/
		speed : 3000,
		/** �Ƿ���ʾ����*/
		showText : 0,
		/** ������ɫ*/
		txtcolor : "000000",
		/**����ɫ*/
		bgcolor : "DDDDDD",
		wmode : 'transparent',
		scriptAccess : 'sameDomain',
		expressInstall : null,	
		/**�¼�����*/
		listeners : {
			render : null
		}
	}; 
	//����Ĭ�ϲ���
	this.options = $.extend(defaults, options);
	this.cls = {
			swfSlide : "yijs_swfSlide"
	}
	this.$applyTo = null;
	this.images = this.options.images;
	this.aImag = new Array();
	this.aLink = new Array();
	this.aText = new Array();	
	this.pics = "";
	this.links = "";
	this.texts = "";
	this.length = 0;
	if(this.options.autoRender) this.render();	
}
yijs.SwfSlide.id = 0;
yijs.SwfSlide.prototype = {
	render : function(){
		var _that = this;
		var _opts = this.options;
		this.$applyTo = $(_opts.applyTo);
		if(_opts.applyTo != null && this.$applyTo.size() > 0){
			this._setStyle();
			if(_opts.images == null) this.setImages();
			this._setArrs();
			this._createSwf();
			yijs.SwfSlide.id ++;
		}	
    },
    setImages : function(){
    	var _that  = this;
    	this.images = [];
    	var $li = this.$applyTo.children("li");
    	this.length = $li.size();
    	this.$applyTo.children("li").each(function(){
    		var href = $(this).children("a").attr("href") || "";
    		var img = $(this).find("img").attr("src") || "";
    		var text = $(this).find("img").attr("title") || "";
    		_that.images.push([href,img,text]);
    	})
    	
    },
    /**
     * ����һ��flash����
     */    
    _createSwf : function(){
    	if(swfobject){
    		var _opts = this.options;
    		var data = {};
    		$.each(_opts,function(key,value){
    			if(value != null) data[key] = value;
    		})
    		data.pic_height = _opts.height;
    		data.pic_width = _opts.width;
    		data.stop_time = _opts.speed;
    		data.show_text = _opts.showText;
    		data.button_pos = _opts.buttonPos;
    		data.pics = this.pics;
    		data.links = this.links;
    		data.texts = this.texts;
    		swfobject.embedSWF(_opts.swf,this.$applyTo.attr("id"), _opts.width, _opts.height, '9.0.24', _opts.expressInstall, data, {'quality':'high','wmode':_opts.wmode,'allowScriptAccess':_opts.scriptAccess});
    	}     	
    },
    _setArrs : function(){
    	var _that = this;
    	if(this.images.length > 0){
    		$.each(this.images,function(a){
    			a++;
    			_that.aImag[a] = _that.images[a-1][1];
    			_that.aLink[a] = _that.images[a-1][0];
    			_that.aText[a] = _that.images[a-1][3];
    		})
    		
    		for(var i=1; i<this.aImag.length; i++){
    			this.pics=this.pics+("|"+this.aImag[i]);
    			this.links=this.links+("|"+this.aLink[i]);
    			this.texts=this.texts+("|"+this.aText[i]);
    		}
    		this.pics=this.pics.substring(1);
    		this.links=this.links.substring(1);
    		this.texts=this.texts.substring(1);    		
    	}
    },
    _setStyle : function(){
    	var _opts = this.options;
    	this.$applyTo.width(_opts.width).height(_opts.height);
    	this.$applyTo.addClass(this.cls.swfSlide);
    }
}