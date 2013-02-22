$(function() {
	// generate unique user id
	var userId = Math.random().toString(16).substring(2,15);
	var socket = io.connect('/');
	var map;

	var info = $('#infobox');
	var doc = $(document);

	// 自定义坐标定位样式
	var tinyIcon = L.Icon.extend({
		options: {
			shadowUrl: '../assets/marker-shadow.png',
			iconSize: [25, 39],
			iconAnchor:   [12, 36],
			shadowSize: [41, 41],
			shadowAnchor: [12, 38],
			popupAnchor: [0, -30]
		}
	});
	var redIcon = new tinyIcon({ iconUrl: '../assets/marker-red.png' });
	var yellowIcon = new tinyIcon({ iconUrl: '../assets/marker-yellow.png' });

	var sentData = {}

	var connects = {};
	var markers = {};
	var active = false;

	socket.on('load:coords', function(data) {
		if (!(data.id in connects)) {
			setMarker(data);
		}

		connects[data.id] = data;
        	connects[data.id].updated = $.now(); // shothand for (new Date).getTime()
	});
    /**
     * 浏览器是否支持 geolocation api
     * @return Boolean
     */
    function isSupportGeo(){
        var isSupport = false;
        if (navigator.geolocation) {
            isSupport = true;
        } else {
            isSupport = false;
            console.log('浏览器不支持geolocation');
        }
        return isSupport;
    }
    //获取用户当前位置
	if (isSupportGeo) {
		navigator.geolocation.getCurrentPosition(positionSuccess, positionError, { enableHighAccuracy: true });
	} else {
		$('.map').text('Your browser is out of fashion, there\'s no geolocation!');
	}
    /**
     * 获取地理信息成功后执行的回调函数
     * @param position 位置信息
     */
	function positionSuccess(position) {
        //纬度
		var lat = position.coords.latitude;
        //经度
		var lng = position.coords.longitude;
        //以米为单位的经度和纬度的精确度
		var acr = position.coords.accuracy;

		// 定位用户坐标
		var userMarker = L.marker([lat, lng], {
			icon: redIcon
		});
		// demo
		// userMarker = L.marker([51.45, 30.050], { icon: redIcon });

		// 加载地图
		map = L.map('map');

		// 配置地图瓦片图层的图片地址
		L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', { maxZoom: 18, detectRetina: true }).addTo(map);

		// 配置地图容器填充满整个世界
		map.fitWorld();

		userMarker.addTo(map);
		userMarker.bindPopup('<p>你在这里，你的id是 ' + userId + '</p>').openPopup();

		var emit = $.now();
		//用户使用应用时候发送socket请求
		doc.on('mousemove', function() {
			active = true; 

			sentData = {
				id: userId,
				active: active,
				coords: [{
					lat: lat,
					lng: lng,
					acr: acr
				}]
			}

			if ($.now() - emit > 30) {
				socket.emit('send:coords', sentData);
				emit = $.now();
			}
		});
	}

	doc.bind('mouseup mouseleave', function() {
		active = false;
	});

	// showing markers for connections
	function setMarker(data) {
		for (i = 0; i < data.coords.length; i++) {
			var marker = L.marker([data.coords[i].lat, data.coords[i].lng], { icon: yellowIcon }).addTo(map);
			marker.bindPopup('<p>One more external user is here!</p>');
			markers[data.id] = marker;
		}
	}

	// handle geolocation api errors
	function positionError(error) {
		var errors = {
			1: 'Authorization fails', // permission denied
			2: 'Can\'t detect your location', //position unavailable
			3: 'Connection timeout' // timeout
		};
		showError('Error:' + errors[error.code]);
	}

	function showError(msg) {
		info.addClass('error').text(msg);

		doc.click(function() { info.removeClass('error') });
	}

	// delete inactive users every 15 sec
	setInterval(function() {
		for (ident in connects){
			if ($.now() - connects[ident].updated > 15000) {
				delete connects[ident];
				map.removeLayer(markers[ident]);
			}
        	}
    	}, 15000);
});