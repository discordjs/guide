<template>
	<aside class="sidebar">
		<NavbarLinks />
		<slot name="top"></slot>
		<ul class="sidebar-links">
			<UserSettings />
			<SidebarChild
				v-for="item in sidebarItems"
				:key="item.link || item.text"
				:item="item"
			/>
		</ul>
		<slot name="bottom"></slot>
	</aside>
</template>

<script setup lang="ts">
import { useSidebarItems } from '@vuepress/theme-default/lib/client/composables';
import NavbarLinks from '@vuepress/theme-default/lib/client/components/NavbarLinks.vue';
import { SidebarChild } from '@vuepress/theme-default/lib/client/components/SidebarChild';
import UserSettings from './UserSettings.vue';

const sidebarItems = useSidebarItems();
</script>
