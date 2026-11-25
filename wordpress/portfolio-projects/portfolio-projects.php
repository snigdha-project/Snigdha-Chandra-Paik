<?php
/**
 * Plugin Name: Portfolio Projects
 * Description: Adds a "Projects" content type (with case studies) to the portfolio CMS and exposes it through WPGraphQL. Also exposes the Yoast SEO title/description for posts and projects.
 * Version: 1.0.0
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Author: Snigdha Chandra Paik
 * License: GPL-2.0-or-later
 *
 * Requires the WPGraphQL plugin. Yoast SEO is optional but recommended.
 *
 * How a project maps to the website:
 *   Title             -> project title
 *   Excerpt           -> short card description
 *   Content (editor)  -> case study HTML. Leave EMPTY if there is no case study
 *                        (then no /projects/<slug> page is generated).
 *   Featured image    -> project screenshot
 *   Order (page attr) -> lower number = shown first
 *   "Project details" -> category, tech, live URL, featured, accent colour
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const PP_META_KEYS = array(
	'category'  => 'pp_category',
	'tech'      => 'pp_tech',
	'link'      => 'pp_link',
	'featured'  => 'pp_featured',
	'color_key' => 'pp_color_key',
);

function pp_color_options() {
	// Keys must match src/data/colors.json in the website repo.
	return array(
		''             => 'Default',
		'webflow'      => 'Webflow',
		'wordpress'    => 'WordPress',
		'shopify'      => 'Shopify',
		'nextjs'       => 'Next.js',
		'n8n'          => 'n8n',
		'react_native' => 'React Native',
		'ai'           => 'AI',
	);
}

/* ------------------------------------------------------------------ */
/* Post type + meta                                                    */
/* ------------------------------------------------------------------ */
add_action( 'init', function () {
	register_post_type( 'project', array(
		'labels'              => array(
			'name'          => 'Projects',
			'singular_name' => 'Project',
			'add_new_item'  => 'Add New Project',
			'edit_item'     => 'Edit Project',
			'all_items'     => 'All Projects',
			'menu_name'     => 'Projects',
			'search_items'  => 'Search Projects',
			'not_found'     => 'No projects found.',
		),
		'public'              => true,
		'publicly_queryable'  => true,
		'show_in_rest'        => true,
		'rest_base'           => 'projects',
		'menu_icon'           => 'dashicons-portfolio',
		'menu_position'       => 5,
		'has_archive'         => false,
		'rewrite'             => array( 'slug' => 'projects' ),
		'supports'            => array( 'title', 'editor', 'excerpt', 'thumbnail', 'page-attributes', 'revisions', 'custom-fields' ),
		'show_in_graphql'     => true,
		'graphql_single_name' => 'project',
		'graphql_plural_name' => 'projects',
	) );

	$auth = function () {
		return current_user_can( 'edit_posts' );
	};

	foreach ( array( 'category', 'tech', 'color_key' ) as $field ) {
		register_post_meta( 'project', PP_META_KEYS[ $field ], array(
			'single'            => true,
			'type'              => 'string',
			'show_in_rest'      => true,
			'sanitize_callback' => 'sanitize_text_field',
			'auth_callback'     => $auth,
		) );
	}
	register_post_meta( 'project', PP_META_KEYS['link'], array(
		'single'            => true,
		'type'              => 'string',
		'show_in_rest'      => true,
		'sanitize_callback' => 'esc_url_raw',
		'auth_callback'     => $auth,
	) );
	register_post_meta( 'project', PP_META_KEYS['featured'], array(
		'single'            => true,
		'type'              => 'boolean',
		'show_in_rest'      => true,
		'sanitize_callback' => 'rest_sanitize_boolean',
		'auth_callback'     => $auth,
	) );

	// Yoast SEO title / description: make them writable over REST for posts + projects.
	foreach ( array( 'post', 'project' ) as $type ) {
		foreach ( array( '_yoast_wpseo_title', '_yoast_wpseo_metadesc' ) as $key ) {
			register_post_meta( $type, $key, array(
				'single'            => true,
				'type'              => 'string',
				'show_in_rest'      => true,
				'sanitize_callback' => 'sanitize_text_field',
				'auth_callback'     => $auth,
			) );
		}
	}
}, 20 );

/* ------------------------------------------------------------------ */
/* Meta box                                                            */
/* ------------------------------------------------------------------ */
add_action( 'add_meta_boxes', function () {
	add_meta_box( 'pp_details', 'Project details', 'pp_render_meta_box', 'project', 'normal', 'high' );
} );

