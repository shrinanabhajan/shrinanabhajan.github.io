document.addEventListener("DOMContentLoaded", function() {
			// Number of images in the directory
			const totalImages = 321;
			
			// Generate a random number between 1 and the total number of images
			const randomIndex = Math.floor(Math.random() * totalImages) + 1;
			
			// Construct the image filename based on the random index
			const imagePath = `nv/${randomIndex}.jpg`;
			
			// Update the src attribute of the img element to display the random image
			document.getElementById("av").src = imagePath;
		});