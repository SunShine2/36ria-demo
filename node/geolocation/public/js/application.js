$(function() {
	// generate unique user id
	var userId = Math.random().toString(16).substring(2,15);
	var socket = io.connect('/');
	var map;

	var info = $('#infobox');
	var doc = $(document);

	// �Զ������궨λ��ʽ
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
     * ������Ƿ�֧�� geolocation api
     * @return Boolean
     */
    function isSupportGeo(){
        var isSupport = false;
        if (navigator.geolocation) {
            isSupport = true;
        } else {
            isSupport = false;
            console.log('�������֧��geolocation');
        }
        return isSupport;
    }
    //��ȡ�û���ǰλ��
	if (isSupportGeo) {
		navigator.geolocation.getCurrentPosition(positionSuccess, positionError, { enableHighAccuracy: true });
	} else {
		$('.map').text('Your browser is out of fashion, there\'s no geolocation!');
	}
    /**
     * ��ȡ������Ϣ�ɹ���ִ�еĻص�����
     * @param position λ����Ϣ
     */
	function positionSuccess(position) {
        //γ��
		var lat = position.coords.latitude;
        //����
		var lng = position.coords.longitude;
        //����Ϊ��λ�ľ��Ⱥ�γ�ȵľ�ȷ��
		var acr = position.coords.accuracy;

		// ��λ�û�����
		var userMarker = L.marker([lat, lng], {
			icon: redIcon
		});
		// demo
		// userMarker = L.marker([51.45, 30.050], { icon: redIcon });

		// ���ص�ͼ
		map = L.map('map');

		// ���õ�ͼ��Ƭͼ���ͼƬ��ַ
		L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', { maxZoom: 18, detectRetina: true }).addTo(map);

		// ���õ�ͼ�����������������
		map.fitWorld();

		userMarker.addTo(map);
		userMarker.bindPopup('<p>����������id�� ' + userId + '</p>').openPopup();

		var emit = $.now();
		//�û�ʹ��Ӧ��ʱ����socket����
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