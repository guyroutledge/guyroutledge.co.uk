<aside>

    <?php // Sidebar content to display at all times ?>

    <?php if (function_exists('dynamic_sidebar') && dynamic_sidebar('Sidebar Widgets')) : else : ?>

        <?php // All this stuff in here only shows up if you DON'T have any widgets active in this zone ?>

	<?php endif; ?>

</aside>