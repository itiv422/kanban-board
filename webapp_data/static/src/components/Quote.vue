<template>
  <div class="col-sm-6 col-md-4 col-lg-3">
    <div class="card">
      <div class="card-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["quotes"]
};
</script>

<style>
.card-body {
  font-size: 24px;
  color: #6e6e6e;
  cursor: pointer;
}

.card-body:hover {
  background-color: #ffe2e2;
}
</style>
