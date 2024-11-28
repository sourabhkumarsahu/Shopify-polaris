<template>
  <AppProvider :i18n="locales">
    <Page
        fullWidth
        :backAction="{ content: 'Settings', url: '/' }"
        title="Visual Merchandising"
    >
      <template #primaryAction>
        <Button variant="primary">Sort Now</Button>
      </template>
      <LegacyCard title="Drag and drop" sectioned>
        <LegacyStack spacing="loose" vertical>
          <div class="header">
            <label for="cardsPerRow">Cards per row:</label>
            <select id="cardsPerRow" v-model="cardsPerRow">
              <option v-for="n in maxCardsPerRow" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>
          <div v-sortable="{ animation: 0, onEnd: onDragEnd }" :class="gridClass">
            <product-card v-for="(element, index) in productsToShow" :class="{ 'sortable-selected': element.selected }"
                          class="draggable rounded" :key="element.productId" :product-image="element.image?.src"
                          :product-id="element.productId" :product-name="element.title"
                          @click="onItemClick(index)"></product-card>
          </div>
          <div ref="loadMoreTrigger" class="load-more-trigger"></div>
          <p v-if="noMoreProducts">No more products to load</p>
        </LegacyStack>
        <LegacyStack v-if="isAnyProductSelected" id="navigationBar" distribution="trailing">
          <Text variant="headingXs" as="h6">
            {{ products.length }} Products
          </Text>
          <Text variant="headingXs" as="h6">
            {{ selectedProducts.length }} Selected
          </Text>
          <TextField
              :min="1"
              :max="products.length"
              type="number"
              label="Send to position"
              v-model="sendToPosition"
              autoComplete="off"
              class="flex-1"
          />
          <ButtonGroup class="flex flex-row gap-2 pt-2">
            <Button @click="send" variant="primary"
                    class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Send
            </Button>
            <Button @click="sendToTop" variant="primary">Send to Top</Button>
            <Button @click="sendToBottom" variant="primary">Send to Bottom</Button>
            <Button @click="unselectAll"
                    class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">Unselect
            </Button>
          </ButtonGroup>
        </LegacyStack>
      </LegacyCard>
    </Page>
  </AppProvider>
</template>

<script setup>
import {ref, onMounted, computed, onBeforeUnmount} from 'vue';
import {useRoute} from 'vue-router';
import locales from '@ownego/polaris-vue/dist/locales/en.json';
import {AppProvider} from "@ownego/polaris-vue";

const route = useRoute();
let collection = ref({});
let products = ref([]);
const collectionId = Number(route.params.id);
const sendToPosition = ref(0);
const productsPerPage = 50;
const skip = ref(0);
const infiniteScrollCount = ref(productsPerPage);
const noMoreProducts = ref(false);
const loadMoreTrigger = ref(null);
const isMobile = window.innerWidth < 640;
const cardsPerRow = ref(isMobile ? 2 : 6);
const selectedProducts = ref([]);

const getProducts = async () => {
  let response = await $fetch(`http://localhost:3000/api/collection/${collectionId}/products-v2`);
  products.value = response.data.products;
  loadMoreProducts();
};

const loadMoreProducts = () => {
  if (skip.value + infiniteScrollCount.value >= products.value.length) {
    noMoreProducts.value = true;
    return;
  }
  infiniteScrollCount.value += productsPerPage;
};

const onItemClick = (index) => {
  products.value[index].selected = !products.value[index].selected;
  if (products.value[index].selected) {
    selectedProducts.value.push(products.value[index]);
  } else {
    selectedProducts.value = selectedProducts.value.filter(product => product.productId !== products.value[index].productId);
  }
};

const onDragEnd = (event) => {
  console.log('drag end');
  unselectAll();
};

const unselectAll = () => {
  products.value.forEach(product => product.selected = false);
  selectedProducts.value = [];
};

const handleClickOutside = (event) => {
  if (!event.target.closest('.draggable') && !event.target.closest('#navigationBar')) {
    unselectAll();
  }
};

const send = () => {
  if (selectedProducts.value.length === 0) {
    alert('No products selected');
    return;
  }

  // Remove selected products from the list
  products.value = products.value.filter(product => !product.selected);

  // Ensure the position is within valid range
  let position = Math.max(0, Math.min(sendToPosition.value - 1, products.value.length));

  // Insert selected products at the specified position
  products.value.splice(position, 0, ...selectedProducts.value);

  // Unselect all products
  unselectAll();
};

