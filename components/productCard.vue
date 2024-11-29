<template>
  <MediaCard
      :portrait="true"
      size="small"
      :title="`${productId}`+` `+ `${position+1}`"
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
  position:{
    required:true
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


</style>