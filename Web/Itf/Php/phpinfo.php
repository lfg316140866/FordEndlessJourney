<?php
if(1==1) {
	$_s = 0;	
}

if(isset($_s)==false) {
	echo "变量不存在"; 
}
else { echo $_s;}

echo phpinfo();
?>