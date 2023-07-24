<template>
  <div>
    <div class="box-crop-img">
      <vue-cropper
        ref="cropper"
        :img="option.img"
        :output-size="option.size"
        :output-type="option.outputType"
        :info="true"
        :full="option.full"
        :can-move="option.canMove"
        :can-move-box="option.canMoveBox"
        :fixed-box="option.fixedBox"
        :original="option.original"
        :auto-crop="option.autoCrop"
        :auto-crop-width="option.autoCropWidth"
        :auto-crop-height="option.autoCropHeight"
        :center-box="option.centerBox"
        :high="option.high"
        :check-orientation="false"
        mode="cover"
        :max-img-size="option.max"
        :fixed="fixed"
        :fixed-number="fixedNumber"
      />
    </div>
    <div class="icon-wrapper">
      <span
        class="cursor-pointer"
        @click="sliderValue -= 5"
      >
        <!--          <i class="feather-zoom-out text-grey-700  font-xs fw-500"></i>-->
      </span>
      <!--      <a-slider :min="0" :max="100" v-model:value="sliderValue"/>-->
      <q-slider
        v-model="sliderValue"
        :min="0"
        :max="100"
        :step="20"
        label
        color="deep-orange"
      />
      <span
        class="cursor-pointer"
        @click="sliderValue += 5"
      >
        <!--          <i class="feather-zoom-in text-grey-700  font-xs fw-500"></i>-->
      </span>
    </div>
  </div>
  <!-- <a-slider v-model:value="sliderValue"  />-->
</template>

<script>
//
import VueCropper from 'vue-cropper';

export default {
  name: 'cropImage',
  components: {
    VueCropper,
  },
  props: ['imageUrl'],
  data() {
    return {
      // sliderOptions: {
      //   min: 10,
      //   max: 100,
      //   step: 5
      // },
      sliderValue: 20,
      option: {
        img: this.imageUrl,
        size: 1,
        full: false,
        outputType: 'png',
        canMove: true,
        fixedBox: false,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        autoCropWidth: 200,
        autoCropHeight: 200,
        centerBox: false,
        high: true,
        max: 99999,
      },
      fixedNumber: [16, 16],
      fixed: true,
    };
  },
  methods: {
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    closeCrop() {
      this.$emit('close');
    },
    getCropImage() {
      this.$refs.cropper.getCropData((data) => {
        // this.$emit('getData', data)
        console.log(data);
        fetch(data)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], 'avatar', { type: 'image/png' });
            this.$emit('getData', file);
          });
        // this.closeCrop()
      });
    },
  },
  watch: {
    sliderValue(newVal, oldVal) {
      return this.$refs.cropper.changeScale(newVal - oldVal);
    },
  },
};
</script>

<style lang="scss" scoped>
.box-crop-img {
  margin-bottom: 5rem;
  width: 500px;
  height: 500px;
  //margin: 30px auto;
}

.icon-wrapper {
  display: flex;
  justify-content: space-between;

  .ant-slider {
    width: 70%;
    margin: 5px 6px 10px;
  }
}
</style>
