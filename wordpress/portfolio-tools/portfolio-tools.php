<?php
/**
 * Plugin Name: Portfolio Tools
 * Description: Adds a "Tools" content type (calculators, image tools, custom embedded tools) to the portfolio CMS. Each tool is defined in WordPress, rendered by the Next.js site and exposed through WPGraphQL.
 * Version: 1.3.0
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Author: Snigdha Chandra Paik
 * License: GPL-2.0-or-later
 *
 * Requires the WPGraphQL plugin. Yoast SEO is optional but recommended.
 * Independent of the "Portfolio Projects" plugin: install either or both.
 *
 * Per tool:
 *   Title            -> tool name
 *   Excerpt          -> one-line description (cards + meta)
 *   Content (editor) -> article shown under the tool (how it works, tips)
 *   Featured image   -> optional preview image
 *   Order            -> lower number = shown first
 *   "Tool settings"  -> type, category, icon, settings (JSON), FAQ (JSON), embed code
 *
 * Tool types:
 *   calculator        inputs + formulas defined in the settings JSON
 *   image-compressor  built into the site; settings JSON tunes the defaults
 *   embed             your own HTML/CSS/JS, run in a sandboxed frame
 *   seo-audit         visitor pastes a link and gets an on-page SEO report
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const PTL_META = array(
	'type'     => 'pp_tool_type',
	'category' => 'pp_tool_category',
	'icon'     => 'pp_tool_icon',
	'config'   => 'pp_tool_config',
	'faq'      => 'pp_tool_faq',
	'code'     => 'pp_tool_code',
);

function ptl_type_options() {
	// Keys must be understood by src/components/tools/ToolRunner.tsx in the website repo.
	return array(
		'calculator'       => 'Calculator (inputs + formulas)',
		'image-compressor' => 'Image compressor (built in)',
		'embed'            => 'Custom embed (your own HTML / JS)',
		'seo-audit'        => 'SEO health report (built in)',
	);
}

function ptl_icon_options() {
	// Keys must be understood by src/components/tools/ToolIcon.tsx in the website repo.
	return array(
		'calculator'  => 'Calculator',
		'megaphone'   => 'Megaphone (ads)',
		'target'      => 'Target',
		'trending-up' => 'Trending up',
		'dollar'      => 'Money',
		'search'      => 'Search (SEO)',
		'share'       => 'Share (social)',
		'mail'        => 'Mail',
		'bar-chart'   => 'Bar chart',
		'users'       => 'Users',
		'globe'       => 'Globe',
		'zap'         => 'Zap',
		'image'       => 'Image',
		'code'        => 'Code',
		'file-text'   => 'Document / text',
	);
}

/** Starter settings for each tool type (shown by the "Insert starter" button). */
function ptl_starters() {
	return array(
		'calculator'       => array(
			'inputs'     => array(
				array( 'key' => 'budget', 'label' => 'Monthly budget', 'type' => 'number', 'default' => 50000, 'min' => 0, 'step' => 1000, 'prefix' => '{cur}', 'help' => 'What you plan to spend each month.' ),
				array( 'key' => 'cpc', 'label' => 'Cost per click', 'type' => 'number', 'default' => 25, 'min' => 0.01, 'step' => 0.5, 'prefix' => '{cur}' ),
				array( 'key' => 'cr', 'label' => 'Conversion rate', 'type' => 'number', 'default' => 3, 'min' => 0, 'max' => 100, 'step' => 0.1, 'suffix' => '%' ),
				array(
					'key'     => 'goal',
					'label'   => 'Goal',
					'type'    => 'select',
					'default' => 1,
					'options' => array(
						array( 'label' => 'Leads', 'value' => 1 ),
						array( 'label' => 'Sales', 'value' => 2 ),
					),
				),
			),
			'outputs'    => array(
				array( 'key' => 'clicks', 'label' => 'Clicks', 'formula' => 'budget / cpc', 'decimals' => 0 ),
				array( 'key' => 'conversions', 'label' => 'Conversions', 'formula' => 'clicks * cr / 100', 'decimals' => 1, 'highlight' => true ),
				array( 'key' => 'cpa', 'label' => 'Cost per conversion', 'formula' => 'if(conversions > 0, budget / conversions, 0)', 'decimals' => 0, 'prefix' => '{cur}' ),
			),
			'insights'   => array(
				array( 'when' => 'conversions < 1', 'text' => 'At this budget you would get less than one conversion a month. Raise the budget or improve the conversion rate.' ),
			),
			'disclaimer' => 'Estimates only. Real results depend on your market, creative and landing page.',
			'cta'        => array(
				'title'   => 'Need help with this?',
				'text'    => 'Tell me about your business and I will help you get there.',
				'button'  => 'Talk to me',
				'message' => 'I would like help with this.',
			),
		),
		'image-compressor' => array(
			'quality'       => 80,
			'format'        => 'webp',
			'maxWidth'      => 0,
			'maxFiles'      => 20,
			'maxFileSizeMB' => 25,
		),
		'seo-audit'        => array(
			'cta' => array(
				'title'   => 'Want these problems fixed?',
				'text'    => 'I will fix the issues in this report and help your website get found.',
				'button'  => 'Fix my SEO',
				'message' => 'I would like help fixing the SEO of my website.',
			),
		),
		'embed'            => array(
			'height'     => 520,
			'autoHeight' => true,
		),
	);
}

