<?php

	if (!empty($_SERVER['SCRIPT_FILENAME']) && 'comments.php' == basename($_SERVER['SCRIPT_FILENAME']))
		die ('Please do not load this page directly. Thanks!');

	if ( post_password_required() ) { ?>
		This post is password protected. Enter the password to view comments.
	<?php
		return;
	}
?>

<?php if ( have_comments() ) : ?>

	<h2 id="comments" class="comments-title"><?php comments_number('No Responses', 'One Response', '% Responses' );?></h2>

	<ol class="commentlist">
		<?php wp_list_comments(); ?>
	</ol>

 <?php else : // this is displayed if there are no comments so far ?>

	<?php if ( comments_open() ) : ?>
		<!-- If comments are open, but there are no comments. -->

	 <?php else : // comments are closed ?>
		<p>Comments are closed.</p>

	<?php endif; ?>

<?php endif; ?>

<?php if ( comments_open() ) : ?>

<div id="respond">

	<h2 class="comments-title"><i class="icon-comment"></i> <?php comment_form_title( 'Leave a Reply', 'Leave a Reply to %s' ); ?></h2>

	<div class="cancel-comment-reply">
		<?php cancel_comment_reply_link(); ?>
	</div>

	<?php if ( get_option('comment_registration') && !is_user_logged_in() ) : ?>
		<p>You must be <a href="<?php echo wp_login_url( get_permalink() ); ?>">logged in</a> to post a comment.</p>
	<?php else : ?>

	<form action="<?php echo get_option('siteurl'); ?>/wp-comments-post.php" method="post" id="commentform" class="comments-form">

		<ul class="nav stacked flush">

			<?php if ( is_user_logged_in() ) : ?>

				<p class="login-status">Logged in as <a href="<?php echo get_option('siteurl'); ?>/wp-admin/profile.php"><?php echo $user_identity; ?></a>. Not <?php echo $user_identity ?>? <a href="<?php echo wp_logout_url(get_permalink()); ?>" title="Log out of this account">Log out &gt;</a></p>

			<?php else : ?>

				<li>
					<label for="author">Name <?php if ($req) echo "<span class='required'>*</span>" ?></label>
					<input type="text" name="author" id="author" value="<?php echo esc_attr($comment_author); ?>" <?php if ($req) echo "aria-required='true'"; ?>>
				</li>

				<li>
					<label for="email">Email <span>(will not be published)</span> <?php if ($req) echo "<span class='required'>*</span>" ?></label>
					<input type="email" name="email" id="email" value="<?php echo esc_attr($comment_author_email); ?>" <?php if ($req) echo "aria-required='true'"; ?>>
				</li>

				<li>
					<label for="url">Website</label>
					<input type="text" name="url" id="url" value="<?php echo esc_attr($comment_author_url); ?>" >
				</li>

			<?php endif; ?>

			<!--<p>You can use these tags: <code><?php echo allowed_tags(); ?></code></p>-->

			<li>
				<label for="comment">Comment <?php if ( $req ) echo "<span class='required'>*</span>" ?><br>
					<p class="allowed-tags">
						You can use code in comments:<br>
						Wrap inline code in <span>&lt;code&gt;&lt;/code&gt;</span> tags<br>
						Wrap block code in <span>&lt;pre&gt;&lt;code&gt;&lt;/code&gt;&lt;/pre&gt;</span> tags<br>
						Add <span>&lt;code class="language-|css|markup|javascript"&lt;/code&gt;</span> for highlighting.
					</p>
				</label>
				<textarea name="comment" id="comment" cols="58" rows="10" tabindex="4"></textarea>
			</li>

			<li class="form-footer">
				<label for="submit" class="comment-submit-label">Post your comment</label>
				<input class="button submit comment-submit " name="submit" type="submit" id="submit" tabindex="5" value="Go">
				<?php comment_id_fields() ?>
			</li>

		</ul>

		<?php do_action('comment_form', $post->ID); ?>

	</form>

	<?php endif; // If registration required and not logged in ?>

</div>

<?php endif; ?>
