// Initialize picture carousel
$(document).ready(function() {
	$('.carousel').carousel();
});

// Add gradual glow effect to nav links upon mouseover
var navLinks = Array.from(document.getElementsByClassName("nav-link"));
for (var i = 0; i < navLinks.length; i++) {
	var current = navLinks[i];
	current.addEventListener("mouseover", glowOn);
	current.addEventListener("mouseout", glowOff);
}

function glowOn() {
	this.style = "text-shadow: 0px 0px 5px #DBDAD7; transition-duration: 0.5s;";
}

function glowOff() {
	this.style = "text-shadow: 0px 0px 0px; transition-duration: 0.25s;";
}