<?php get_header() ?>


	<section class="section blog-section group">
		
		<a id="blog"></a>
		<h2 class="title blog"><i class="icon-category"></i> Category: <?php single_cat_title() ?></h2>
		
		<?php // get posts from category with standard loop

		while ( have_posts() ) : the_post();

			$post_quote = get_post_meta($post->ID, 'quote', true); ?>

			<article class="blog-post inside">
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

	</section>

	<section class="section blog-section group">

		<h2 class="title blog"><i class="icon-archive"></i> Archives </h2>

		<div class="inside">
			<?php $current_year = (int)date('Y'); ?>
			<?php $archives = get_posts('numberposts=-1&offset=0') ?>

			<?php if ( $archives ) { ?>
				
				<h4><?php echo $current_year ?></h4>
				<ul>

				<?php foreach ( $archives as $post ) { ?>
					<?php $post_year = get_the_time('Y') ?>
					<li><a href="<?php the_permalink() ?>"><span class="archive-meta"><?php the_time('j F') ?> &mdash; </span> <?php the_title() ?></a></li>
						

						<?php if ( $post_year < $current_year ) {
							$current_year = $post_year; ?>
							</ul>
							<h4><?php echo $current_year ?></h4>
							<ul>
						<?php } ?>

				<?php } ?>

				</ul>

			<?php } ?>	
		</div>
		
	</section>	


	<section class="section group">
		<h2 class="title blog search"><i class="icon-search"></i> Search</h2>
		<div class="inside">
			<h3 class="quatre no-margin">Can't find what you're looking for? </h3>
			<p>Why not have a go with this lovely search form:</p>

			<div class="site-search group">
				<?php get_search_form() ?>
			</div>
		</div>
	</section>


<?php get_footer() ?>