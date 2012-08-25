<?php get_header() ?>
<?php the_post() ?>

	<section class="section group">
		
		<a href="<?php echo get_permalink(get_ID_by_slug('blog')) ?>">
			<h2 class="title blog"><i class="icon-calendar"></i> Latest Posts</h2>
		</a>
		
		
		<?php // new query for latest posts

		$args = array(
			'post_type' => 'post',
			'posts_per_page' => 2,
			'order_by' => 'date',
			'order' => 'DESC'
		);

		$latest_posts = new WP_Query( $args );

		while ( $latest_posts->have_posts() ) : $latest_posts->the_post();

			$post_quote = get_post_meta($post->ID, 'quote', true); ?>

			<article class="inside blog-post">
				<a href="<?php the_permalink() ?>">
					<h3 class="post-title" data-comments="<?php echo get_comments_number() ?>"><?php the_title() ?></h3>
				</a>

				<?php if ( !empty($post_quote) ) : ?>
				
					<a href="<?php the_permalink() ?>">
						<blockquote class="quote post-quote">
	 						<?php echo wpautop($post_quote) ?>
	 					</blockquote>
	 				</a>

	 			<?php endif ?>

				<?php the_excerpt() ?>
			</article>

		<?php endwhile; wp_reset_query() ?>
	
		<?php get_template_part( 'inc/blog-nav' ) ?>

	</section>

	<section class="section group">

		<?php // new query for about page

		$args = array(
			'page_id' => get_ID_by_slug( 'about' ),
			'post_type' => 'page',
			'posts_per_page' => 1,
		);

		$about_page = new WP_Query( $args );

		while ( $about_page->have_posts() ) : $about_page->the_post() ?>

			<a href="<?php the_permalink() ?>">
				<h2 class="title about"><i class="icon-question-sign"></i> <?php the_title() ?></h2>
			</a>
			<div class="inside">
				<?php the_excerpt() ?>
			</div>

		<?php endwhile; wp_reset_query() ?>

	</section>

	<section class="section group">

		<?php // new query for work page

		$args = array(
			'page_id' => get_ID_by_slug( 'work' ),
			'post_type' => 'page',
			'posts_per_page' => 1,
		);

		$work_page = new WP_Query( $args );

		while ( $work_page->have_posts() ) : $work_page->the_post() ?>

			<a href="<?php the_permalink() ?>">
				<h2 class="title work"><i class="icon-cog"></i> <?php the_title() ?></h2>
			</a>
			<div class="inside">
				<?php the_excerpt() ?>
			</div>

		<?php endwhile; wp_reset_query() ?>	

	</section>

	<section class="section social-section group">

		<?php // new query for social page

		$args = array(
			'page_id' => get_ID_by_slug( 'social' ),
			'post_type' => 'page',
			'posts_per_page' => 1,
		);

		$social_page = new WP_Query( $args );

		while ( $social_page->have_posts() ) : $social_page->the_post() ?>

			<a href="<?php the_permalink() ?>">
				<h2 class="title social"><i class="icon-comment"></i> <?php the_title() ?></h2>
			</a>
			<div class="inside">
				<?php the_excerpt() ?>

				<?php get_template_part('inc/latest-tweet'); ?>

			</div>

		<?php endwhile; wp_reset_query() ?>	

	</section>

<?php get_footer() ?>
