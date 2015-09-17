<?php
session_start ();

require_once ('CmnMis/IncludeFiles.php');
require_once ('Cmn/Safe.php');
include_once ('Cmn/Request.php');
require_once ('SiteFunc.php');

$_ret = "";
switch (Request::Get ( 'method' )) {
	case 'InsertEnrollment' :
		$_ret = Itf::InsertEnrollment ();
		break;
	case 'GetPrize' :
		$_ret = Itf::GetPrize ();
		break;
	case 'GetCity' :
		$_ret = Itf::GetCity ();
		break;
	case 'PostVerification' :
		$_ret = Itf::PostVerification ();
		break;
	case 'SubmitMysticPackage' :
		$_ret = Itf::SubmitMysticPackage ();
		break;
		case 'Share' :
		$_ret = Itf::Share ();
		break;
		case 'InsertPcEnrollment' :
			$_ret = Itf::InsertPcEnrollment ();
			break;
		
	default :
		$_ret = "{\"IsSuccess\":\"0\",\"ErrMsg\":\"不存在的方法！\"}";
		break;
}
echo $_ret;
class Itf {
	
	//pc留咨
	public  static function InsertPcEnrollment()
	{
		$_name = Request::Get ( 'name' );
		if ($_name == "") {
			return "{\"IsSuccess\":\"0\",\"ErrMsg\":\"参数name为空！\"}";
		}
		$_phone = Request::Get ( 'phone' );
		if ($_phone == "") {
			return "{\"IsSuccess\":\"0\",\"ErrMsg\":\"参数phone为空！\"}";
		}
		else {
			
		$_phonecount=DB::getFieldValue("select count(phone) from usr_enrollment where phone='".$_phone."' ");
			if(((int) $_phonecount)>0)
			{
				return "{\"IsSuccess\":\"2\",\"ErrMsg\":\"已存在手机号码！\"}";
			}
		}
		$_province = Request::Get ( 'province_id' );
		if ($_province == "") {
			return "{\"IsSuccess\":\"0\",\"ErrMsg\":\"参数province_id为空！\"}";
		}
		$_city = Request::Get ( 'city_id' );
		if ($_city == "") {
			return "{\"IsSuccess\":\"0\",\"ErrMsg\":\"参数city_id为空！\"}";
		}
		$_owners = Request::Get ( 'owners' );
		
		$_source = "1";//代表pc留咨询
		
		$_source_location=Request::Get('source_location');
		if ($_source_location == "") {
			return "{\"IsSuccess\":\"0\",\"ErrMsg\":\"参数source_location为空！\"}";
		}
    $_memo=Request::Get('memo');
    
		$_sql = "insert into  usr_enrollment (name,phone,province_id,city_id,owners,source,source_location,cmn_createdate,memo) values('" . $_name . "','" . $_phone . "','" . $_province . "','" . $_city . "','" . $_owners . "','" . $_source . "','".$_source_location."',Now(),'".$_memo."') ";
		if (DB::exeSql ( $_sql )) {
			return "{\"IsSuccess\":\"1\",\"ErrMsg\":\"留咨成功\"}";
		} else {
			return "{\"IsSuccess\":\"0\",\"ErrMsg\":\"留咨失败\"}";
		}
	}
	// 三星接口留咨
	public static function InsertEnrollment() {
		$_user_id = SiteFunc::GetUserID ();
		if ($_user_id == "") {
			return "{\"IsSuccess\":\"0\",\"ErrMsg\":\"用户未登录！\"}";
		}
		
		$_name = Request::Get ( 'name' );
		if ($_name == "") {
			return "{\"IsSuccess\":\"0\",\"ErrMsg\":\"参数name为空！\"}";
		}
		$_phone = Request::Get ( 'phone' );
		if ($_phone == "") {
			return "{\"IsSuccess\":\"0\",\"ErrMsg\":\"参数phone为空！\"}";
		}
		$_province = Request::Get ( 'province_id' );
		if ($_province == "") {
			return "{\"IsSuccess\":\"0\",\"ErrMsg\":\"参数province_id为空！\"}";
		}
		$_city = Request::Get ( 'city_id' );
		if ($_city == "") {
			return "{\"IsSuccess\":\"0\",\"ErrMsg\":\"参数city_id为空！\"}";
		}
		$_owners = Request::Get ( 'owners' );
		
		$_source = Request::Get ( 'source' );
		if ($_source == "") {
			return "{\"IsSuccess\":\"0\",\"ErrMsg\":\"参数source为空！\"}";
		}
		
		$_sql = "insert into  usr_enrollment (user_id,name,phone,province_id,city_id,owners,source,cmn_createdate) values('" . $_user_id . "','" . $_name . "','" . $_phone . "','" . $_province . "','" . $_city . "','" . $_owners . "','" . $_source . "',Now()) ";
		if (DB::exeSql ( $_sql )) {
			return "{\"IsSuccess\":\"1\",\"ErrMsg\":\"留咨成功\"}";
		} else {
			return "{\"IsSuccess\":\"0\",\"ErrMsg\":\"留咨失败\"}";
		}
	}
	
