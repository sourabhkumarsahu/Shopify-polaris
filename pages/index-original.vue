<template>
  <AppProvider :i18n="locales">
    <LegacyCard>
      <IndexTable
          :resourceName="resourceName"
          :itemCount="clientData.length"
          :selectable="false"
          @selection-change="handleSelectionChange"
          :headings="[
      {title: 'S.No'},
      {title: 'Collection'},
      {title: 'Action'},
      {title: 'Sort'},
]"
          :pagination="{
            hasPrevious: skip > 0,
  hasNext: skip+count < totalCount,
  onNext: () => {
             getResults(skip+count)},
  onPrevious: () => {
              getResults(skip-count)},
}"
      >
        <IndexTableRow
            v-for="({ id , title}, index) in clientData"
            :id="id"
            :key="id"
            :position="index"
            :selected="selectedResources.includes(id)">
          <IndexTableCell>
            <Text variant="bodyMd" fontWeight="bold" as="span">{{ index + skip + 1 }}</Text>
          </IndexTableCell>
          <IndexTableCell>{{ title }}</IndexTableCell>
          <IndexTableCell>
            <Button @click="goToVM(id)">Visual Merchandising</Button>
          </IndexTableCell>
          <IndexTableCell>
            <Button>Sync</Button>
          </IndexTableCell>
        </IndexTableRow>
      </IndexTable>
    </LegacyCard>
  </AppProvider>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import locales from '@ownego/polaris-vue/dist/locales/en.json';
import {useIndexResourceState, AppProvider} from '@ownego/polaris-vue';


const resourceName = {
  singular: 'collection',
  plural: 'collections',
};
const clientData = ref([]);
const skip = ref(0);
const count = ref(50);
const totalCount = ref(0);

const {selectedResources, allResourcesSelected, handleSelectionChange} = useIndexResourceState(clientData.value);

const goToVM = (collectionId:number) => {
  navigateTo(`/collection/${collectionId}/vm`)
}

const getResults = async (skipPagination: number) => {
  try {
    let response: any = await $fetch('http://localhost:3000/api/collections', {
      params: {
        skip: skipPagination,
        count: count.value,
      }
    });
    clientData.value = response.data;

    skip.value = skipPagination;
    count.value = count.value
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

const init = async () => {
  try {
    let response: any = await $fetch('http://localhost:3000/api/collections', {
      params: {
        skip: skip.value,
        count: count.value,
      }
    });
    /*if (skip.value === 0) clientData.value = response.data;
    else clientData.value.push(...response.data);*/
    clientData.value = response.data;
    totalCount.value = response.count;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

onMounted(async () => {
  await init();
});
</script>