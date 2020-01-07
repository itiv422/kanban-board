<template>
  <form>
    <div class="col-12 form-group">
      <label>Quote</label>
      <textarea class="form-control" rows="3" v-model="quote"></textarea>
    </div>
    <div class="offset-4 col-4 form-group">
      <button class="btn btn-primary w-100" @click.prevent="createNew">Add Quote</button>
    </div>
  </form>
</template>

<script>
export default {
  data: function() {
    return {
      quote: ""
    };
  },
  methods: {
    createNew() {
      this.$emit("quoteAdded", this.quote);
      this.quote = "";
    }
  }
};
</script>

<style></style>
