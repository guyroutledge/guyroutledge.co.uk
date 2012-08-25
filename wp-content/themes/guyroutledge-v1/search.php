<?php get_header() ?>

	<section class="section group">
		<h2 class="title blog"><i class="icon-search"></i> Search</h2>

		<div class="search-results">

		<?php if ( have_posts() ) : ?>

			<div class="inside"><h2>Search results for &ldquo;<?php echo !(empty($_GET['s'])) ? $_GET["s"] : ''  ?>&rdquo;</h2></div>

			<?php while ( have_posts() ) : the_post() ?>

				<article class="blog-post">
					<div class="inside">
						<?php the_title() ?>
						<?php the_excerpt() ?>
					</div>
				</article>

			<?php endwhile ?>

		<?php else : ?>

			<div class="inside">
				<h2 class="no-margin">Nothing like that here :(</h2>
				<p>Try looking for something else?</p>
				
				<div class="site-search group">
					<?php get_search_form() ?>
				</div>
				
			</div>

		<?php endif; ?>

	</section>	

<?php get_footer() ?>
