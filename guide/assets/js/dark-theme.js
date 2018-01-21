/* eslint-disable no-var */
document.addEventListener('DOMContentLoaded', function() {
	var $ = document.querySelector.bind(document);
	var darkTheme = localStorage.getItem('dark-theme');

	var icon = (!darkTheme) ? 'moon' : 'sun';
	var toggleThemeButton = '<button id="theme-toggle-button" class="sidebar-toggle">\
		<i class="icon icon-' + icon + '-o"></i>\
	</button>';

	$('.sidebar-toggle').innerHTML = '<i class="icon icon-bars"></i>';
	$('.sidebar-toggle').insertAdjacentHTML('afterend', toggleThemeButton);

	$('#theme-toggle-button').addEventListener('click', function(event) {
		event.stopPropagation();
		event.preventDefault();

		darkTheme = !darkTheme;
		document.body.classList.toggle('dark');

		var classes = $('#theme-toggle-button > i').classList;

		if (!darkTheme) {
			classes.remove('icon-sun-o');
			classes.add('icon-moon-o');
			return localStorage.removeItem('dark-theme');
		}

		classes.remove('icon-moon-o');
		classes.add('icon-sun-o');
		localStorage.setItem('dark-theme', true);
	});
});