	// 抽奖
	public static function GetPrize() {
		$_user_id = SiteFunc::GetUserID ();
		
		// 限制IP
		$_ip = Request::GetIP ();
		
		// 判断之前有没有中奖
		$_prize_rec_id = DB::getFieldValue ( "select prize_rec_id from bas_prize_rec a inner join bas_prize b on a.prize_id=b.prize_id where user_id = '" . $_user_id . "' and is_goods=1" );
		$_and_cond = "";
		if ($_prize_rec_id != "") { // 只能种不是实物的奖品
			$_and_cond = " and is_goods=0";
		}
		
		$_prizeSql = "select p.prize_id,prize_desc,prize_image,win_prize_probability
                  from  bas_prize p
									left join (
										select prize_id,count(*) cnt
                         from bas_prize_rec
												where prize_id <> 5 and cmn_createdate>date_add(now(),interval -7 day)
											group by prize_id
									) l on p.prize_id=l.prize_id
                  where surplus_prize_count>0
                    and  ifnull(cnt,0) < max_qty_per_day
                 " . $_and_cond . " order by win_prize_probability";
		
		$_result = DB::getResultSet ( $_prizeSql );
		$_ret_array = array ();
		
		if ($_result && $_result != "" && mysql_num_rows ( $_result ) > 0) {
			
			$_ret_array ["time"] = date ( "Y-m-d h:m:s" );
			$_rand = mt_rand ( 1, 10000 * mysql_num_rows ( $_result ) ); //
			$_win_probability_sum = 1; // 中奖率的累加
			
			while ( $_row = mysql_fetch_array ( $_result ) ) {
				
				if ($_rand >= $_win_probability_sum && $_rand < $_win_probability_sum + $_row ["win_prize_probability"]) {
					// 中奖
					$_sql = "call lottery(" . $_row ["prize_id"] . "," . $_user_id . ",'" . Request::GetIP () . "')";
					
					Log::WriteToFile ( "sql", $_sql );
					
					if (! DB::exeSql ( $_sql )) {
						$_ret_array ["IsSuccess"] = "0";
						$_ret_array ["ErrMsg"] = "没有中奖!";
						$_ret_array ["prize_id"] = "";
						
						return json_encode ( $_ret_array );
					}
					
					$_ret_array ["IsSuccess"] = "1";
					$_ret_array ["ErrMsg"] = "";
					$_ret_array ["prize_id"] = $_row ["prize_id"];
					$_ret_array ["prize_desc"] = $_row ["prize_desc"];
					return json_encode ( $_ret_array );
				}
				$_win_probability_sum += $_row ["win_prize_probability"];
			}
		} else {
			$_ret_array ["IsSuccess"] = "0";
			$_ret_array ["ErrMsg"] = "";
			$_ret_array ["prize_id"] ="";
			$_ret_array ["prize_desc"] = "";
			return json_encode ( $_ret_array );
		}
	}
	
	// 获取城市接口
	public static function GetCity() {
		$_province_id = Request::Get ( 'province_id' );
		if ($_province_id == "") {
			return "{\"IsSuccess\":\"0\",\"ErrMsg\":\"参数province_id为空！\"}";
		}
		return Itf::SqlToJson ( "select city_id,city_desc from bas_city where province_id='" . $_province_id . "'  order by city_id desc" );
	}
	
