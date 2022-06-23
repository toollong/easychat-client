<template>
  <div
    class="modal fade"
    id="newGroup"
    tabindex="-1"
    role="dialog"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-dialog-centered modal-dialog-zoom"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i data-feather="users" class="mr-2"></i> New Group
          </h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <i class="ti-close"></i>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group">
              <label for="group_name" class="col-form-label">Group name</label>
              <div class="input-group">
                <input type="text" class="form-control" id="group_name" />
                <div class="input-group-append">
                  <button
                    class="btn btn-light"
                    data-toggle="tooltip"
                    title="Emoji"
                    type="button"
                  >
                    <i data-feather="smile"></i>
                  </button>
                </div>
              </div>
            </div>
            <p class="mb-2">The group members</p>
            <div class="form-group">
              <div class="avatar-group">
                <figure
                  class="avatar"
                  data-toggle="tooltip"
                  title="Tobit Spraging"
                >
                  <span class="avatar-title bg-success rounded-circle">T</span>
                </figure>
                <figure
                  class="avatar"
                  data-toggle="tooltip"
                  title="Cloe Jeayes"
                >
                  <img
                    src="./dist/media/img/women_avatar4.jpg"
                    class="rounded-circle"
                    alt="image"
                  />
                </figure>
                <figure
                  class="avatar"
                  data-toggle="tooltip"
                  title="Marlee Perazzo"
                >
                  <span class="avatar-title bg-warning rounded-circle">M</span>
                </figure>
                <figure
                  class="avatar"
                  data-toggle="tooltip"
                  title="Stafford Pioch"
                >
                  <img
                    src="./dist/media/img/man_avatar1.jpg"
                    class="rounded-circle"
                    alt="image"
                  />
                </figure>
                <figure
                  class="avatar"
                  data-toggle="tooltip"
                  title="Bethena Langsdon"
                >
                  <span class="avatar-title bg-info rounded-circle">B</span>
                </figure>
                <a href="#" title="Add friends">
                  <figure class="avatar">
                    <span class="avatar-title bg-primary rounded-circle">
                      <i data-feather="plus"></i>
                    </span>
                  </figure>
                </a>
              </div>
            </div>
            <div class="form-group">
              <label for="description" class="col-form-label"
                >Description</label
              >
              <textarea class="form-control" id="description"></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary">Create Group</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GroupAdd",
};
</script>

<style scoped>
</style>