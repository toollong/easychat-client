<template>
  <div
    class="modal call fade"
    id="videoCall"
    tabindex="-1"
    role="dialog"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-dialog-centered modal-dialog-zoom"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-body">
          <div class="call">
            <div>
              <figure class="mb-4 avatar avatar-xl">
                <img
                  src="./dist/media/img/women_avatar1.jpg"
                  class="rounded-circle"
                  alt="image"
                />
              </figure>
              <h4>
                Brietta Blogg <span class="text-success">video calling...</span>
              </h4>
              <div class="action-button">
                <button
                  type="button"
                  class="btn btn-danger btn-floating btn-lg"
                  data-dismiss="modal"
                >
                  <i data-feather="x"></i>
                </button>
                <button
                  type="button"
                  class="btn btn-success btn-pulse btn-floating btn-lg"
                >
                  <i data-feather="video"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CallVideo",
};
</script>

<style scoped>
</style>