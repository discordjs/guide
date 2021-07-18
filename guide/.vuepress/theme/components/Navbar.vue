<template>
	<header ref="navbar" class="navbar">
		<div class="navbar-wrapper">
			<div class="navbar-links-wrapper">
				<div class="navbar-links-container">
					<span ref="siteBrand">
						<RouterLink :to="siteBrandLink">
							<img
								v-if="siteBrandLogo"
								class="logo"
								:src="withBase(siteBrandLogo)"
								:alt="siteBrandTitle"
							/>
							<span
								v-if="siteBrandTitle"
								class="site-name"
								:class="{ 'can-hide': siteBrandLogo }"
							>
								{{ siteBrandTitle }}
							</span>
						</RouterLink>
					</span>
					<slot name="before"></slot>
					<NavbarLinks class="can-hide" />
					<slot name="after"></slot>
				</div>
				<div class="navbar-links-container">
					<ToggleDarkModeButton v-if="enableDarkMode" />
					<NavbarSearch class="navbar-search" />
					<ToggleSidebarButton @toggle="$emit('toggle-sidebar')" />
				</div>
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouteLocale, useSiteLocaleData, withBase } from '@vuepress/client';
import { useThemeLocaleData } from '@vuepress/theme-default/lib/client/composables';
import NavbarLinks from '@vuepress/theme-default/lib/client/components/NavbarLinks.vue';
import ToggleDarkModeButton from '@vuepress/theme-default/lib/client/components/ToggleDarkModeButton.vue';
import ToggleSidebarButton from '@vuepress/theme-default/lib/client/components/ToggleSidebarButton.vue';

defineEmit(['toggle-sidebar']);

const routeLocale = useRouteLocale();
const siteLocale = useSiteLocaleData();
const themeLocale = useThemeLocaleData();

const navbar = ref<HTMLElement | null>(null);

const siteBrand = ref<HTMLElement | null>(null);
const siteBrandLink = computed(() => themeLocale.value.home || routeLocale.value);
const siteBrandLogo = computed(() => themeLocale.value.logo);
const siteBrandTitle = computed(() => siteLocale.value.title);

const enableDarkMode = computed(() => themeLocale.value.darkMode);
</script>