function ptl_starter_faq() {
	return array(
		array( 'q' => 'Is this tool free?', 'a' => 'Yes, it is free to use and runs in your browser.' ),
	);
}

function ptl_starter_embed_code() {
	return "<label for=\"t\">Type something</label>\n<textarea id=\"t\" rows=\"4\" style=\"width:100%\"></textarea>\n<p>Characters: <b id=\"n\">0</b></p>\n<script>\n  var t = document.getElementById('t'), n = document.getElementById('n');\n  t.addEventListener('input', function () { n.textContent = t.value.length; });\n</script>";
}

/* ------------------------------------------------------------------ */
/* Post type + meta                                                    */
/* ------------------------------------------------------------------ */
add_action( 'init', function () {
	register_post_type( 'tool', array(
		'labels'              => array(
			'name'          => 'Tools',
			'singular_name' => 'Tool',
			'add_new_item'  => 'Add New Tool',
			'edit_item'     => 'Edit Tool',
			'all_items'     => 'All Tools',
			'menu_name'     => 'Tools',
			'search_items'  => 'Search Tools',
			'not_found'     => 'No tools found.',
		),
		'public'              => true,
		'publicly_queryable'  => true,
		'show_in_rest'        => true,
		'rest_base'           => 'tools',
		'menu_icon'           => 'dashicons-admin-tools',
		'menu_position'       => 6,
		'has_archive'         => false,
		'rewrite'             => array( 'slug' => 'tools' ),
		'supports'            => array( 'title', 'editor', 'excerpt', 'thumbnail', 'page-attributes', 'revisions', 'custom-fields' ),
		'show_in_graphql'     => true,
		'graphql_single_name' => 'tool',
		'graphql_plural_name' => 'tools',
	) );

	$auth = function () {
		return current_user_can( 'edit_posts' );
	};

	// Keeps valid JSON byte-for-byte (sanitize_text_field would strip newlines);
	// invalid JSON is dropped instead of being stored.
	$json_only = function ( $value ) {
		$value = is_string( $value ) ? trim( $value ) : '';
		if ( '' === $value ) {
			return '';
		}
		json_decode( $value );
		return JSON_ERROR_NONE === json_last_error() ? $value : '';
	};

	$type_only = function ( $value ) {
		return array_key_exists( $value, ptl_type_options() ) ? $value : 'calculator';
	};

	// Raw HTML/JS for "embed" tools. Only users who may post unfiltered HTML
	// (administrators) can write it; everyone else's value is discarded.
	$raw_code = function ( $value ) {
		return ( is_string( $value ) && current_user_can( 'unfiltered_html' ) ) ? $value : '';
	};

	foreach ( array( 'category', 'icon' ) as $field ) {
		register_post_meta( 'tool', PTL_META[ $field ], array(
			'single'            => true,
			'type'              => 'string',
			'show_in_rest'      => true,
			'sanitize_callback' => 'sanitize_text_field',
			'auth_callback'     => $auth,
		) );
	}
	register_post_meta( 'tool', PTL_META['type'], array(
		'single'            => true,
		'type'              => 'string',
		'show_in_rest'      => true,
		'sanitize_callback' => $type_only,
		'auth_callback'     => $auth,
	) );
	foreach ( array( 'config', 'faq' ) as $field ) {
		register_post_meta( 'tool', PTL_META[ $field ], array(
			'single'            => true,
			'type'              => 'string',
			'show_in_rest'      => true,
			'sanitize_callback' => $json_only,
			'auth_callback'     => $auth,
		) );
	}
	register_post_meta( 'tool', PTL_META['code'], array(
		'single'            => true,
		'type'              => 'string',
		'show_in_rest'      => true,
		'sanitize_callback' => $raw_code,
		'auth_callback'     => function () {
			return current_user_can( 'unfiltered_html' );
		},
	) );

	// Yoast title / description writable over REST for tools too.
	foreach ( array( '_yoast_wpseo_title', '_yoast_wpseo_metadesc' ) as $key ) {
		register_post_meta( 'tool', $key, array(
			'single'            => true,
			'type'              => 'string',
			'show_in_rest'      => true,
			'sanitize_callback' => 'sanitize_text_field',
			'auth_callback'     => $auth,
		) );
	}
}, 20 );

