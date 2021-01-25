<template>
	<router-link :to="$localePath" class="guide-logo">
		<span class="site-name">
			<span class="site-name-text">
				Discord<span class="site-name-dot">.</span><span class="site-name-js">js</span> Guide
			</span>
		</span>
	</router-link>
</template>

<style lang="stylus">
.guide-logo .site-name {
	background: url('/book-small.png') top left / contain no-repeat;
	padding-left: 1.5em;
	max-height: 100%;
	display: flex;
	align-items: center;
	font-size: 2rem;

	@media screen and (max-width: $MQMobile) {
		overflow: unset;
	}

	@media screen and (max-width: 600px) {
		text-indent: -9999px;
		padding-left: 0;
	}

	.site-name-text {
		line-height: 100%;

		.site-name-dot {
			color: darken(#3eaf7c, 30%);
		}

		.site-name-js {
			color: #3eaf7c;
		}
	}
}

.yuu-theme-red {
	.guide-logo .site-name {
		background-image: url('/book-red-small.png');

		.site-name-text {
			.site-name-dot {
				color: darken(#de3636, 30%);
			}

			.site-name-js {
				color: #de3636;
			}
		}
	}
}

.yuu-theme-blue {
	.guide-logo .site-name {
		background-image: url('/book-blue-small.png');

		.site-name-text {
			.site-name-dot {
				color: darken(#2196f3, 30%);
			}

			.site-name-js {
				color: #2196f3;
			}
		}
	}
}

.yuu-theme-purple {
	.guide-logo .site-name {
		background-image: url('/book-purple-small.png');

		.site-name-text {
			.site-name-dot {
				color: darken(#a846eb, 30%);
			}

			.site-name-js {
				color: #a846eb;
			}
		}
	}
}
</style>
