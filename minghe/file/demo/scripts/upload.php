<?php
//�õ�Ŀ¼�µ��ļ�����
function get_file_count($dir_name){             
	$files = 0; 
	if ($handle = opendir($dir_name)) { 
	while (false !== ($file = readdir($handle))) {  
		$files++; 
	} 
	closedir($handle); 
	} 
	return $files; 
}
//ѭ��ɾ��Ŀ¼���ļ�����
function delDirAndFile($dirName){
	if ($handle = opendir($dirName) ) {
	   while ( false !== ( $item = readdir($handle) ) ){
		  if ( $item != "." && $item != ".." ) {
		  	unlink("$dirName/$item");
		  } 
		  
	   }
	   closedir($handle);
	   
	}
}
if (!empty($_FILES)) {
	$tempFile = $_FILES['Filedata']['tmp_name'];
	$targetPath = $_SERVER['DOCUMENT_ROOT'] . $_REQUEST['folder'] . '/';
	$targetFile =  str_replace('//','/',$targetPath) . $_FILES['Filedata']['name'];
	/*-----------------*/
	//�������д�������ɾ���ļ���ʵ��Ӧ��ʱ������ɾ����get_file_count()��delDirAndFile��������������ɾ��
	$folderPath = $_SERVER['DOCUMENT_ROOT'] . $_REQUEST['folder'];
	$size = get_file_count($folderPath);
	if($size > 6) delDirAndFile($folderPath);
	/*-----------------*/
	move_uploaded_file($tempFile,$targetFile);
	echo "1";
}
?>