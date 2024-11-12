import Sortable, { MultiDrag } from 'sortablejs';

Sortable.mount(new MultiDrag());

export default {
    mounted(el, binding) {
        new Sortable(el, {
            ...binding.value,
            multiDrag: true,
            forceFallback: true,
            easing: "cubic-bezier(1, 0, 0, 1)",
            animation:150,
            scroll: true,
            scrollSensitivity: 100,
            scrollSpeed: 20,
            ghostClass: "sortable-ghost",  // Style for the element being dragged
            chosenClass: "sortable-chosen",  // Style for the chosen element
            dragClass: "sortable-drag",  // Style for the dragged element
            fallbackTolerance: 3,  // Delay for fallback mode
            selectedClass: 'sortable-selected',  // Class for selected items
        });
    },
};
