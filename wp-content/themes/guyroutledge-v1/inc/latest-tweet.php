<blockquote id="twitter" class="quote tweet">
<?php $latest_tweet = bfstf_get_tweets( 'guyroutledge', 1, 3600 );
echo wpautop( $latest_tweet[0] ); ?>
</blockquote>

<?php // follow me button ?>
<a href="https://twitter.com/guyroutledge" class="twitter-follow-button" data-show-count="false">Follow @guyroutledge</a>
<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
