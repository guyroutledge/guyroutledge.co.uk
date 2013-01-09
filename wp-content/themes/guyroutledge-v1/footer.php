		</div> <!-- end .page-wrap -->
		<footer>
			<div class="inner-wrap">
				<p>&copy;<?php echo date("Y"); echo " "; bloginfo('name'); ?></p>
				<ul class="nav stacked footer-links group">
					<li><i class="icon-twitter"></i> <a href="http://www.twitter.com/guyroutledge" title="Twitter">@guyroutledge</a></li>
					<li><i class="icon-github"></i> <a href="http://www.github.com/guyroutledge" title="Github">guyroutledge</a></li>
					<li><i class="icon-codepen"></i> <a href="http://www.codepen.io/guyroutledge" title="Codepen">guyroutledge</a></li>
				</ul>
			</div>

		</footer>

		<?php // Google Analytics tracking code ?>
		<script type="text/javascript">

		  var _gaq = _gaq || [];
		  _gaq.push(['_setAccount', 'UA-37507733-1']);
		  _gaq.push(['_trackPageview']);

		  (function() {
		    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		  })();

		</script>

<?php wp_footer() ?>
</body>
</html>