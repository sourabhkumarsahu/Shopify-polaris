import Sortable, { MultiDrag } from 'sortablejs';

Sortable.mount(new MultiDrag());

export default {
    mounted(el, binding) {
        new Sortable(el, {
            ...binding.value,
            multiDrag: true,
            forceFallback: true,
            scroll: true,
            scrollSensitivity: 100,
            scrollSpeed:20,
            fallbackTolerance:10,
            selectedClass: 'selected',
            ghostClass: 'sortable-ghost',
            onStart: (evt) => {
                updateGhostCount(evt);
            },
            onEnd: (evt) => {
                removeGhostCount(evt);
            },
        });
    },
};

function updateGhostCount(evt) {
    const selectedItems = evt.from.querySelectorAll('.selected');
    console.log(selectedItems)
    if (selectedItems.length > 1) {
        let badge = document.createElement('span');
        badge.className = 'ghost-count';
        badge.textContent = `+${selectedItems.length - 1}`;
        evt.item.appendChild(badge);
    }
}

function removeGhostCount(evt) {
    const badge = evt.item.querySelector('.ghost-count');
    if (badge) {
        badge.remove();
    }
}