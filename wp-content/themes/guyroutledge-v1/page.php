<?php get_header() ?>
<?php the_post() ?>

	<?php $slug = ''; $icon = '';
		if ( !empty($post) ) {
			$slug = $post->post_name;

			switch ( $slug ) {
				case 'about':
					$icon = 'question-sign';
					break;
				case 'work':
					$icon = 'cog';
					break;
				case 'blog':
					$icon = 'edit';
					break;
				case 'social':
					$icon = 'comment';
					break;
				case 'search':
					$icon = 'search';
					break;
			}

		} ?>

	<section class="section group">
		<h2 class="title <?php echo $slug ?>"><i class="icon-<?php echo $icon ?>"></i> <?php the_title() ?></h2>
		<div class="inside">

			<?php the_content() ?>
			<?php if ( is_page('social') ) get_template_part('inc/latest-tweet'); ?>
			
		</div>
	</section>

<?php get_footer() ?>