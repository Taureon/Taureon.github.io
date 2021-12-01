window.onload=()=>{
	let title = document.getElementsByTagName("title")[0];
	let counter = 0;
	let p = document.getElementsByTagName("p")[0]
	setInterval(()=>{
		title.innerText = counter++;
		p.innerText = "Look at the browser tab's title!";
	}, 1000/3);//every third of a second
}