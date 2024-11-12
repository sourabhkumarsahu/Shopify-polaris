<template>
  <AppProvider :i18n="locales">
    <Page
        fullWidth
        :backAction="{ content: 'Settings', url: '#' }"
        title="Visual Merchandising"
    >
      <template #primaryAction>
        <Button variant="primary">Sort Now</Button>
      </template>
      <LegacyCard title="Drag and drop" sectioned>
        <LegacyStack spacing="loose" vertical>
          <div v-sortable="{ animation: 150, onEnd: onDragEnd }" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <product-card v-for="(element, index) in products" :class="{ selected: element.selected }" class="draggable rounded" :key="element.productId" :product-image="getProductImage(element)"
                          :product-id="element.productId" :product-name="element.title"
                          @click="onItemClick(index)"></product-card>
          </div>
        </LegacyStack>
        <LegacyStack v-if="products.some(product => product.selected)"  distribution="trailing">
          <TextField
              type="number"
              label="Send to position"
              v-model="sendToPosition"
              autoComplete="off"
              class="flex-1"
          />
          <ButtonGroup class="flex flex-row gap-2 pt-2">
            <Button @click="unselectAll" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">Unselect</Button>
            <Button @click="send" variant="primary" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Send</Button>
          </ButtonGroup>
        </LegacyStack>

      </LegacyCard>
    </Page>
  </AppProvider>
</template>

<script setup>
import { useRoute } from 'vue-router';
import locales from '@ownego/polaris-vue/dist/locales/en.json';
import { AppProvider } from "@ownego/polaris-vue";
import { ref, onMounted } from 'vue';

const route = useRoute();
let collection = ref({});
let products = ref([]);
const collectionId = Number(route.params.id);
const sendToPosition = ref(0);

const getProducts = async () => {
  let response = await $fetch(`http://localhost:3000/api/collection/${collectionId}/products-v2`);
  products.value = response.data.products;
  console.log(products.value);
};

const onItemClick = (index) => {
  products.value[index].selected = !products.value[index].selected;
};

const onDragEnd = (event) => {
  // Handle drag end
};
const unselectAll = () => {
  products.value.forEach(product => product.selected = false);
};

const send = () => {
  // Handle send
};

const getProductImage = (element) => {
  return element.image && element.image.src ? element.image.src : require('~/assets/images/no-product-image.jpg');
};

onMounted(async () => {
  let response = await $fetch(`http://localhost:3000/api/collection/${collectionId}`);
  collection.value = response.data;
  if (collection.value.merchandisingMode === 1) {
    console.log('auto mode');
  }
  await getProducts();
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

.selected {
  border: 2px solid #f3a109;
}
</style>