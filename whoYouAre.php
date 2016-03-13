<?php
	session_start();
	$user = $_POST['userName'];
	$_SESSION['user'] = $user;
	header('Location: https://extend1994.github.io/ChatRoom/room.html');
	echo $_SESSION['user'];
?>