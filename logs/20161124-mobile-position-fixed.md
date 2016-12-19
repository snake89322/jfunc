###mobile-position-fixed.md
<style>
	.head,
	.foot {
		position: fixed;
		left: 0;
		height: 38px;
		line-height: 38px;
		width: 100%;
		background-color: #99CC00;
	}
	
	.head {
		top: 0;
	}
	
	.foot {
		bottom: 0;
	}
	
	.main {
		position: fixed;
		top: 38px;
		bottom: 38px;
		width: 100%;
		overflow: scroll;
		background-color: #BABABA;
	}
</style>
<script>
	function toParent(target) {
		if (target.id == 'middle') return true;
		if (target.tagName == 'BODY') return false;
		return toParent(target.parentNode);
	}
	document.addEventListener('touchmove', function(event) { 
		if ( !toParent(event.target) ) event.preventDefault(); 
	}, false);
</script>