<template>
  <MediaCard
      :portrait="true"
      size="small"
      :title="productId"
      :description="productName">
    <img
        :alt="productName"
        width="100%"
        height="80%"
        :src="productImage ? productImage : '~@/assets/images/no-product-image.jpg'"
        class="w-32 h-32 object-contain object-center mx-auto"
    />
  </MediaCard>


</template>
<script setup>
import locales from '@ownego/polaris-vue/dist/locales/en.json';
import {useIndexResourceState, AppProvider} from '@ownego/polaris-vue';
const props = defineProps({
  productName: {
    required: true
  },
  productId: {
    required: true
  },
  productImage: {
    required: true
  },
});
</script>
<style scoped>

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
</style>