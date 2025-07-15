function applyFiltersAndSort() {
            const filters = {
                rating: document.getElementById('filter-rating').value,
                fandom: document.getElementById('filter-fandom').value,
                'archive-warning': document.getElementById('filter-archive-warning').value,
                category: document.getElementById('filter-category').value,
                tags: document.getElementById('filter-tags').value.toLowerCase(),
                words_min: parseInt(document.getElementById('filter-words-min').value, 10) || 0,
                words_max: parseInt(document.getElementById('filter-words-max').value, 10) || Infinity
            };
            
            const sortBy = document.getElementById('sort-by').value;
            const sortOrder = document.getElementById('sort-order').value;

            const workList = document.querySelector('.work-list');
            let works = Array.from(workList.querySelectorAll('.work-entry'));

            // 1. Filter the works
            let visibleWorks = works.filter(work => {
                let isVisible = true;
                if (filters.rating && work.dataset.rating !== filters.rating) isVisible = false;
                if (filters.fandom && !work.dataset.fandoms?.includes(filters.fandom)) isVisible = false;
                if (filters['archive-warning'] && !work.dataset.archiveWarnings?.includes(filters['archive-warning'])) isVisible = false;
                if (filters.category && !work.dataset.categories?.includes(filters.category)) isVisible = false;
                if (filters.tags) {
                    const workTags = (work.dataset.additionalTags || '').toLowerCase();
                    const filterTags = filters.tags.split(',').map(t => t.trim()).filter(t => t);
                    if (!filterTags.every(tag => workTags.includes(tag))) isVisible = false;
                }
                const wordCount = parseInt(work.dataset.words, 10);
                if (!isNaN(wordCount)) {
                     if (wordCount < filters.words_min || wordCount > filters.words_max) isVisible = false;
                } else if (filters.words_min > 0 || filters.words_max !== Infinity) {
                    isVisible = false;
                }
                
                // Show/hide immediately for responsiveness
                work.style.display = isVisible ? 'block' : 'none';
                return isVisible;
            });

            // 2. Sort the *visible* works
            if (sortBy !== 'default') {
                visibleWorks.sort((a, b) => {
                    const valA = parseInt(a.dataset[sortBy]?.replace(/,/g, ''), 10) || 0;
                    const valB = parseInt(b.dataset[sortBy]?.replace(/,/g, ''), 10) || 0;
                    return sortOrder === 'asc' ? valA - valB : valB - valA;
                });
            }

            // 3. Re-append sorted works to the DOM
            visibleWorks.forEach(work => workList.appendChild(work));
        }

        function resetFilters() {
            document.querySelectorAll('#filter-sidebar select, #filter-sidebar input').forEach(input => input.value = '');
            applyFiltersAndSort();
        }

        function setupPopularTags() {
            const header = document.querySelector('.popular-tags-header');
            const container = document.querySelector('.popular-tags');
            header.addEventListener('click', () => {
                header.parentElement.classList.toggle('collapsed');
                container.style.display = container.style.display === 'none' ? 'flex' : 'none';
            });
            
            document.querySelectorAll('.popular-tag').forEach(tag => {
                tag.addEventListener('click', () => {
                    const tagsInput = document.getElementById('filter-tags');
                    const currentTags = tagsInput.value.split(',').map(t => t.trim()).filter(t => t);
                    const newTag = tag.textContent;
                    if (!currentTags.includes(newTag)) {
                        currentTags.push(newTag);
                        tagsInput.value = currentTags.join(', ');
                    }
                });
            });
        }
        
        // Initial setup
        document.addEventListener('DOMContentLoaded', setupPopularTags);