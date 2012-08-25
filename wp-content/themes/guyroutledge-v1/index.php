<?php get_header() ?>
<?php the_post() ?>

<h2 class="title blog"><i class="icon-asterisk"></i> <?php the_title() ?></h2>

<article class="call-out blog-post">
	<h3 class="post-title" data-comments="<?php echo get_comments_number() ?>"><?php the_title() ?></h3>
	<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
	<p><a href="#">&gt; read more</a></p>
</article>

<?php get_template_part( 'inc/blog-nav' ) ?>

<?php get_footer() ?>