function pp_render_meta_box( $post ) {
	wp_nonce_field( 'pp_save', 'pp_nonce' );
	$get = function ( $k ) use ( $post ) {
		return get_post_meta( $post->ID, PP_META_KEYS[ $k ], true );
	};
	?>
	<table class="form-table" role="presentation">
		<tr>
			<th><label for="pp_category">Category</label></th>
			<td><input type="text" class="regular-text" id="pp_category" name="pp_category" value="<?php echo esc_attr( $get( 'category' ) ); ?>" placeholder="SaaS / Automation"></td>
		</tr>
		<tr>
			<th><label for="pp_tech">Tech</label></th>
			<td><input type="text" class="large-text" id="pp_tech" name="pp_tech" value="<?php echo esc_attr( $get( 'tech' ) ); ?>" placeholder="Webflow, SEO, UI/UX"><p class="description">Comma separated.</p></td>
		</tr>
		<tr>
			<th><label for="pp_link">Live URL</label></th>
			<td><input type="url" class="large-text" id="pp_link" name="pp_link" value="<?php echo esc_attr( $get( 'link' ) ); ?>" placeholder="https://"></td>
		</tr>
		<tr>
			<th><label for="pp_color_key">Accent colour</label></th>
			<td>
				<select id="pp_color_key" name="pp_color_key">
					<?php foreach ( pp_color_options() as $value => $label ) : ?>
						<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $get( 'color_key' ), $value ); ?>><?php echo esc_html( $label ); ?></option>
					<?php endforeach; ?>
				</select>
			</td>
		</tr>
		<tr>
			<th>Featured</th>
			<td><label><input type="checkbox" name="pp_featured" value="1" <?php checked( (bool) $get( 'featured' ) ); ?>> Show on the home page</label></td>
		</tr>
	</table>
	<p class="description">Excerpt = card description. Editor content = case study (leave empty for no case-study page). Featured image = screenshot. Page attributes &rarr; Order controls sorting (lowest first). SEO title/description come from Yoast.</p>
	<?php
}

add_action( 'save_post_project', function ( $post_id ) {
	if ( ! isset( $_POST['pp_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['pp_nonce'] ) ), 'pp_save' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}
	foreach ( array( 'category', 'tech', 'color_key' ) as $field ) {
		$name = PP_META_KEYS[ $field ];
		update_post_meta( $post_id, $name, isset( $_POST[ $name ] ) ? sanitize_text_field( wp_unslash( $_POST[ $name ] ) ) : '' );
	}
	update_post_meta( $post_id, PP_META_KEYS['link'], isset( $_POST['pp_link'] ) ? esc_url_raw( wp_unslash( $_POST['pp_link'] ) ) : '' );
	update_post_meta( $post_id, PP_META_KEYS['featured'], ! empty( $_POST['pp_featured'] ) ? 1 : 0 );
} );

/* ------------------------------------------------------------------ */
/* WPGraphQL fields                                                    */
/* ------------------------------------------------------------------ */
add_action( 'graphql_register_types', function () {
	if ( ! function_exists( 'register_graphql_field' ) ) {
		return;
	}
	$meta = function ( $post, $key ) {
		return get_post_meta( $post->databaseId, $key, true );
	};

	register_graphql_field( 'Project', 'category', array(
		'type'    => 'String',
		'resolve' => function ( $post ) use ( $meta ) {
			return (string) $meta( $post, PP_META_KEYS['category'] );
		},
	) );
	register_graphql_field( 'Project', 'tech', array(
		'type'    => array( 'list_of' => 'String' ),
		'resolve' => function ( $post ) use ( $meta ) {
			$raw = (string) $meta( $post, PP_META_KEYS['tech'] );
			return array_values( array_filter( array_map( 'trim', explode( ',', $raw ) ), 'strlen' ) );
		},
	) );
	register_graphql_field( 'Project', 'link', array(
		'type'    => 'String',
		'resolve' => function ( $post ) use ( $meta ) {
			$v = (string) $meta( $post, PP_META_KEYS['link'] );
			return '' === $v ? null : $v;
		},
	) );
	register_graphql_field( 'Project', 'featured', array(
		'type'    => 'Boolean',
		'resolve' => function ( $post ) use ( $meta ) {
			return (bool) $meta( $post, PP_META_KEYS['featured'] );
		},
	) );
	register_graphql_field( 'Project', 'colorKey', array(
		'type'    => 'String',
		'resolve' => function ( $post ) use ( $meta ) {
			$v = (string) $meta( $post, PP_META_KEYS['color_key'] );
			return '' === $v ? null : $v;
		},
	) );

	// SEO overrides (Yoast keys) on both content types, independent of the
	// WPGraphQL-Yoast add-on.
	foreach ( array( 'Post', 'Project' ) as $type ) {
		register_graphql_field( $type, 'metaTitle', array(
			'type'    => 'String',
			'resolve' => function ( $post ) use ( $meta ) {
				$v = (string) $meta( $post, '_yoast_wpseo_title' );
				return '' === $v ? null : $v;
			},
		) );
		register_graphql_field( $type, 'metaDescription', array(
			'type'    => 'String',
			'resolve' => function ( $post ) use ( $meta ) {
				$v = (string) $meta( $post, '_yoast_wpseo_metadesc' );
				return '' === $v ? null : $v;
			},
		) );
	}
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
/* Sort projects by "Order" in the admin list                          */
/* ------------------------------------------------------------------ */
add_action( 'pre_get_posts', function ( $q ) {
	if ( is_admin() && $q->is_main_query() && 'project' === $q->get( 'post_type' ) && ! $q->get( 'orderby' ) ) {
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
	if ( ! in_array( $post->post_type, array( 'post', 'project' ), true ) ) {
		return;
	}
	if ( 'publish' !== $new && 'publish' !== $old ) {
		return;
	}
	wp_remote_post( PORTFOLIO_REVALIDATE_URL, array(
		'timeout'  => 5,
		'blocking' => false,
		'headers'  => array(
			'Content-Type'        => 'application/json',
			'x-revalidate-secret' => PORTFOLIO_REVALIDATE_SECRET,
		),
		'body'     => wp_json_encode( array( 'type' => $post->post_type, 'slug' => $post->post_name ) ),
	) );
}, 10, 3 );
