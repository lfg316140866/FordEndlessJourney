<?php
if (! isset ( $_SESSION )) {
	@session_start ();
}
require_once ('CmnMis/IncludeFiles.php');
require_once ('Cmn/Log.php');
class SiteFunc {
	function AddUser() {
		$_openid = Request::Get ( "OpenID" );
		$_IsErr = Request::Get ( "error" );
		if (SiteFunc::GetUserID () != "") {
			return true;
		}
		
		if ($_IsErr == "1") {
			$_openid = "123" . SiteFunc::guid ();
		}
		
		if ($_openid == "") {
			$_url = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
			$_url = str_replace ( 'OpenID', "xxoo", $_url );
			$_url = str_replace ( 'Subscribe', "xxoo2", $_url );
			// echo $_url;
			header ( "location:http://wechat.fotile.com/WXCrmService20_1/authift.php?ReturnUrl=" . $_url . "" );
		} else {
			$_subscribe = Request::Get ( "Subscribe" );
			if ($_subscribe != 1) {
				header ( "location:http://mp.weixin.qq.com/s?__biz=MjM5MjEzNjA0MQ==&mid=203765366&idx=1&sn=1c480190b645c364f916668c1787e648#rd" );
			} else {
				$_userid = DB::getFieldValue ( "select user_id from usr_users where openid='" . $_openid . "'" );
				if ($_userid != "") {
					SiteFunc::SetUserID ( $_userid );
					return true;
				}
				$_sql = "insert into usr_users(openid) values('" . $_openid . "')";
				if (DB::exeSql ( $_sql )) {
					$_userid = DB::getFieldValue ( "select user_id from usr_users ORDER BY user_id desc limit 1" );
					SiteFunc::SetUserID ( $_userid );
					return true;
				} else {
					return false;
				}
			}
		}
	}
	public static function GetUserID() {
		$_id = @$_SESSION ["user_id"];
		return 2;
	}
	public static function SetUserID($_id) {
		Cookies::Set ( "user_id", $_id );
		$_SESSION ['user_id'] = $_id;
	}
	function guid() {
		mt_srand ( ( double ) microtime () * 10000 ); // optional for php 4.2.0 and up.
		$charid = strtoupper ( md5 ( uniqid ( rand (), true ) ) );
		$hyphen = chr ( 45 ); // "-"
		$uuid = substr ( $charid, 0, 8 ) . $hyphen . substr ( $charid, 8, 4 ) . $hyphen . substr ( $charid, 12, 4 ) . $hyphen . substr ( $charid, 16, 4 ) . $hyphen . substr ( $charid, 20, 12 );
		return $uuid;
	}
	public static function UpLoadImg($imageBase64Data,$path="/Upload/uploadimg/",$fileName="") {
	$_base64Data = substr($imageBase64Data,21);
	
		$_fileExt = "";
		$_fileNames="";
		if($fileName ==""){
				
			$_base64Header = substr($imageBase64Data,0,21);
			if(strpos($_base64Header,"gif")!=false){ $_fileExt =".gif";  }
			else if(strpos($_base64Header,"png")!=false){ $_fileExt =".png";  }
			else if(strpos($_base64Header,"jpg")!=false){ $_fileExt =".jpg"; }
			else if(strpos($_base64Header,"bmp")!=false){ $_fileExt =".bmp"; }
			else{$_fileExt =".jpg";}
			$_fileExt = rand(111111,999999)."_".date("Ymdhis").$_fileExt;
			$_fileNames=$_fileExt;
			$_fileExt=$_SERVER['DOCUMENT_ROOT'].$path.$_fileExt;
		}
		else{
			$_fileExt =$_SERVER['DOCUMENT_ROOT']. $path.$fileName;
		}
		
		
		if(!file_exists($path)){
			 
			mkdir($path,0777);
		}
	
		$_imageData = base64_decode(str_replace(" ","+",$_base64Data));
	
		file_put_contents($_fileExt, $_imageData);
		 
		if(file_exists ($_fileExt)){
			//1=pc下载的照片 2=手机分享的照片
	
			return  $path.$_fileNames;
		}else{
			return "";
		}
	}
}
?>