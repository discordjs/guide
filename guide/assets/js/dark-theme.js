/* eslint-disable no-var */
document.addEventListener('DOMContentLoaded', function() {
	var $ = document.querySelector.bind(document);
	var darkTheme = localStorage.getItem('dark-theme');

	var icon = (!darkTheme) ? 'moon' : 'sun';
	var toggleThemeButton = '<div id="theme-toggle-button"><i class="icon icon-' + icon + '-o"></i></div>';

	$('.sidebar-toggle').insertAdjacentHTML('beforeend', toggleThemeButton);

	$('#theme-toggle-button').addEventListener('click', function(event) {
		event.stopPropagation();
		event.preventDefault();

		darkTheme = !darkTheme;
		var stylesheet = $('#dark-theme-css');
		var classes = $('#theme-toggle-button > i').classList;

		if (!darkTheme) {
			classes.remove('icon-sun-o');
			classes.add('icon-moon-o');

			localStorage.removeItem('dark-theme');
			return stylesheet.setAttribute('disabled', '');
		}

		classes.remove('icon-moon-o');
		classes.add('icon-sun-o');

		localStorage.setItem('dark-theme', true);
		return stylesheet.removeAttribute('disabled');
	});
});
