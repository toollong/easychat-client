<template>
  <div
    class="modal fade"
    id="disconnected"
    tabindex="-1"
    role="dialog"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-lg modal-dialog-centered modal-dialog-zoom"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-body">
          <div class="row mb-5">
            <div class="col-md-6 offset-3">
              <img
                src="./dist/media/svg/undraw_warning_cyit.svg"
                class="img-fluid"
                alt="image"
              />
            </div>
          </div>
          <p class="lead text-center">Application disconnected</p>
        </div>
        <div class="modal-footer justify-content-center">
          <button type="button" class="btn btn-success btn-lg">
            Reconnect
          </button>
          <a href="login.html" class="btn btn-link">Logout</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Disconnected",
};
</script>

<style scoped>
</style>