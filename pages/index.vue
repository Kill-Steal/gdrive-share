<template>
  <v-container class="fill-height" fluid>
    <!-- Header -->
    <div class="position-fixed w-100" style="height: 30%; top: 20px; left: 20px">
      <v-img src="/logo.jpg" width="250" absolute />
      <h1 style="color: red; font-size: 52px; text-align: center">
        โปรแกรมป้องกันไวรัสคอมพิวเตอร์ (Antivirus)<br />สำหรับ กรมการพัฒนาชุมชน ปีงบประมาณ 2568
      </h1>
      <div />
    </div>

    <!-- Main Content-->
    <div style="width: 25%" />
    <div style="width: 50%">
      <div class="d-flex">
        <div class="d-flex justify-end align-center" style="flex: 1">
          <h1 class="mr-16">กรุณาเลือกพื้นที่</h1>
        </div>
        <v-form ref="formRefs" style="flex: 2">
          <v-row justify="center">
            <v-col cols="12">
              <p>ภาค :</p>
              <v-autocomplete
                v-model="selectedArea"
                label="กรุณาเลือกภาค"
                :items="areaList"
                :rules="[rules.validateArea]"
                hide-details="auto"
                @update:model-value="getProvinces"
              />
            </v-col>
            <v-col cols="12">
              <p>จังหวัด :</p>
              <v-autocomplete
                v-model="selectedProvince"
                label="กรุณาเลือกจังหวัด"
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
            <v-col cols="12">
              <p>อำเภอ :</p>
              <v-autocomplete
                v-model="selectedDistrict"
                label="กรุณาเลือกอำเภอ"
                :items="districtsList"
                item-title="district"
                item-value="code"
                :disabled="!districtsList.length"
                :rules="[rules.validateDistrict]"
                hide-details="auto"
              />
            </v-col>
          </v-row>
        </v-form>
      </div>
      <div class="d-flex justify-center align-center mt-8" style="margin-left: 250px">
        <v-btn class="rounded-circle" color="red" style="height: 8vw; width: 8vw" @click="goToLink">ดาวน์โหลด<br />โปรแกรม</v-btn>
      </div>
    </div>

    <!-- Footer Left -->
    <div class="position-fixed bottom-0 w-100" style="height: 25%; left: 20px">
      <p class="mb-6 text-red text-decoration-underline" style="font-size: 26px">ข้อควรระวัง !!!!!</p>
      <p style="font-size: 26px">
        การดาวน์โหลดโปรแกรมสำหรับติดตั้ง
        <span class="text-red">"ต้องเป็น<br />จังหวัดของเราเท่านั้น"</span> ห้ามนำโปรแกรมติดตั้ง<br />ของจังหวัดอื่นมาทำการติดตั้งเด็ดขาด
      </p>
    </div>

    <!-- Footer Right -->
    <div class="position-fixed right-0 bottom-0" style="height: 30%">
      <v-img src="/logo2.jpg" width="600" />
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
