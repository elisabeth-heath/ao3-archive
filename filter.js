
        function applyFilters() {
            const filters = {
                rating: document.getElementById('filter-rating').value,
                fandom: document.getElementById('filter-fandom').value,
                'archive-warning': document.getElementById('filter-archive-warning').value,
                category: document.getElementById('filter-category').value,
                tags: document.getElementById('filter-tags').value.toLowerCase(),
                words_min: parseInt(document.getElementById('filter-words-min').value, 10) || 0,
                words_max: parseInt(document.getElementById('filter-words-max').value, 10) || Infinity
            };

            const works = document.querySelectorAll('.work-entry');
            works.forEach(work => {
                let isVisible = true;
                
                // Check dropdowns
                if (filters.rating && work.dataset.rating !== filters.rating) isVisible = false;
                if (filters.fandom && !work.dataset.fandoms?.includes(filters.fandom)) isVisible = false;
                if (filters['archive-warning'] && !work.dataset.archiveWarnings?.includes(filters['archive-warning'])) isVisible = false;
                if (filters.category && !work.dataset.categories?.includes(filters.category)) isVisible = false;
                
                // Check free text tags
                if (filters.tags) {
                    const workTags = (work.dataset.additionalTags || '').toLowerCase();
                    const filterTags = filters.tags.split(',').map(t => t.trim()).filter(t => t);
                    if (!filterTags.every(tag => workTags.includes(tag))) {
                        isVisible = false;
                    }
                }
                
                // Check word count
                const wordCount = parseInt(work.dataset.words, 10);
                if (isNaN(wordCount)) { // Handle cases where word count might be missing
                    if (filters.words_min > 0 || filters.words_max !== Infinity) isVisible = false;
                } else if (wordCount < filters.words_min || wordCount > filters.words_max) {
                    isVisible = false;
                }

                work.style.display = isVisible ? 'block' : 'none';
            });
        }

        function resetFilters() {
            document.querySelectorAll('#filter-sidebar select, #filter-sidebar input').forEach(input => input.value = '');
            applyFilters();
        }
        