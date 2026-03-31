// Add your NASA API key here
const API_KEY = '3gpq3w48qWRhgQ4zuF4wDmhPNOudIYuccOsfZhxR';
const APOD_BASE_URL = 'https://api.nasa.gov/planetary/apod';

const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const fetchButton = document.querySelector('.filters button');
const gallery = document.getElementById('gallery');
const detailsModal = document.getElementById('detailsModal');
const modalCloseButton = document.getElementById('modalClose');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalStory = document.getElementById('modalStory');
const modalSource = document.getElementById('modalSource');

let currentGalleryItems = [];

setupDateInputs(startInput, endInput);

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayString = yesterday.toISOString().split('T')[0];

startInput.value = yesterdayString;
endInput.value = yesterdayString;

fetchImages();

fetchButton.addEventListener('click', fetchImages);
gallery.addEventListener('click', handleGalleryClick);
modalCloseButton.addEventListener('click', closeModal);

detailsModal.addEventListener('click', (event) => {
	if (event.target === detailsModal) {
		closeModal();
	}
});

document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape') {
		closeModal();
	}
});

async function fetchImages() {
	const startDate = startInput.value;
	const endDate = endInput.value;

	if (!startDate || !endDate) {
		renderMessage('Please select both a start and end date.');
		return;
	}

	if (startDate > endDate) {
		renderMessage('Start date cannot be after end date.');
		return;
	}

	if (API_KEY === 'YOUR_NASA_API_KEY_HERE') {
		renderMessage('Add your NASA API key in script.js before fetching images.');
		return;
	}

	renderMessage('Loading space images...');

	try {
		const url = `${APOD_BASE_URL}?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}&thumbs=true`;
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`NASA API returned status ${response.status}`);
		}

		const data = await response.json();
		const apodItems = Array.isArray(data) ? data : [data];
		const imageItems = apodItems.filter((item) => item.media_type === 'image');

		if (imageItems.length === 0) {
			renderMessage('No images found for that date range. Try another range.');
			currentGalleryItems = [];
			return;
		}

		currentGalleryItems = imageItems.reverse();
		renderGallery(currentGalleryItems);
	} catch (error) {
		renderMessage('Unable to load images right now. Please try again.');
		currentGalleryItems = [];
		console.error(error);
	}
}

function renderGallery(items) {
	gallery.innerHTML = items
		.map(
			(item, index) => `
			<article class="gallery-item">
				<img src="${item.url}" alt="${escapeHtml(item.title)}" />
				<p class="gallery-title"><strong>${escapeHtml(item.title)}</strong></p>
				<p class="gallery-date">${escapeHtml(item.date)}</p>
				<button class="details-button" data-index="${index}">Details</button>
			</article>
		`
		)
		.join('');
}

function handleGalleryClick(event) {
	const detailsButton = event.target.closest('.details-button');

	if (!detailsButton) {
		return;
	}

	const itemIndex = Number(detailsButton.dataset.index);
	const item = currentGalleryItems[itemIndex];

	if (!item) {
		return;
	}

	openModal(item);
}

function openModal(item) {
	const { story, source } = splitStoryAndSource(item);

	modalImage.src = item.hdurl || item.url;
	modalImage.alt = item.title;
	modalTitle.textContent = item.title;
	modalDate.textContent = item.date;
	modalStory.textContent = story;

	if (source) {
		modalSource.textContent = `Source: ${source}`;
		modalSource.style.display = 'block';
	} else {
		modalSource.textContent = '';
		modalSource.style.display = 'none';
	}

	detailsModal.classList.add('is-open');
	detailsModal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
	detailsModal.classList.remove('is-open');
	detailsModal.setAttribute('aria-hidden', 'true');
}

function renderMessage(message) {
	gallery.innerHTML = `
		<div class="placeholder">
			<div class="placeholder-icon">🔭</div>
			<p>${escapeHtml(message)}</p>
		</div>
	`;
}

function escapeHtml(text) {
	const map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};

	return String(text).replace(/[&<>"']/g, (char) => map[char]);
}

function splitStoryAndSource(item) {
	const explanation = String(item.explanation || '').trim();
	const sourcePattern = /(?:\s|\n)*(?:image\s+credit|image\s+credits|credit|source)\s*[:\-]\s*(.+)$/i;
	const match = explanation.match(sourcePattern);

	if (match) {
		return {
			story: explanation.replace(sourcePattern, '').trim(),
			source: match[1].trim()
		};
	}

	if (item.copyright) {
		return {
			story: explanation,
			source: String(item.copyright).trim()
		};
	}

	return {
		story: explanation,
		source: 'NASA APOD'
	};
}