const sendToTop = () => {
  if (selectedProducts.value.length === 0) {
    alert('No products selected');
    return;
  }

  // Remove selected products from the list
  products.value = products.value.filter(product => !product.selected);

  // Insert selected products at the top
  products.value.unshift(...selectedProducts.value);

  // Unselect all products
  unselectAll();
};

const sendToBottom = () => {
  if (selectedProducts.value.length === 0) {
    alert('No products selected');
    return;
  }

  // Remove selected products from the list
  products.value = products.value.filter(product => !product.selected);

  // Insert selected products at the bottom
  products.value.push(...selectedProducts.value);

  // Unselect all products
  unselectAll();
};

const isAnyProductSelected = computed(() => {
  return selectedProducts.value.length > 0;
});

const productsToShow = computed(() => {
  return products.value.slice(skip.value, infiniteScrollCount.value);
});

const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    loadMoreProducts();
  }
}, {
  root: null,
  rootMargin: '0px',
  threshold: 1.0
});

const gridClass = computed(() => {
  return {
    'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-1': cardsPerRow.value === 1,
    'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2': cardsPerRow.value === 2,
    'grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3': cardsPerRow.value === 3,
    'grid grid-cols-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4': cardsPerRow.value === 4,
    'grid grid-cols-5 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5': cardsPerRow.value === 5,
    'grid grid-cols-6 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-6': cardsPerRow.value === 6,
    'grid grid-cols-7 sm:grid-cols-2 md:grid-cols-7 lg:grid-cols-7': cardsPerRow.value === 7,
    'grid grid-cols-8 sm:grid-cols-2 md:grid-cols-8 lg:grid-cols-8': cardsPerRow.value === 8,
    'grid grid-cols-9 sm:grid-cols-2 md:grid-cols-9 lg:grid-cols-9': cardsPerRow.value === 9,
    'grid grid-cols-10 sm:grid-cols-2 md:grid-cols-10 lg:grid-cols-10': cardsPerRow.value === 10,
    'grid grid-cols-11 sm:grid-cols-2 md:grid-cols-11 lg:grid-cols-11': cardsPerRow.value === 11,
    'grid grid-cols-12 sm:grid-cols-2 md:grid-cols-12 lg:grid-cols-12': cardsPerRow.value === 12,
    'gap-4': true,
  };
});

const maxCardsPerRow = computed(() => {
  return window.innerWidth < 640 ? 2 : 12;
});

onMounted(async () => {
  window.addEventListener('resize', () => {
    if (window.innerWidth < 640) {
      cardsPerRow.value = 2;
    }
  });
  let response = await $fetch(`http://localhost:3000/api/collection/${collectionId}`);
  collection.value = response.data;
  if (collection.value.merchandisingMode === 1) {
    console.log('auto mode');
  }
  await getProducts();
  document.addEventListener('click', handleClickOutside);
  if (loadMoreTrigger.value) {
    observer.observe(loadMoreTrigger.value);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  if (loadMoreTrigger.value) {
    observer.unobserve(loadMoreTrigger.value);
  }
});
</script>
<style scoped>
html {
  scroll-behavior: smooth;
}

.draggable {
  position: relative;
  user-select: none; /* Disable text selection */
}

.selected-count {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: #000;
  color: #fff;
  border-radius: 50%;
  padding: 0.5em;
  font-size: 5px;
  z-index: 10;
}

.Polaris-LegacyCard + .Polaris-LegacyCard {
  margin-top: 0;
}

.rounded {
  border: 2px solid #fff;
}

.Polaris-LegacyStack.Polaris-LegacyStack--distributionTrailing {
  align-items: end;
  position: fixed;
  z-index: 9999999;
  background: #fff;
  right: 25px;
  bottom: 25px;
  border-radius: 10px 0 0 10px;
  border: 1px solid #ddd;
  padding: 0px 15px 15px 0px;
}

.sortable-selected {
  border: 2px solid #f3a109;
}

.sortable-ghost {
  color: #fff;
  border: 2px solid #61ca2f;

}

.sortable-chosen {
  //background: black;
}

.sortable-drag {
  border: 2px solid #d64f4f;

  //background: yellow;
}

.load-more-trigger {
  height: 1px;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.header label {
  margin-right: 0.5rem;
}

.grid-cols-10 {
  grid-template-columns: repeat(10, minmax(0, 1fr));
}

.grid-cols-9 {
  grid-template-columns: repeat(9, minmax(0, 1fr));
}

.grid-cols-8 {
  grid-template-columns: repeat(8, minmax(0, 1fr));
}

.grid-cols-7 {
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

.grid-cols-6 {
  grid-template-columns: repeat(6, minmax(0, 1fr));
}

.grid-cols-5 {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.grid-cols-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
</style>