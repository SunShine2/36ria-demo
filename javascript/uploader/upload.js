(function () {
	var input = document.getElementById("images"), 
		formdata = false;
    //��ʾ�ϴ�ͼƬ
	function showUploadedItem (source) {
  		var list = document.getElementById("image-list"),
	  		li   = document.createElement("li"),
	  		img  = document.createElement("img");
  		img.src = source;
  		li.appendChild(img);
		list.appendChild(li);
	}   
    //����������֧��FormData�����ذ�ť
	if (window.FormData) {
  		formdata = new FormData();
  		document.getElementById("btn").style.display = "none";
	}
	//�����ϴ����change�¼�
 	input.addEventListener("change", function (evt) {
        //�ı���Ϣ����İ�
 		document.getElementById("response").innerHTML = "Uploading . . ."
 		var i = 0, len = this.files.length, img, reader, file;
	    //�����ļ�
		for ( ; i < len; i++ ) {
			file = this.files[i];
	        //�ļ�����ΪͼƬ
			if (!!file.type.match(/image.*/)) {
                //�����֧��FileReader����
				if ( window.FileReader ) {
					reader = new FileReader();
                    //�����ļ���ȡ�������¼�
					reader.onloadend = function (e) {
                        //��ͼƬ��ӵ���ʾ�б�
						showUploadedItem(e.target.result, file.fileName);
					};
                    //��ȡ�ļ�
					reader.readAsDataURL(file);
				}
                //���ļ�������ӵ�FormData������
				if (formdata) {
					formdata.append("images[]", file);
				}
			}
		}
//����ajax���󣬴洢�ļ�������FormData�����ȥ��
if (formdata) {
    $.ajax({
        url: "upload.php",
        type: "POST",
        data: formdata,
        processData: false,
        contentType: false,
        success: function (res) {
            //���ϴ��ɹ������ʾ��ӡ��ҳ��
            document.getElementById("response").innerHTML = res;
        }
    });
}
	}, false);
}());