	// 发帖验证接口
	public static function PostVerification() {
		$_user_id = SiteFunc::GetUserID ();
		if ($_user_id == "") {
			return "{\"IsSuccess\":\"0\",\"ErrMsg\":\"用户未登录！\"}";
		}
		$_base64img = Request::Get ( 'base64img' );
		$_upload_img = "";
		if ($_base64img == "") {
			return "{\"IsSuccess\":\"0\",\"ErrMsg\":\"参数base64img为空！\"}";
		} else {
			$_upload_img = SiteFunc::UpLoadImg ( $_base64img );
			if ($_upload_img == "") {
				return "{\"IsSuccess\":\"0\",\"ErrMsg\":\"上传图片保存失败！\"}";
			}
		}
		
		$_forum_id = Request::Get ( 'forum_id' );
		if ($_forum_id == "") {
			return "{\"IsSuccess\":\"0\",\"ErrMsg\":\"参数forum_id为空！\"}";
		}
		$_name = Request::Get ( 'name' );
		if ($_name == "") {
			return "{\"IsSuccess\":\"0\",\"ErrMsg\":\"参数name为空！\"}";
		}
		$_sex = Request::Get ( 'sex' );
		if ($_sex == "") {
			return "{\"IsSuccess\":\"0\",\"ErrMsg\":\"参数sex为空！\"}";
		}
		$_phone = Request::Get ( 'phone' );
		if ($_phone == "") {
			return "{\"IsSuccess\":\"0\",\"ErrMsg\":\"参数phone为空！\"}";
		}
		
		$_sql = "insert into  usr_post_verification (user_id,upload_img,forum_id,name,sex,phone,verification_time)values('" . $_user_id . "','" . $_upload_img . "','" . $_forum_id . "','" . $_name . "','" . $_sex . "','" . $_phone . "',Now()) ";
		
		if (DB::exeSql ( $_sql )) {
			return "{\"IsSuccess\":\"1\",\"ErrMsg\":\"发帖验证成功！\"}";
		} else {
			return "{\"IsSuccess\":\"0\",\"ErrMsg\":\"发帖验证失败\"}";
		}
	}
	

	
	//分享接口
	public  static function Share()
	{
		$_user_id = SiteFunc::GetUserID ();
		if ($_user_id == "") {
			return "{\"IsSuccess\":\"0\",\"ErrMsg\":\"用户未登录！\"}";
		}
		
		$_sharetitle = Request::Get ( 'ShareTitle' );
		if ($_sharetitle == "") {
			return "{\"IsSuccess\":\"0\",\"ErrMsg\":\"参数ShareTitle为空！\"}";
		}
		$_sharecontent = Request::Get ( 'ShareContent' );
		if ($_sharecontent == "") {
			return "{\"IsSuccess\":\"0\",\"ErrMsg\":\"参数ShareContent为空！\"}";
		}
		$_sql="insert into rec_share  (share_title,share_content,share_time) values('".$_sharetitle."','".$_sharecontent."',now())";
		if($_sql)
		{
			return "{\"IsSuccess\":\"1\",\"ErrMsg\":\"分享 成功！\"}";
		}
		else
		{
			return "{\"IsSuccess\":\"0\",\"ErrMsg\":\"分享失败！\"}";
		}
		
	} 
	
	// / <summary>
	// / 用sql语句获取数据并转换成json字符串
	// / </summary>
	// / <param name="sql">sql语句</param>
	// / <param name="curPage">当前页码</param>
	// / <param name="pageSize">每页的记录数</param>
	// / <returns>json格式的数据</returns>
	public static function SqlToJson($sql, $curPage = "", $pageSize = "") {
		if ($curPage == "") {
			$curPage = Request::Get ( "CurPage" );
		}
		if ($pageSize == "") {
			$pageSize = Request::Get ( "PageSize" );
		}
		
		$_recCount = DB::getFieldValue ( SqlAnalyse::GetRecCountSql ( $sql ) );
		
		if ($curPage == "" || $pageSize == "") {
			$_sql = $sql;
		} else {
			$_sql = $sql . " limit " . ($curPage - 1) * $pageSize . "," . $pageSize;
		}
		
		$_data = "{\"IsSuccess\":\"1\",\"ErrMsg\":\"成功\",\"RecCount\":\"" . $_recCount . "\",\"data\":" . DB::getJson ( $_sql ) . "}";
		
		return $_data;
	}
}
?>