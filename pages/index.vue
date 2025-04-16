<template>
  <v-container class="fill-height" fluid>
    <div class="w-100 px-10 px-sm-0">
      <v-form ref="formRefs">
        <v-row justify="center">
          <v-col cols="12" sm="4" md="3" lg="2">
            <v-autocomplete
              v-model="selectedArea"
              label="ภาค"
              :items="areaList"
              :rules="[rules.validateArea]"
              hide-details="auto"
              @update:model-value="getProvinces"
            />
          </v-col>
          <v-col cols="12" sm="4" md="3" lg="2">
            <v-autocomplete
              v-model="selectedProvince"
              label="จังหวัด"
              :items="provincesList"
              item-title="province"
              item-value="code"
              :disabled="!selectedArea"
              :rules="[rules.validateProvince]"
              hide-details="auto"
              return-object
              @update:model-value="getDistricts"
            />
          </v-col>
          <v-col cols="12" sm="4" md="3" lg="2">
            <v-autocomplete
              v-model="selectedDistrict"
              label="อำเภอ"
              :items="districtsList"
              item-title="district"
              item-value="code"
              :disabled="!districtsList.length"
              :rules="[rules.validateDistrict]"
              hide-details="auto"
            />
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12" sm="4" md="3" lg="2">
            <v-btn block @click="goToLink">ค้นหา</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, reactive, useTemplateRef } from 'vue';
import apiData from '@/composables/apiData';
import type { Province, District } from '@/composables/typeData';

const formRefs = useTemplateRef('formRefs');

const selectedArea = ref<string | null>(null);
const selectedProvince = ref<Province | null>(null);
const selectedDistrict = ref<string | null>(null);

const areaList = reactive(['ภาคเหนือ', 'ภาคกลาง', 'ภาคตะวันออกเฉียงเหนือ', 'ภาคใต้']);

const provincesList = reactive<Province[]>([]);
const districtsList = reactive<District[]>([]);

async function getProvinces(area: string) {
  selectedProvince.value = null;
  const data = await apiData.getProvince(area);
  provincesList.splice(0, provincesList.length, ...data);
}

async function getDistricts(province: Province) {
  selectedDistrict.value = null;
  if (province.no_district) {
    districtsList.length = 0;
    return;
  }
  const provinceCode = province.code.split('_')[1];
  const data = await apiData.getDistrict(provinceCode);
  districtsList.splice(0, districtsList.length, ...data);
}

const rules = {
  validateArea: (value: string | null) => {
    if (value) return true;
    return 'กรุณาเลือกภาค';
  },
  validateProvince: (value: Province | null) => {
    if (value) return true;
    return 'กรุณาเลือกจังหวัด';
  },
  validateDistrict: (value: string | null) => {
    if (value || selectedProvince.value?.no_district) return true;
    return 'กรุณาเลือกอำเภอ';
  },
};

async function goToLink() {
  const validate = await formRefs.value?.validate();
  if (!validate?.valid) {
    return;
  }
  if (selectedProvince.value) {
    window.open(selectedProvince.value.link, '_blank');
  }
}
</script>
