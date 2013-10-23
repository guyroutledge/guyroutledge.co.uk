<!doctype html>
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js lt-ie9" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
	<meta http-equiv="Content-Type" content="<?php bloginfo('html_type'); ?>; charset=<?php bloginfo('charset'); ?>">
  	<meta name="description" content="">

	<title><?php wp_title('|', true, 'right'); ?> <?php bloginfo('name') ?>: <?php bloginfo('description'); ?></title>

  	<?php if (is_search()) { ?>
	   <meta name="robots" content="noindex, nofollow" />
	<?php } ?>

	<link rel="stylesheet" href="<?php bloginfo('template_directory') ?>/stylesheets/screen.css" media="screen">

	<meta name="viewport" content="width=device-width">

	<!-- Uncomment to load Modernizr for feature detection
	<script src="js/libs/modernizr-2.5.3.min.js"></script> -->

	<?php // scripts loaded by WP in footer ?>
	<?php wp_enqueue_script( 'jquery' ) ?>
	<?php wp_enqueue_script( 'theme_scripts', get_bloginfo('template_directory').'/js/scripts.js', array('jquery'), null, true ) ?>
	<?php wp_enqueue_script( 'plugins', get_bloginfo('template_directory').'/js/plugins.js', array('jquery'), null, true ) ?>

	<?php // Wordpress Stuff ?>
	<link rel="pingback" href="<?php bloginfo('pingback_url') ?>">
	<?php if ( is_singular() ) { wp_enqueue_script( 'comment-reply' ); } ?>
	<?php wp_head() ?>

</head>
<body <?php body_class() ?>>

		<header class="site-header">
			<div class="main-title">
				<div class="inner-wrap">
					<img class="header-img" src="<?php echo get_template_directory_uri() . '/img/guyroutledge.png' ?>" alt="Guy Routledge">
					<h1 class="no-margin"><a href="/"><?php bloginfo('name') ?></a></h1>
				</div>
			</div>
			<div class="inner-wrap">
				<small class="sub-title brand-font"><?php bloginfo('description') ?></small>
			</div>
		</header>

		<div class="page-wrap">

		<nav class="topics">
			<ul>
				<li><a class="topic blog" href="<?php echo get_permalink( get_ID_by_slug( 'blog' ) ) ?>" data-link="#blog">blog</a></li>
				<li><a class="topic about" href="<?php echo get_permalink( get_ID_by_slug( 'about' ) ) ?>" data-link="#about">about</a></li>
				<li><a class="topic work" href="<?php echo get_permalink( get_ID_by_slug( 'work' ) ) ?>" data-link="#work">work</a></li>
				<li><a class="topic social" href="<?php echo get_permalink( get_ID_by_slug( 'social' ) ) ?>" data-link="#social">social</a></li>
			</ul>
		</nav>

		<div class="banner">
			<h2 class="trois brand-color">hi.</h2>
			<p>I'm a web geek and front-end developer from London.</p>
			<p class="nosey">have a nosey around <span class="arrow"></span></p>
		</div>