/* ------------------------------------------------------------------ */
/* Meta box                                                            */
/* ------------------------------------------------------------------ */
add_action( 'add_meta_boxes', function () {
	add_meta_box( 'ptl_settings', 'Tool settings', 'ptl_render_box', 'tool', 'normal', 'high' );
} );

function ptl_render_box( $post ) {
	wp_nonce_field( 'ptl_save', 'ptl_nonce' );
	$get = function ( $k ) use ( $post ) {
		return (string) get_post_meta( $post->ID, PTL_META[ $k ], true );
	};
	$type     = $get( 'type' ) ?: 'calculator';
	$starters = array();
	foreach ( ptl_starters() as $t => $cfg ) {
		$starters[ $t ] = wp_json_encode( $cfg, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
	}
	$starter_faq = wp_json_encode( ptl_starter_faq(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
	$can_code    = current_user_can( 'unfiltered_html' );
	?>
	<style>
		#ptl_settings .ptl-row[hidden] { display: none; }
		#ptl_settings textarea.code { font-family: Consolas, Monaco, monospace; font-size: 12.5px; }
	</style>
	<table class="form-table" role="presentation">
		<tr>
			<th><label for="pp_tool_type">Tool type</label></th>
			<td>
				<select id="pp_tool_type" name="pp_tool_type">
					<?php foreach ( ptl_type_options() as $value => $label ) : ?>
						<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $type, $value ); ?>><?php echo esc_html( $label ); ?></option>
					<?php endforeach; ?>
				</select>
			</td>
		</tr>
		<tr>
			<th><label for="pp_tool_category">Category</label></th>
			<td><input type="text" class="regular-text" id="pp_tool_category" name="pp_tool_category" value="<?php echo esc_attr( $get( 'category' ) ); ?>" placeholder="Advertising"></td>
		</tr>
		<tr>
			<th><label for="pp_tool_icon">Icon</label></th>
			<td>
				<select id="pp_tool_icon" name="pp_tool_icon">
					<?php foreach ( ptl_icon_options() as $value => $label ) : ?>
						<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $get( 'icon' ), $value ); ?>><?php echo esc_html( $label ); ?></option>
					<?php endforeach; ?>
				</select>
			</td>
		</tr>
		<tr class="ptl-row" data-ptl-types="embed">
			<th><label for="pp_tool_code">Embed code</label></th>
			<td>
				<?php if ( $can_code ) : ?>
					<textarea id="pp_tool_code" name="pp_tool_code" class="large-text code" rows="18" spellcheck="false"><?php echo esc_textarea( $get( 'code' ) ); ?></textarea>
					<p><button type="button" class="button" id="ptl_starter_code">Insert starter code</button></p>
					<p class="description">Your own HTML, CSS and JavaScript. It runs inside a sandboxed frame on the site (no access to the page, cookies or storage), so it is safe to experiment. The frame has a transparent background and white text by default; add your own styles to change that. No external scripts are blocked, so you can load libraries from a CDN.</p>
				<?php else : ?>
					<p class="description">Only administrators can edit embed code.</p>
				<?php endif; ?>
			</td>
		</tr>
		<tr class="ptl-row" data-ptl-types="calculator image-compressor embed seo-audit">
			<th><label for="pp_tool_config">Settings (JSON)</label></th>
			<td>
				<textarea id="pp_tool_config" name="pp_tool_config" class="large-text code" rows="16" spellcheck="false"><?php echo esc_textarea( $get( 'config' ) ); ?></textarea>
				<p><button type="button" class="button" id="ptl_starter_config">Insert starter settings</button></p>
				<div class="description ptl-help" data-ptl-types="calculator">
					<strong>inputs</strong>: <code>key</code> (letters, digits, _), <code>label</code>, <code>type</code> (<code>number</code> | <code>select</code>), <code>default</code>, optional <code>min</code>, <code>max</code>, <code>step</code>, <code>prefix</code>, <code>suffix</code>, <code>help</code>; selects use <code>options</code>: [{"label","value"}].<br>
					<strong>outputs</strong> (calculated top to bottom; may use inputs and earlier outputs): <code>key</code>, <code>label</code>, <code>formula</code>, optional <code>decimals</code>, <code>prefix</code>, <code>suffix</code>, <code>highlight</code> (true = big card), <code>help</code>.<br>
					<strong>insights</strong> (optional): [{"when": "roi &lt; 0", "text": "…"}] shown when the condition is true. <strong>disclaimer</strong> (optional).<br>
					<strong>currency</strong> (optional): {"default": "INR", "options": ["INR", "USD", "GBP", "EUR", "AED", "AUD", "CAD", "SGD"]} adds a currency picker. Write amounts in the default currency and use <code>{cur}</code> for the symbol, e.g. <code>"prefix": "{cur}"</code>. Switching converts the visitor's amounts at approximate rates.<br>
					<strong>cta</strong> (optional): {"title", "text", "button", "message"} is the card under the results. The button opens the contact form prefilled with the visitor's numbers and <code>message</code> (use <code>{tool}</code> for the tool name).<br>
					Formulas support <code>+ - * / % ^</code>, comparisons, <code>&amp;&amp; || !</code>, and <code>min max round floor ceil abs sqrt pow log if(cond, a, b)</code>.
				</div>
				<div class="description ptl-help" data-ptl-types="image-compressor">
					All optional: <code>quality</code> (10-100, default 80), <code>format</code> (<code>webp</code> | <code>jpeg</code>), <code>maxWidth</code> (pixels, 0 = keep size), <code>maxFiles</code> (default 20), <code>maxFileSizeMB</code> (default 25). Images are processed in the visitor's browser and never uploaded.
				</div>
				<div class="description ptl-help" data-ptl-types="seo-audit">
					All optional: <code>cta</code> {"title", "text", "button", "message"} is the card under the report (the button opens the contact form with the website, score and problems filled in) and <code>disclaimer</code>.
				</div>
				<div class="description ptl-help" data-ptl-types="embed">
					Optional: <code>height</code> (pixels, default 520) and <code>autoHeight</code> (true = the frame grows with your content).
				</div>
			</td>
		</tr>
		<tr>
			<th><label for="pp_tool_faq">FAQ (JSON)</label></th>
			<td>
				<textarea id="pp_tool_faq" name="pp_tool_faq" class="large-text code" rows="8" spellcheck="false"><?php echo esc_textarea( $get( 'faq' ) ); ?></textarea>
				<p><button type="button" class="button" id="ptl_starter_faq">Insert starter FAQ</button></p>
				<p class="description">A list like [{"q": "Question?", "a": "Answer."}]. Also used for FAQ rich results in Google.</p>
			</td>
		</tr>
	</table>
	<script>
		(function () {
			var starters = <?php echo wp_json_encode( $starters ); ?>;
			var faq = <?php echo wp_json_encode( $starter_faq ); ?>;
			var code = <?php echo wp_json_encode( ptl_starter_embed_code() ); ?>;
			var typeSel = document.getElementById('pp_tool_type');

			function applyType() {
				var t = typeSel.value;
				document.querySelectorAll('#ptl_settings [data-ptl-types]').forEach(function (el) {
					el.hidden = el.getAttribute('data-ptl-types').split(' ').indexOf(t) === -1;
				});
			}
			function bind(btn, getValue, field) {
				var b = document.getElementById(btn), f = document.getElementById(field);
				if (!b || !f) return;
				b.addEventListener('click', function () {
					if (f.value.trim() && !window.confirm('Replace the current content?')) return;
					f.value = getValue();
				});
			}
			bind('ptl_starter_config', function () { return starters[typeSel.value] || ''; }, 'pp_tool_config');
			bind('ptl_starter_faq', function () { return faq; }, 'pp_tool_faq');
			bind('ptl_starter_code', function () { return code; }, 'pp_tool_code');
			typeSel.addEventListener('change', applyType);
			applyType();
		})();
	</script>
	<?php
}

/** Returns normalised JSON, '' when empty, or null when the text is not valid JSON. */
function ptl_clean_json( $raw ) {
	$raw = trim( (string) $raw );
	if ( '' === $raw ) {
		return '';
	}
	$decoded = json_decode( $raw, true );
	if ( JSON_ERROR_NONE !== json_last_error() ) {
		return null;
	}
	return wp_json_encode( $decoded, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
}

add_action( 'save_post_tool', function ( $post_id ) {
	if ( ! isset( $_POST['ptl_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['ptl_nonce'] ) ), 'ptl_save' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	foreach ( array( 'category', 'icon' ) as $field ) {
		$name = PTL_META[ $field ];
		update_post_meta( $post_id, $name, isset( $_POST[ $name ] ) ? sanitize_text_field( wp_unslash( $_POST[ $name ] ) ) : '' );
	}
	$type = isset( $_POST[ PTL_META['type'] ] ) ? sanitize_text_field( wp_unslash( $_POST[ PTL_META['type'] ] ) ) : 'calculator';
	update_post_meta( $post_id, PTL_META['type'], array_key_exists( $type, ptl_type_options() ) ? $type : 'calculator' );

	// Raw embed code: administrators only.
	if ( current_user_can( 'unfiltered_html' ) && isset( $_POST[ PTL_META['code'] ] ) ) {
		// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- intentionally raw; capability-gated above
		update_post_meta( $post_id, PTL_META['code'], wp_slash( wp_unslash( $_POST[ PTL_META['code'] ] ) ) );
	}

	$errors = array();
	foreach ( array( 'config' => 'Settings', 'faq' => 'FAQ' ) as $field => $label ) {
		$name = PTL_META[ $field ];
		if ( ! isset( $_POST[ $name ] ) ) {
			continue;
		}
		// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- validated as JSON below
		$clean = ptl_clean_json( wp_unslash( $_POST[ $name ] ) );
		if ( null === $clean ) {
			$errors[] = $label;
			continue; // keep the previously saved, valid value
		}
		update_post_meta( $post_id, $name, wp_slash( $clean ) );
	}
	if ( $errors ) {
		set_transient( 'ptl_error_' . get_current_user_id(), implode( ' and ', $errors ), 60 );
	}
} );

add_action( 'admin_notices', function () {
	$key = 'ptl_error_' . get_current_user_id();
	$msg = get_transient( $key );
	if ( $msg ) {
		delete_transient( $key );
		echo '<div class="notice notice-error"><p><strong>' . esc_html( $msg ) . ' was not saved:</strong> it is not valid JSON. The previous value was kept. Check commas and quotes.</p></div>';
	}
} );

/* ------------------------------------------------------------------ */
/* WPGraphQL fields                                                    */
/* ------------------------------------------------------------------ */
add_action( 'graphql_register_types', function () {
	if ( ! function_exists( 'register_graphql_field' ) ) {
		return;
	}
	$meta = function ( $post, $key ) {
		return (string) get_post_meta( $post->databaseId, $key, true );
	};

	foreach ( array( 'category', 'icon', 'config', 'faq', 'code' ) as $field ) {
		register_graphql_field( 'Tool', $field, array(
			'type'    => 'String',
			'resolve' => function ( $post ) use ( $meta, $field ) {
				$v = $meta( $post, PTL_META[ $field ] );
				return '' === $v ? null : $v;
			},
		) );
	}
	// "type" is a reserved-looking name in some GraphQL clients, so expose it as toolType.
	register_graphql_field( 'Tool', 'toolType', array(
		'type'    => 'String',
		'resolve' => function ( $post ) use ( $meta ) {
			$v = $meta( $post, PTL_META['type'] );
			return '' === $v ? 'calculator' : $v;
		},
	) );

	register_graphql_field( 'Tool', 'metaTitle', array(
		'type'    => 'String',
		'resolve' => function ( $post ) use ( $meta ) {
			$v = $meta( $post, '_yoast_wpseo_title' );
			return '' === $v ? null : $v;
		},
	) );
	register_graphql_field( 'Tool', 'metaDescription', array(
		'type'    => 'String',
		'resolve' => function ( $post ) use ( $meta ) {
			$v = $meta( $post, '_yoast_wpseo_metadesc' );
			return '' === $v ? null : $v;
		},
	) );
} );

/* ------------------------------------------------------------------ */
/* Keep text byte-exact in API responses (no curly quotes / dashes)    */
/* ------------------------------------------------------------------ */
add_action( 'init', function () {
	if ( ! function_exists( 'is_graphql_http_request' ) || ! is_graphql_http_request() ) {
		return;
	}
	foreach ( array( 'the_title', 'the_content', 'the_excerpt' ) as $hook ) {
		remove_filter( $hook, 'wptexturize' );
	}
}, 99 );

/* ------------------------------------------------------------------ */
/* Sort tools by "Order" in the admin list                             */
/* ------------------------------------------------------------------ */
add_action( 'pre_get_posts', function ( $q ) {
	if ( is_admin() && $q->is_main_query() && 'tool' === $q->get( 'post_type' ) && ! $q->get( 'orderby' ) ) {
		$q->set( 'orderby', 'menu_order title' );
		$q->set( 'order', 'ASC' );
	}
} );

/* ------------------------------------------------------------------ */
/* Tell the Next.js site to refresh (optional)                         */
/* Add to wp-config.php:                                               */
/*   define( 'PORTFOLIO_REVALIDATE_URL', 'https://YOUR-SITE/api/revalidate' ); */
/*   define( 'PORTFOLIO_REVALIDATE_SECRET', 'same value as REVALIDATE_SECRET in the site env' ); */
/* ------------------------------------------------------------------ */
add_action( 'transition_post_status', function ( $new, $old, $post ) {
	if ( ! defined( 'PORTFOLIO_REVALIDATE_URL' ) || ! defined( 'PORTFOLIO_REVALIDATE_SECRET' ) ) {
		return;
	}
	if ( 'tool' !== $post->post_type || ( 'publish' !== $new && 'publish' !== $old ) ) {
		return;
	}
	wp_remote_post( PORTFOLIO_REVALIDATE_URL, array(
		'timeout'  => 5,
		'blocking' => false,
		'headers'  => array(
			'Content-Type'        => 'application/json',
			'x-revalidate-secret' => PORTFOLIO_REVALIDATE_SECRET,
		),
		'body'     => wp_json_encode( array( 'type' => 'tool', 'slug' => $post->post_name ) ),
	) );
}, 10, 3 );
