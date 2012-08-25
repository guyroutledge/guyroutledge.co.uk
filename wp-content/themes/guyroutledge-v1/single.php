<?php get_header() ?>
<?php the_post() ?>
<?php $tldr = get_post_meta($post->ID, 'tldr', true); ?>

	<section class="section blog-section group">

		<article class="blog-post inside">

			<a href="#respond" title="Jump to the Comments"><h2 class="post-title" data-comments="<?php echo get_comments_number() ?>"><?php the_title() ?></h2></a>
 			
 			<?php get_template_part( '/inc/meta' ) ?>

 			<?php if ( !empty($tldr) ) { ?>
 				<p class="tldr imgblock">
 					<span class="img">TL;DR:</span>
 					<span class="content"><?php echo $tldr ?></span>
 				</p>
 			<?php } ?>

 			<?php the_content() ?>
 			
 			<p><?php edit_post_link('Edit this entry','','.'); ?></p>

 		</article>

	</section>

	<section class="section blog-section group">
		<div class="inside">
			<?php comments_template() ?>
		</div>
	</section>

<?php get_footer() ?>