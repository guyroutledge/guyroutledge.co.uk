<?php
$args = array(
	'post_type' => 'portfolio',
	'post_status' => 'publish',
	'posts_per_page' => -1
);
$portfolio = new WP_Query($args);

while ( $portfolio->have_posts() ) : $portfolio->the_post();

	$url     = get_field('url');
	$desktop = get_field('_desktop_image');
	$tablet  = get_field('_tablet_image');
	$mobile  = get_field('_mobile_image'); ?>

	<article class="work-section">

		<h2 class="work-title"><?php the_title() ?></h2>
		<?php if ( !empty($url) ) { ?>
			<a class="work-link" href="<?php echo $url ?>"><?php echo $url ?></a>
		<?php } ?>

		<div class="work-container">
			<?php if ( !empty($desktop) ) { ?>
				<a href="<?php echo $url ?>">
					<img class="work-desktop" src="<?php bloginfo('template_directory') ?>/img/desktop.png" style="background-image:url('<?php echo $desktop ?>');">
				</a>
			<?php } ?>
			<?php if ( !empty($tablet) ) { ?>
				<a href="<?php echo $url ?>">
					<img class="work-tablet" src="<?php bloginfo('template_directory') ?>/img/tablet.png" style="background-image:url('<?php echo $tablet ?>');">
				</a>
			<?php } ?>
			<?php if ( !empty($mobile) ) { ?>
				<a href="<?php echo $url ?>">
					<img class="work-mobile" src="<?php bloginfo('template_directory') ?>/img/mobile.png" style="background-image:url('<?php echo $mobile ?>');">
				</a>
			<?php } ?>
		</div>
		<div class="work-content">
			<?php the_content() ?>
		</div>

	</article>

<?php endwhile ?>
