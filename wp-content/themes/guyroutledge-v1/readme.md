# Read Me Please

The following is a set of guidelines and best practices for developing awesome websites that are efficient, scalable, easy to maintain, easy to read and easy to collaborate on.

## Naming Convention

### General

* hyphenated class names for CSS/HTML
* camelcase for JS/jQuery
* underscores for PHP

### CSS

Group classes (and image assets) by prefixing with the type

* icon-twitter, icon-pdf, icon-home
* share, share-icons, share-facebook, share-pinterest
* fancybox-photo, fancybox-terms, fancybox-video
* logo, logo-main, logo-small
* bg-body, bg-container, bg-torn-paper

#### Modules Class Names

	.imgblock { }
	.nav  { }
	.section-title { }
	.button { }

##### Layout Modifier Class Names

Use layout modifier classes to change the typical styling of a module or layout

	.l-stacked { }
	.l-flipped { }

###### Example:

	// Modify an inline list of links to display stacked vertically
	.nav {
		li { display:inline; }
		&.stacked {
			li { display:block; }
		}
	}

#### State Class Names

	.is-collapsed { height:0; }
	.is-visible { display:block; }
	.is-error { color:red; font-weight:bold; }
	.is-successful { color:green; }
	.is-flush { margin-left:0; }

#### Skin Class Names

Instead of cluttering skin classes with an 's-' prefix, use semantically clear class names that describe the purpose of the skin (rather than the presentation of the skin)

	.light { background:#eee; }
	.brand-color { color: $color-brand; }
	.no-bullets { list-style:none; }
	.cta { // big ole button styles here }

###### Example:

	// Modify a button module with a skin, layout and state

	<section class="intro">
		<h2 class="callout">Want to know more?</h2>
		<a class="button cta is-visible span-30" href="#">Yes! Tell me more...</a>
	</section>
	<section class="is-collapsed"></section>

	.button {
		display:block;
		padding:5px 10px;
		background:$color-button;
		color:#fff;
		border:$color-border;
		@include border-radius(10px);
	}
	.cta {
		color:$color-brand;
		font-weight:bold;
		@include box-shadow(5px, 5px, 5px, rgba(0,0,0,0.5));
	}
	.span-30 { width:30%; }


#### JS



#### PHP




### HTML

Semantic HTML should describe the content rather than describe the design.

* HTML5
* attributes in "double quotes"
* no self-closing tags; <br> rather than <br />
* closing tags even where they are not required for validity: <p></p> and <li></li>


### CSS

#### Syntax:

* multi-line CSS
* properties organised by importance: position > box-model > typography > skin > other
* single space between selector and opening curly-brace
* no space between property, colon and value

#### Best Practices

* don't use ID's for styling - they cause sepificity nightmares and aren't reusable (do use as JS hooks)
* avoid over qualified selectors .about-page doesn't need to be written body.about-page
* avoid location dependent styles 'main-content article .promo' cannot be reused in an aside but '.promo' could be
* create modules than can be re-used through a site, in any location
* (SCSS) variables for colors, fonts, and skin (eg. border, background-colors)
* (SCSS) don't nest styles too deep as this can cause specificity issues

### JavaScript



### PHP, Wordpress & Backend

