<template>
	<header class="navbar">
		<div class="navbar-wrapper">
			<div class="navbar-links-wrapper">
				<div class="navbar-links-container">
					<span class="navbar-links-home">
						<RouterLink :to="siteBrandLink">
							{{ siteBrandTitle }}
						</RouterLink>
					</span>
					<slot name="before"></slot>
					<NavbarLinks class="can-hide" />
					<slot name="after"></slot>
				</div>
				<div class="navbar-links-container">
					<ToggleDarkModeButton />
					<NavbarSearch class="navbar-search" />
					<ToggleSidebarButton @toggle="$emit('toggle-sidebar')" />
				</div>
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouteLocale, useSiteLocaleData } from '@vuepress/client';
import { useThemeLocaleData } from '@vuepress/theme-default/lib/client/composables';
import NavbarLinks from '@vuepress/theme-default/lib/client/components/NavbarLinks.vue';
import ToggleDarkModeButton from './ToggleDarkModeButton.vue';
import ToggleSidebarButton from './ToggleSidebarButton.vue';

defineEmits(['toggle-sidebar']);

const routeLocale = useRouteLocale();
const siteLocale = useSiteLocaleData();
const themeLocale = useThemeLocaleData();

const siteBrandLink = computed(() => themeLocale.value.home || routeLocale.value);
const siteBrandTitle = computed(() => siteLocale.value.title);
</script>
